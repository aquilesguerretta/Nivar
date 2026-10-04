import struct
import io
import uuid
from pypdf import PdfReader, PdfWriter
import pytest
from tests.ariadne_close.test_review_desk_api import api, gates, new_review
from tests.ariadne_close.test_api import post
from tests.ariadne_close.test_intake import pdf_bytes


def test_private_page_preview_is_png_and_owned(api, monkeypatch):
    _, root = new_review(api)
    source = (
        api["client"]
        .post(
            root + "/sources",
            data={"role": "context"},
            files={"file": ("source.pdf", pdf_bytes(), "application/pdf")},
            headers={"Idempotency-Key": str(uuid.uuid4())},
        )
        .json()["id"]
    )
    path = root + f"/sources/{source}/pages/1/image"
    result = api["client"].get(path)
    assert result.status_code == 200, result.text
    assert result.content.startswith(b"\x89PNG\r\n\x1a\n")
    assert max(struct.unpack(">II", result.content[16:24])) <= 1600
    assert result.headers["cache-control"] == "no-store"
    assert api["client"].get(path.replace("/pages/1/", "/pages/2/")).status_code == 422
    api["state"]["expired"] = True
    assert api["client"].get(path).status_code == 401
    api["state"]["expired"] = False
    api["state"]["user"] = api["other"]
    assert api["client"].get(path).status_code == 403
    monkeypatch.setenv("ADVISORY_OPERATOR_EMAIL", api["other"].email)
    assert api["client"].get(path).status_code == 404


def test_renderer_bounds_active_content_and_timeout():
    from app.services.ariadne_close_pages import render_page

    active = PdfWriter()
    active.add_page(PdfReader(io.BytesIO(pdf_bytes())).pages[0])
    active.add_js('app.alert("untrusted")')
    output = io.BytesIO()
    active.write(output)
    for data, page in [(b"not pdf", 1), (pdf_bytes(), 0), (output.getvalue(), 1)]:
        with pytest.raises(ValueError):
            render_page(data, page)
    with pytest.raises(ValueError, match="Tempo"):
        render_page(pdf_bytes(), 1, timeout=0)


@pytest.mark.parametrize("subtype", ["/Form", "/Image"])
def test_raster_rejects_unbounded_native_resources(subtype):
    from pypdf.generic import DecodedStreamObject, NameObject, NumberObject
    from app.services.ariadne_close_pages import _raster_budget

    writer = PdfWriter()
    writer.add_blank_page(width=300, height=300)
    obj = DecodedStreamObject()
    obj.set_data(b"passive")
    obj[NameObject("/Subtype")] = NameObject(subtype)
    obj[NameObject("/Width")] = NumberObject(100000)
    obj[NameObject("/Height")] = NumberObject(100000)
    writer._add_object(obj)
    output = io.BytesIO()
    writer.write(output)
    with pytest.raises(ValueError):
        _raster_budget(output.getvalue())


def test_spawn_failure_does_not_exhaust_preview_slots(monkeypatch):
    from app.services import ariadne_close_pages as pages

    class Failure:
        def start(self):
            raise OSError("local process creation failed")

    class Context:
        Pipe = staticmethod(pages.mp.Pipe)
        Process = staticmethod(lambda **kwargs: Failure())

    monkeypatch.setattr(pages.mp, "get_context", lambda *args: Context())
    for _ in range(3):
        with pytest.raises(OSError):
            pages.render_page(pdf_bytes(), 1)
    assert pages._slots.acquire(blocking=False)
    pages._slots.release()
