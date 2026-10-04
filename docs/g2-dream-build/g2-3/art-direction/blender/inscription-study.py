"""NIVAR G2.3: exact SVG contours, new scene, no imported model/font/texture.

Run only in a NEW background Blender process with --factory-startup.
Coordinates are authored in metres. Existing .blend files are never loaded.
"""
import bpy
import json
import math
import re
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parent
DATA = json.loads((ROOT.parent / 'wordmarks' / 'candidates.json').read_text(encoding='utf-8'))


def contours(path):
    tokens = re.findall(r'[A-Za-z]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?', path)
    i = 0
    command = None
    p = (0.0, 0.0)
    begin = p
    points = []
    result = []
    prev_control = None
    previous = None
    while i < len(tokens):
        if tokens[i].isalpha():
            command = tokens[i]
            i += 1
        relative = command.islower()
        c = command.upper()
        if c == 'Z':
            if points:
                result.append(points)
            points = []
            p = begin
            previous = c
            command = None
            continue
        n = {'M':2,'L':2,'H':1,'V':1,'C':6,'S':4}[c]
        values = list(map(float, tokens[i:i+n]))
        i += n
        def xy(x,y):
            return (x+p[0],y+p[1]) if relative else (x,y)
        if c in ('M','L'):
            p = xy(*values)
            if c == 'M':
                begin = p
                command = 'l' if relative else 'L'
            points.append(p)
        elif c == 'H':
            p = (p[0]+values[0] if relative else values[0],p[1])
            points.append(p)
        elif c == 'V':
            p = (p[0],p[1]+values[0] if relative else values[0])
            points.append(p)
        elif c in ('C','S'):
            if c == 'C':
                a,b,end = xy(*values[:2]),xy(*values[2:4]),xy(*values[4:6])
            else:
                a=(2*p[0]-prev_control[0],2*p[1]-prev_control[1]) if previous in ('C','S') else p
                b,end=xy(*values[:2]),xy(*values[2:4])
            start=p
            for j in range(1,33):
                t=j/32
                u=1-t
                points.append((u**3*start[0]+3*u*u*t*a[0]+3*u*t*t*b[0]+t**3*end[0],u**3*start[1]+3*u*u*t*a[1]+3*u*t*t*b[1]+t**3*end[1]))
            p=end
            prev_control=b
        previous=c
    if points:
        result.append(points)
    return result


def color(hexvalue):
    return tuple((int(hexvalue[i:i+2],16)/255.0)**2.2 for i in (0,2,4))+(1,)


def material(name,base,roughness=.6,metallic=0,grain=False):
    m=bpy.data.materials.new(name)
    m.use_nodes=True
    n=m.node_tree.nodes
    principled=n.get('Principled BSDF')
    principled.inputs['Base Color'].default_value=color(base)
    principled.inputs['Roughness'].default_value=roughness
    principled.inputs['Metallic'].default_value=metallic
    if grain:
        tex=n.new('ShaderNodeTexNoise')
        tex.inputs['Scale'].default_value=1600
        tex.inputs['Detail'].default_value=2.5
        bump=n.new('ShaderNodeBump')
        bump.inputs['Strength'].default_value=.18
        bump.inputs['Distance'].default_value=.000075
        m.node_tree.links.new(tex.outputs['Fac'],bump.inputs['Height'])
        m.node_tree.links.new(bump.outputs['Normal'],principled.inputs['Normal'])
    return m


def aim(obj,point):
    obj.rotation_euler=(Vector(point)-obj.location).to_track_quat('-Z','Y').to_euler()


bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
scene.unit_settings.system='METRIC'
scene.unit_settings.scale_length=1
scene.render.engine='CYCLES'
scene.cycles.samples=48
scene.cycles.use_denoising=True
scene.render.resolution_x=1600
scene.render.resolution_y=1000
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.render.image_settings.color_mode='RGBA'
scene.render.film_transparent=False
scene.view_settings.view_transform='AgX'
scene.world.color=(.09,.09,.09)
scene.world.use_nodes=True
scene.world.node_tree.nodes.get('Background').inputs['Color'].default_value=(.25,.23,.29,1)
scene.world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.25

paper=material('Mineral paper / contemporary pale fibre','DFD6DC',.78,grain=True)
ink=material('Graphite ink / light inscription','302A36',.42,.12,True)
night=material('Graphite field / operational night','26212D',.65,.12,True)
night_ink=material('Lavender mineral / night inscription','998C9F',.44,.17,True)

# Large connected substrate: this is a flat typographic surface, not a prop.
bpy.ops.mesh.primitive_cube_add(size=1,location=(0,0,-.0015))
surface=bpy.context.object
surface.name='Continuous mineral surface'
surface.dimensions=(.68,.43,.003)
bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
surface.data.materials.append(paper)

objects={}
for m in DATA['candidates']:
    grouped=[]
    unit=.27/m['width']
    for index,d in enumerate(m['paths']):
        curve=bpy.data.curves.new(f"{m['id']} glyph {index}",'CURVE')
        curve.dimensions='2D'
        curve.fill_mode='BOTH'
        curve.resolution_u=24
        curve.extrude=.00012
        curve.bevel_depth=.000045
        curve.bevel_resolution=3
        for points in contours(d):
            spline=curve.splines.new('POLY')
            spline.points.add(len(points)-1)
            for knot,(x,y) in zip(spline.points,points):
                knot.co=((x-m['width']/2)*unit,(40-y)*unit,0,1)
            spline.use_cyclic_u=True
        obj=bpy.data.objects.new(f"{m['id']} / NIVAR / {index}",curve)
        bpy.context.collection.objects.link(obj)
        obj.location.z=.00004
        obj.data.materials.append(ink)
        grouped.append(obj)
    objects[m['id']]=grouped

bpy.ops.object.camera_add(location=(.024,-.205,.335))
camera=bpy.context.object
camera.name='Authored raking camera / exact inscription'
camera.data.type='ORTHO'
camera.data.ortho_scale=.34
camera.data.lens=65
aim(camera,(0,0,0))
scene.camera=camera

def area(name,location,power,size,tint):
    bpy.ops.object.light_add(type='AREA',location=location)
    lamp=bpy.context.object
    lamp.name=name
    lamp.data.energy=power
    lamp.data.shape='DISK'
    lamp.data.size=size
    lamp.data.color=tint
    aim(lamp,(0,0,0))
    return lamp

key=area('Raking light / shallow incision',( -.20,.08,.065),24,.14,(1,.83,.70))
fill=area('Soft mineral fill',(.14,-.10,.32),6,.27,(.72,.76,1))
edge=area('Paper horizon',(.06,.30,.10),10,.20,(.87,.80,1))

manifest={'created':'2026-09-12','blender':bpy.app.version_string,'dimensions_m':list(surface.dimensions),'lettering_width_m':.27,'extrusion_each_side_m':.00012,'bevel_m':.000045,'geometry':'exact original candidate SVG outlines; curves sampled at 32 segments per cubic','assets':[],'external_models':False,'external_textures':False,'font_binary_dependency':False}

for m in DATA['candidates']:
    for mid,group in objects.items():
        for obj in group:
            obj.hide_render=mid!=m['id']
            obj.hide_viewport=mid!=m['id']
    for mode in ('mineral','graphite'):
        surface.data.materials[0]=paper if mode=='mineral' else night
        for obj in objects[m['id']]:
            obj.data.materials[0]=ink if mode=='mineral' else night_ink
        key.data.energy=24 if mode=='mineral' else 34
        target=ROOT/f"{m['id']}-{mode}.png"
        scene.render.filepath=str(target)
        bpy.ops.render.render(write_still=True)
        manifest['assets'].append({'file':target.name,'candidate':m['id'],'mode':mode,'resolution':[1600,1000]})

# Save full editable study with all three alternatives; first candidate active.
for mid,group in objects.items():
    for obj in group:
        obj.hide_render=mid!=DATA['candidates'][0]['id']
        obj.hide_viewport=obj.hide_render
        obj.data.materials[0]=ink
surface.data.materials[0]=paper
key.data.energy=24
scene['study']='NIVAR G2.3 three exact inscriptions; no laboratory prop; no runtime selection implied.'
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'nivar-g23-inscription-study.blend'))
(ROOT/'render-manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
print('NIVAR_STUDY_COMPLETE '+json.dumps(manifest))
