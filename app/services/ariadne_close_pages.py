"""Private, bounded raster preview; no form environment, scripts, OCR or URLs."""

import io
import math
import multiprocessing as mp
import threading
import zlib

from app.services.ariadne_close_intake import MAX_BYTES, MAX_EXPANDED, parse_file

_slots = threading.BoundedSemaphore(2)


def _raster_budget(data):
    from pypdf import PdfReader
    from pypdf.generic import IndirectObject
    from PIL import Image

    reader = PdfReader(io.BytesIO(data), strict=True)
    budget = 0
    for generation, objects in reader.xref.items():
        for object_id in objects:
            if not object_id:
                continue
            obj = reader.get_object(IndirectObject(object_id, generation, reader))
            if not isinstance(obj, dict):
                continue
            subtype = obj.get("/Subtype")
            if subtype == "/Form":
                raise ValueError("Form XObjects require a separate bounded renderer")
            if subtype != "/Image":
                continue
            width, height = int(obj.get("/Width", 0)), int(obj.get("/Height", 0))
            if (
                not 0 < width <= 5000
                or not 0 < height <= 5000
                or width * height > 2500000
            ):
                raise ValueError()
            # Conservative decoded allocation allowance, including masks/channels.
            budget += width * height * 8
            if budget > MAX_EXPANDED or int(obj.get("/BitsPerComponent", 8)) not in (
                1,
                8,
            ):
                raise ValueError()
            encoded = obj._data
            filter_name = obj.get("/Filter")
            if filter_name in ("/DCTDecode", "/JPXDecode"):
                with Image.open(io.BytesIO(encoded)) as image:
                    if image.size != (width, height):
                        raise ValueError()
            elif filter_name == "/FlateDecode":
                decoder = zlib.decompressobj()
                decoded = decoder.decompress(encoded, MAX_EXPANDED + 1)
                if len(decoded) > MAX_EXPANDED or not decoder.eof:
                    raise ValueError()
            elif filter_name is not None or len(encoded) > MAX_EXPANDED:
                raise ValueError()


def _worker(connection, data, number):
    import logging

    logging.disable(logging.CRITICAL)
    try:
        # Repeat the active-content guard inside the disposable process, even
        # for retained sources. Rendering never makes text authoritative.
        preview = parse_file(data, "source.pdf")
        if preview["kind"] != "pdf" or not 1 <= number <= len(preview["pages"]):
            raise ValueError()
        _raster_budget(data)
        import pypdfium2 as pdfium

        with pdfium.PdfDocument(data) as document:
            page = document[number - 1]
            width, height = page.get_size()
            if not all(math.isfinite(v) and 0 < v <= 20000 for v in (width, height)):
                raise ValueError()
            bitmap = page.render(
                scale=min(2, 1600 / max(width, height)),
                may_draw_forms=False,
                draw_annots=False,
            )
            try:
                output = io.BytesIO()
                bitmap.to_pil().save(output, format="PNG")
                image = output.getvalue()
                if len(image) > MAX_BYTES:
                    raise ValueError()
                connection.send((True, image))
            finally:
                bitmap.close()
                page.close()
    except Exception:
        connection.send((False, "Página indisponível ou limite seguro excedido"))
    finally:
        connection.close()


def render_page(data, number, *, timeout=10):
    if not 0 < len(data) <= MAX_BYTES or not 1 <= number <= 100:
        raise ValueError("Página indisponível ou limite seguro excedido")
    if not _slots.acquire(blocking=False):
        raise ValueError("Prévia ocupada; tente novamente")
    parent = child = process = None
    started = False
    try:
        ctx = mp.get_context("spawn")
        parent, child = ctx.Pipe(duplex=False)
        process = ctx.Process(target=_worker, args=(child, data, number), daemon=True)
        process.start()
        started = True
        child.close()
        if not parent.poll(timeout):
            raise ValueError("Tempo de processamento da página excedido")
        try:
            ok, result = parent.recv()
        except (EOFError, OSError) as exc:
            raise ValueError("Página indisponível ou limite seguro excedido") from exc
        if not ok:
            raise ValueError(result)
        return result
    finally:
        try:
            if process and started:
                if process.is_alive():
                    process.terminate()
                process.join(timeout=1)
            if parent:
                parent.close()
            if child:
                child.close()
        finally:
            _slots.release()
