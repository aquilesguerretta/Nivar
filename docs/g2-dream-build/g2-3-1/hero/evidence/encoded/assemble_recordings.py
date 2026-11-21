"""Assemble recorded CUA frames. No runtime files or original frames are changed."""
from pathlib import Path
from PIL import Image, ImageChops
from collections import Counter
import hashlib
import json
import shutil
import subprocess
import argparse

ROOT = Path(__file__).resolve().parent
FFMPEG = shutil.which('ffmpeg')
FFPROBE = shutil.which('ffprobe')
assert FFMPEG and FFPROBE

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def run(args):
    completed = subprocess.run(args, capture_output=True, text=True)
    if completed.returncode:
        raise RuntimeError(completed.stderr[-6000:])
    return completed

def assemble(name, source, frames, crop=None, crop_mode='uniform-padding', omitted_frames=None):
    assert len(frames) > 1
    assert all(b['elapsedMs'] > a['elapsedMs'] for a, b in zip(frames, frames[1:]))
    prepared = ROOT / (name + '-prepared')
    prepared.mkdir(exist_ok=True)
    bounds, sizes, colors = Counter(), Counter(), Counter()
    records = []
    input_paths = []
    for frame in frames:
        raw = source / frame['file']
        with Image.open(raw) as opened:
            im = opened.convert('RGB')
            sizes[im.size] += 1
            if crop:
                assert 0 <= crop[0] < crop[2] <= im.width and 0 <= crop[1] < crop[3] <= im.height
                if crop_mode == 'uniform-padding':
                    background = im.getpixel((im.width - 1, im.height - 1))
                    box = ImageChops.difference(im, Image.new('RGB', im.size, background)).getbbox()
                    bounds[box] += 1
                    colors[background] += 1
                    assert box == crop, (raw.name, box, crop)
                im = im.crop(crop)
            out = prepared / raw.name
            im.save(out)
            input_paths.append(out)
            records.append({**frame, 'rawSha256': digest(raw), 'preparedSha256': digest(out)})
    manifest = ROOT / (name + '.ffconcat')
    lines = ['ffconcat version 1.0']
    for i, path in enumerate(input_paths):
        lines += ["file '" + path.as_posix().replace("'", "'\\''") + "'", 'option framerate 1000']
        if i + 1 < len(frames):
            lines += [f"duration {(frames[i+1]['elapsedMs'] - frames[i]['elapsedMs']) / 1000:.3f}"]
    manifest.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    common = [FFMPEG, '-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(manifest), '-an']
    timing = ['-fps_mode', 'vfr', '-enc_time_base', '1:1000', '-video_track_timescale', '1000', '-movflags', '+faststart']
    master = ROOT / (name + '-rgb-lossless.mp4')
    preview = ROOT / (name + '.mp4')
    master_args = common + ['-c:v', 'libx264rgb', '-crf', '0', '-preset', 'medium', '-pix_fmt', 'rgb24', '-bf', '0'] + timing + [str(master)]
    preview_args = common + ['-vf', 'pad=ceil(iw/2)*2:ceil(ih/2)*2:0:0:color=0x121117,format=yuv420p', '-c:v', 'libx264', '-crf', '15', '-preset', 'medium', '-bf', '0'] + timing + [str(preview)]
    run(master_args)
    run(preview_args)
    probes = {}
    for output in (master, preview):
        probe = json.loads(run([FFPROBE, '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=codec_name,profile,width,height,pix_fmt,avg_frame_rate,r_frame_rate,time_base,nb_frames,duration:format=duration,size', '-of', 'json', str(output)]).stdout)
        assert int(probe['streams'][0]['nb_frames']) == len(frames), (output, probe)
        probes[output.name] = probe
    decoded = prepared / 'decoded-master-first.png'
    run([FFMPEG, '-hide_banner', '-loglevel', 'error', '-y', '-i', str(master), '-frames:v', '1', '-update', '1', str(decoded)])
    with Image.open(decoded) as a, Image.open(input_paths[0]) as b:
        assert ImageChops.difference(a.convert('RGB'), b.convert('RGB')).getbbox() is None
    width, height = Image.open(input_paths[0]).size
    decoded_hashes = run([FFMPEG, '-hide_banner', '-loglevel', 'error', '-i', str(master), '-fps_mode', 'passthrough', '-pix_fmt', 'rgb24', '-f', 'framemd5', 'pipe:1']).stdout
    hashes = [line.rsplit(',', 1)[1].strip() for line in decoded_hashes.splitlines() if line and not line.startswith('#')]
    assert len(hashes) == len(input_paths), 'Unexpected decoded frame count'
    for path, actual in zip(input_paths, hashes):
        expected = hashlib.md5(Image.open(path).convert('RGB').tobytes()).hexdigest()
        assert actual == expected, f'RGB master mismatch: {path.name}'
    packets = json.loads(run([FFPROBE, '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'packet=pts_time,duration_time', '-of', 'json', str(master)]).stdout)['packets']
    for packet, frame in zip(packets, frames):
        expected = (frame['elapsedMs'] - frames[0]['elapsedMs']) / 1000
        assert abs(float(packet['pts_time']) - expected) <= 0.00001, (packet, expected)
    provenance = {
        'sourceDirectory': str(source), 'frameCount': len(frames),
        'omittedInitialBlankFrames': omitted_frames or [],
        'sourceImageSizes': {str(k): v for k, v in sizes.items()},
        'cropExclusiveBounds': crop, 'verifiedNonPaddingBoundsAcrossFrames': {str(k): v for k, v in bounds.items()},
        'cropMode': crop_mode if crop else 'none',
        'cropExplanation': 'Fixed recorded product iframe rectangle. Removes only the surrounding QA harness; no rescale. Browser-measured iframe bounds must accompany this capture.' if crop and crop_mode == 'product-iframe' else None,
        'paddingRgb': {str(k): v for k, v in colors.items()},
        'elapsedFirstMs': frames[0]['elapsedMs'], 'elapsedLastMs': frames[-1]['elapsedMs'],
        'durationBetweenFirstAndLastCaptureMs': frames[-1]['elapsedMs'] - frames[0]['elapsedMs'],
        'timing': 'VFR; each source held to next actual elapsed timestamp. First timestamp normalized to zero. Final frame has 1 ms minimum packet duration; no inferred tail hold. No interpolation or invented intermediate frames.',
        'rgbMaster': 'Lossless libx264rgb, original prepared dimensions. Every decoded RGB frame verified pixel-identical to prepared PNG in source order.',
        'preview': 'H.264 yuv420p CRF15. Native spatial resolution retained; odd dimensions padded to even. Chroma conversion/compression changes colors, so use PNGs or RGB master for pixel-exact inspection.',
        'commands': {'master': master_args, 'preview': preview_args},
        'probes': probes, 'packets': packets, 'frames': records,
    }
    (ROOT / (name + '-provenance.json')).write_text(json.dumps(provenance, indent=2), encoding='utf-8')
    return {'name': name, 'frames': len(frames), 'probes': probes, 'crop': crop, 'pixelExactAllFrames': True, 'allTimestampPtsMatch': True}

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--name')
    parser.add_argument('--source')
    parser.add_argument('--metadata', default='metadata.json')
    parser.add_argument('--crop-auto', action='store_true')
    parser.add_argument('--crop-iframe', nargs=4, type=int, metavar=('LEFT', 'TOP', 'RIGHT', 'BOTTOM'))
    parser.add_argument('--trim-initial-blank-iframe', action='store_true')
    parser.add_argument('--trim-initial-unpainted-dark-iframe', action='store_true', help='Use only after visual inspection confirms initial dark paint with no product UI. Stops at first nonblank frame.')
    args = parser.parse_args()
    if args.name:
        source = Path(args.source)
        metadata = json.loads((source / args.metadata).read_text(encoding='utf-8-sig'))
        if isinstance(metadata, dict) and 'timings' in metadata:
            states = {state['frame']: state for state in metadata.get('states', [])}
            frames = [{'file': f"frame-{frame['frame']:04d}.png", 'elapsed': frame['elapsed'], 'state': states.get(frame['frame'])} for frame in metadata['timings']]
        else:
            frames = metadata['frames'] if isinstance(metadata, dict) else metadata
        frames = [{**frame, 'elapsedMs': round(frame['elapsed'] * 1000)} if 'elapsedMs' not in frame else frame for frame in frames]
        crop = None
        assert not (args.crop_auto and args.crop_iframe), 'Choose only one crop mode'
        if args.crop_auto:
            im = Image.open(source / frames[0]['file']).convert('RGB')
            bg = im.getpixel((im.width-1, im.height-1))
            crop = ImageChops.difference(im, Image.new('RGB', im.size, bg)).getbbox()
        if args.crop_iframe:
            crop = tuple(args.crop_iframe)
        omitted = []
        if args.trim_initial_blank_iframe or args.trim_initial_unpainted_dark_iframe:
            assert args.crop_iframe, 'Blank trim requires a recorded product iframe rectangle'
            while frames:
                raw = source / frames[0]['file']
                im = Image.open(raw).convert('RGB').crop(crop)
                extrema = im.getextrema()
                uniform = all(low == high for low, high in extrema)
                unpainted_dark = args.trim_initial_unpainted_dark_iframe and max(high for low, high in extrema) < 64
                if not (uniform or unpainted_dark):
                    break
                omitted.append({**frames.pop(0), 'rawSha256': digest(raw), 'reason': 'Entire recorded iframe rectangle is a single uniform color before initial product paint.' if uniform else 'Visually inspected initial unpainted dark iframe; no product UI. All RGB channel maxima below64. Original retained.', 'channelExtrema': extrema, 'uniformRgb': im.getpixel((0, 0)) if uniform else None})
            assert frames, 'No painted product frame remains'
        results = [assemble(args.name, source, frames, crop, 'product-iframe' if args.crop_iframe else 'uniform-padding', omitted)]
    else:
        mobile_dir = ROOT / 'mobile-390'
        mobile = json.loads((mobile_dir / 'metadata.json').read_text(encoding='utf-8-sig'))
        desktop_dir = ROOT.parent.parent / 'critics' / 'fresh-motion-evidence'
        desktop = json.loads((desktop_dir / 'desktop-framed-metadata.json').read_text(encoding='utf-8-sig'))['frames']
        results = [assemble('hero-mobile-390-native', mobile_dir, mobile, (0, 0, 225, 481)), assemble('hero-desktop-1280-sampled', desktop_dir, desktop)]
    (ROOT / ((args.name or 'historical') + '-validation.json')).write_text(json.dumps(results, indent=2), encoding='utf-8')
    print(json.dumps(results, indent=2))
