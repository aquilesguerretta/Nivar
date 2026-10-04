"""Selected Interval: subtractive shallow engraving, entirely new background scene.

No imported mesh, stock texture, font dependency, or inferred laboratory object.
Run: blender --background --factory-startup --python selected-inscription.py
"""
from pathlib import Path

SOURCE = Path(__file__).with_name('inscription-study.py')
# Reuse only the authored SVG reader and material helpers, before scene creation.
exec(SOURCE.read_text(encoding='utf-8').split("bpy.ops.object.select_all(action='SELECT')")[0])

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
scene.unit_settings.system='METRIC'
scene.render.engine='CYCLES'
scene.cycles.samples=64
scene.cycles.use_denoising=True
scene.render.resolution_x=1600
scene.render.resolution_y=1000
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.render.image_settings.color_mode='RGBA'
scene.view_settings.view_transform='AgX'
scene.world.use_nodes=True
bg=scene.world.node_tree.nodes.get('Background')
bg.inputs['Color'].default_value=(.22,.24,.30,1)
bg.inputs['Strength'].default_value=.065

def grained(name,base,roughness,metallic=0):
    mat=material(name,base,roughness,metallic,True)
    for node in mat.node_tree.nodes:
        if node.type=='TEX_NOISE':
            node.inputs['Scale'].default_value=370
            node.inputs['Roughness'].default_value=.68
        if node.type=='BUMP':
            node.inputs['Strength'].default_value=.25
            node.inputs['Distance'].default_value=.000055
    return mat

mineral=grained('Pale mineral / slightly fibrous matte surface','D9D1D4',.88)
mineral_floor=grained('Graphite pigment inside mineral incision','332E3B',.9)
graphite=grained('Graphite / matte operational surface','29252E',.78,.03)
graphite_floor=grained('Subdued mineral pigment inside graphite incision','8C8193',.86)

bpy.ops.mesh.primitive_cube_add(size=1,location=(0,0,-.003))
surface=bpy.context.object
surface.name='Continuous surface / SVG physically subtracted 0.24 mm'
surface.dimensions=(.68,.43,.006)
bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
surface.data.materials.append(mineral)

m=next(item for item in DATA['candidates'] if item['id']=='01-interval-optical')
unit=.27/m['width']
floors=[]
cutters=[]
for index,path in enumerate(m['paths']):
    curve=bpy.data.curves.new(f'Exact Interval optical / cutter {index}','CURVE')
    curve.dimensions='2D'
    curve.fill_mode='BOTH'
    curve.extrude=.00055
    curve.bevel_depth=0
    for points in contours(path):
        spline=curve.splines.new('POLY')
        spline.points.add(len(points)-1)
        for knot,(x,y) in zip(spline.points,points):
            knot.co=((x-m['width']/2)*unit,(40-y)*unit,0,1)
        spline.use_cyclic_u=True
    cutter=bpy.data.objects.new(f'SVG cutter {index}',curve)
    bpy.context.collection.objects.link(cutter)
    cutter.location.z=.00031  # Bottom -0.24 mm; top crosses substrate surface.
    bpy.ops.object.select_all(action='DESELECT')
    cutter.select_set(True)
    bpy.context.view_layer.objects.active=cutter
    bpy.ops.object.convert(target='MESH')
    cutter=bpy.context.object
    bpy.context.view_layer.objects.active=surface
    mod=surface.modifiers.new(f'Actual recessed glyph {index}','BOOLEAN')
    mod.operation='DIFFERENCE'
    mod.solver='EXACT'
    mod.object=cutter
    bpy.ops.object.modifier_apply(modifier=mod.name)
    cutter.hide_render=True
    cutter.hide_viewport=True
    cutters.append(cutter)

    floor_curve=bpy.data.curves.new(f'Incision pigment {index}','CURVE')
    floor_curve.dimensions='2D'
    floor_curve.fill_mode='BOTH'
    for points in contours(path):
        spline=floor_curve.splines.new('POLY')
        spline.points.add(len(points)-1)
        for knot,(x,y) in zip(spline.points,points):
            knot.co=((x-m['width']/2)*unit,(40-y)*unit,0,1)
        spline.use_cyclic_u=True
    floor_curve.extrude=0
    floor_curve.bevel_depth=0
    floor=bpy.data.objects.new(f'Pigment below surface / glyph {index}',floor_curve)
    bpy.context.collection.objects.link(floor)
    floor.location.z=-.000233
    floor.data.materials.append(mineral_floor)
    floors.append(floor)

# The edge radius is 12 microns: an incised cut, never a bevelled plaque.
bevel=surface.modifiers.new('12 micron cut-edge rounding','BEVEL')
bevel.width=.000012
bevel.segments=2
bevel.limit_method='ANGLE'

bpy.ops.object.camera_add(location=(.024,-.205,.335))
camera=bpy.context.object
camera.name='Selected Interval / raking macro camera'
camera.data.type='ORTHO'
camera.data.ortho_scale=.34
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

key=area('Low raking warm light',(-.23,.045,.024),1.5,.085,(1,.87,.79))
fill=area('Broad restrained cool fill',(.08,-.08,.24),.38,.27,(.78,.82,1))
edge=area('Quiet edge separation',(.04,.27,.12),.35,.20,(.91,.86,1))

manifest={'created':'2026-09-12','blender':bpy.app.version_string,'candidate':m['id'],
 'geometry':'Exact SVG outlines physically boolean-subtracted from continuous substrate; pigment entirely below top surface.',
 'incision_depth_m':.00024,'edge_radius_m':.000012,'wordmark_width_m':.27,'cubic_sampling':32,
 'external_assets':False,'font_binary_dependency':False,'source':'selected-inscription.py; inscription-study.py helpers; ../wordmarks/candidates.json','assets':[]}

for mode in ('mineral','graphite'):
    surface.data.materials[0]=mineral if mode=='mineral' else graphite
    for floor in floors:
        floor.data.materials[0]=mineral_floor if mode=='mineral' else graphite_floor
    key.data.energy=1.5 if mode=='mineral' else 2.8
    scene.render.filepath=str(ROOT/f'selected-interval-{mode}.png')
    bpy.ops.render.render(write_still=True)
    manifest['assets'].append({'file':Path(scene.render.filepath).name,'mode':mode,'resolution':[1600,1000]})

scene['study']='Selected Interval optical: 0.24 mm shallow incision; a flat material field without plaque or laboratory prop.'
scene['runtime_status']='Review candidate. Presentation material never replaces the live SVG identity.'
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'nivar-g23-selected-incision.blend'))
(ROOT/'selected-render-manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
print('NIVAR_SELECTED_COMPLETE '+json.dumps(manifest))
