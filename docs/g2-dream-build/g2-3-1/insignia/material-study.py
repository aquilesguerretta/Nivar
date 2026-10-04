"""Five compact masters physically incised into a new procedural surface.

Standalone Blender 5.2 script. No existing scene, font, stock texture or image.
Run: blender --background --factory-startup --python material-study.py
"""
import bpy
import json
import re
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parent
DATA = json.loads((ROOT / 'candidates.json').read_text(encoding='utf-8'))


def contours(path):
    tokens = re.findall(r'[A-Za-z]|[-+]?(?:\d*\.\d+|\d+)', path)
    i = 0
    p = (0, 0)
    points = []
    result = []
    while i < len(tokens):
        command = tokens[i]
        i += 1
        if command == 'Z':
            result.append(points)
            points = []
            continue
        n = {'M': 2, 'L': 2, 'H': 1, 'V': 1, 'C': 6}[command]
        values = list(map(float, tokens[i:i+n]))
        i += n
        if command in ('M', 'L'):
            p = tuple(values)
            points.append(p)
        elif command == 'H':
            p = (values[0], p[1])
            points.append(p)
        elif command == 'V':
            p = (p[0], values[0])
            points.append(p)
        else:
            a, b, end = values[:2], values[2:4], values[4:]
            start = p
            for j in range(1, 33):
                t, u = j/32, 1-j/32
                points.append(tuple(u**3*start[k]+3*u*u*t*a[k]+3*u*t*t*b[k]+t**3*end[k] for k in (0,1)))
            p = tuple(end)
    return result


def rgba(hex_value):
    return tuple((int(hex_value[i:i+2], 16)/255)**2.2 for i in (0,2,4)) + (1,)


def material(name, color, roughness):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    shader = nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = rgba(color)
    shader.inputs['Roughness'].default_value = roughness
    noise = nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = 780
    noise.inputs['Detail'].default_value = 2.7
    bump = nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = .3
    bump.inputs['Distance'].default_value = .00008
    mat.node_tree.links.new(noise.outputs['Fac'], bump.inputs['Height'])
    mat.node_tree.links.new(bump.outputs['Normal'], shader.inputs['Normal'])
    return mat


def aim(obj, point):
    obj.rotation_euler = (Vector(point)-obj.location).to_track_quat('-Z','Y').to_euler()


bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
bpy.context.preferences.filepaths.save_version = 0
scene.unit_settings.system = 'METRIC'
scene.render.engine = 'CYCLES'
scene.cycles.samples = 48
scene.cycles.use_denoising = True
scene.render.resolution_x = 1600
scene.render.resolution_y = 800
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.view_settings.view_transform = 'AgX'
scene.world.use_nodes = True
scene.world.node_tree.nodes.get('Background').inputs['Strength'].default_value = .07

paper = material('Uncoated mineral paper', 'E4D9CB', .89)
ink = material('Violet graphite / inside physical incision', '382F3D', .91)
graphite = material('Graphite composite', '302A35', .86)
reverse_ink = material('Mineral pigment / inside physical incision', 'ACA0B5', .92)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0,0,-.003))
surface = bpy.context.object
surface.name = 'Five original family marks / 0.4 mm intaglio'
surface.dimensions = (1.6,1.2,.006)
bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
surface.data.materials.append(paper)
floors = []
for fi, family in enumerate(DATA['families']):
    for pi, path in enumerate(family['routes'][1]['paths']):
        curve = bpy.data.curves.new(f"{family['patron']} / exact master {pi}", 'CURVE')
        curve.dimensions = '2D'
        curve.fill_mode = 'BOTH'
        curve.extrude = .0008
        for points in contours(path):
            spline = curve.splines.new('POLY')
            spline.points.add(len(points)-1)
            for point, (x,y) in zip(spline.points, points):
                point.co = ((x-16)*.003 + (fi-2)*.133, (16-y)*.003, 0, 1)
            spline.use_cyclic_u = True
        cutter = bpy.data.objects.new(f"{family['id']} / physical cutter", curve)
        bpy.context.collection.objects.link(cutter)
        cutter.location.z = .0004
        bpy.ops.object.select_all(action='DESELECT')
        cutter.select_set(True)
        bpy.context.view_layer.objects.active = cutter
        bpy.ops.object.convert(target='MESH')
        cutter = bpy.context.object
        bpy.context.view_layer.objects.active = surface
        modifier = surface.modifiers.new(f"{family['id']} / subtract shape {pi}", 'BOOLEAN')
        modifier.operation = 'DIFFERENCE'
        modifier.solver = 'EXACT'
        modifier.object = cutter
        bpy.ops.object.modifier_apply(modifier=modifier.name)
        cutter.hide_render = True
        cutter.hide_viewport = True
        floor_curve = curve.copy()
        floor_curve.extrude = 0
        floor_obj = bpy.data.objects.new(f"{family['id']} / recessed pigment {pi}", floor_curve)
        bpy.context.collection.objects.link(floor_obj)
        floor_obj.location.z = -.00039
        floor_obj.data.materials.append(ink)
        floors.append(floor_obj)

bevel = surface.modifiers.new('Physical cut edge / 20 micrometres', 'BEVEL')
bevel.width = .00002
bevel.segments = 2

bpy.ops.object.camera_add(location=(.012,-.26,.66))
camera = bpy.context.object
camera.name = 'Five masters / raking macro'
camera.data.type = 'ORTHO'
camera.data.ortho_scale = .74
aim(camera, (0,0,0))
scene.camera = camera

for name, location, energy, size, color in [
    ('Raking warm key', (-.28,.03,.20), 2.8, .18, (1,.89,.80)),
    ('Soft violet fill', (.28,-.18,.40), .9, .35, (.78,.83,1)),
]:
    bpy.ops.object.light_add(type='AREA', location=location)
    light = bpy.context.object
    light.name = name
    light.data.energy = energy
    light.data.shape = 'DISK'
    light.data.size = size
    light.data.color = color
    aim(light, (0,0,0))

for theme, substrate, pigment in [('mineral',paper,ink),('graphite',graphite,reverse_ink)]:
    surface.data.materials[0] = substrate
    for obj in floors:
        obj.data.materials[0] = pigment
    scene.render.filepath = str(ROOT / f'material-{theme}.png')
    bpy.ops.render.render(write_still=True)

# A genuine macro view lets the reader inspect the same 0.4 mm physical cut.
surface.data.materials[0] = paper
for obj in floors:
    obj.data.materials[0] = ink
camera.location = (.13,-.18,.25)
camera.data.ortho_scale = .15
aim(camera, (.133,0,0))
scene.render.resolution_x = 1200
scene.render.resolution_y = 900
scene.render.filepath = str(ROOT / 'material-macro-ariadne.png')
bpy.ops.render.render(write_still=True)

bpy.ops.wm.save_as_mainfile(filepath=str(ROOT / 'nivar-g231-five-insignias.blend'))
(ROOT / 'material-manifest.json').write_text(json.dumps({
    'method':'New Blender 5.2 scene. Boolean intaglio cut from the selected compact SVG paths. Cubic boundaries sampled at 32 subdivisions. No imported texture, model, font, generated image, or existing scene.',
    'incision_depth_m':.0004,
    'edge_radius_m':.00002,
    'runtime_use':False,
    'renders':['material-mineral.png','material-graphite.png','material-macro-ariadne.png'],
    'master_source':'candidates.json / each routes[1].paths',
}, indent=2), encoding='utf-8')
