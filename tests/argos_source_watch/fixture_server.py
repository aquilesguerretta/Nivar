"""Scripted loopback HTTP fixture. Run as a module for the reviewer demo."""

from collections import deque
from contextlib import contextmanager
from dataclasses import dataclass, field
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Event, Thread
from time import sleep

URL = "http://127.0.0.1:5284/capacity.csv"
LAST_MODIFIED = "Wed, 16 Sep 2026 12:00:00 GMT"
FIXTURES = Path(__file__).resolve().parents[1] / "argos_memory/fixtures/ons_capacidade_geracao"


@dataclass(frozen=True)
class Reply:
    status: int
    body: bytes = b""
    headers: dict[str, str] = field(default_factory=dict)
    delay: float = 0
    release: Event | None = None


def archived_fixtures() -> tuple[bytes, bytes, bytes]:
    baseline = (FIXTURES / "fixture_a.csv").read_bytes()
    changed = (FIXTURES / "fixture_b_known_field_change.csv").read_bytes()
    header, *rows = changed.splitlines(keepends=True)
    return baseline, changed, header + b"".join(reversed(rows))


def script() -> list[Reply]:
    baseline, changed, reordered = archived_fixtures()
    return [
        Reply(200, baseline, {"ETag": '"a"', "Last-Modified": LAST_MODIFIED}),
        Reply(304),
        Reply(503), Reply(503), Reply(503),
        Reply(429, headers={"Retry-After": "0"}),
        Reply(200, changed, {"ETag": '"b"'}),
        Reply(200, reordered, {"ETag": '"c"'}),
        Reply(200, reordered, {"ETag": '"d"'}),
    ]


@contextmanager
def fixture_server(replies: list[Reply]):
    queue = deque(replies)
    requests = []
    received = Event()

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            requests.append((self.path, dict(self.headers.items())))
            reply = queue.popleft() if queue else Reply(500)
            received.set()
            if reply.release:
                reply.release.wait(5)
            if reply.delay:
                sleep(reply.delay)
            self.send_response(reply.status)
            self.send_header("Content-Type", "text/csv")
            if "Content-Length" not in reply.headers:
                self.send_header("Content-Length", str(len(reply.body)))
            for key, value in reply.headers.items():
                self.send_header(key, value)
            try:
                self.end_headers()
                self.wfile.write(reply.body)
            except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
                pass

        def log_message(self, *args):
            pass

    with ThreadingHTTPServer(("127.0.0.1", 5284), Handler) as server:
        thread = Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            yield requests, received
        finally:
            server.shutdown()
            thread.join()


if __name__ == "__main__":
    try:
        with fixture_server(script()):
            print(f"SYNTHETIC FIXTURE {URL}", flush=True)
            Event().wait()
    except KeyboardInterrupt:
        pass
