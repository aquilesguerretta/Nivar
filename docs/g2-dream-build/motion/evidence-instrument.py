
import bpy, math
from mathutils import Vector
scene=bpy.context.scene
scene.unit_settings.system='METRIC'
scene.render.engine='BLENDER_EEVEE'
scene.render.resolution_x=1200
scene.render.resolution_y=800
scene.render.resolution_percentage=100
scene.render.film_transparent=False
scene.render.fps=30
scene.frame_start=1
scene.frame_end=180
scene.world=bpy.data.worlds.new('Mineral ambient world')
scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs['Color'].default_value=(0.63,0.59,0.65,1)
scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value=0.34
def material(name,color,metallic=0,roughness=.45):
 m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=(*color,1);bs.inputs['Metallic'].default_value=metallic;bs.inputs['Roughness'].default_value=roughness
 return m
graphite=material('Ferro - bead blasted graphite aluminum',(0.12,.13,.15),.62,.36)
edge=material('Prata - machined reference edges',(.42,.43,.46),.74,.29)
paper=material('Mineral Claro - matte evidence plates',(.87,.84,.88),0,.67)
oxide=material('Oxido - registration pin',(.48,.16,.115),.12,.43)
ink=material('Graphite scale ticks',(.23,.23,.25),.15,.48)
floor=material('Mineral paper studio',(.73,.705,.755),0,.86)
def assign(ob, mat):
 ob.data.materials.append(mat)
 if ob.type=='MESH':
  for p in ob.data.polygons:p.use_smooth=True
 return ob
def cylinder(name,radius,depth,loc,mat,verts=96):
 bpy.ops.mesh.primitive_cylinder_add(vertices=verts,radius=radius,depth=depth,location=loc)
 ob=bpy.context.object;ob.name=name;assign(ob,mat)
 b=ob.modifiers.new('Manufactured edge micro bevel','BEVEL');b.width=.0007;b.segments=3
 return ob
def ring_profile(name,profile,loc,mat):
 verts=[];faces=[];n=96
 for r,z in profile:
  for i in range(n):
   a=2*math.pi*i/n;verts.append((r*math.cos(a),r*math.sin(a),z))
 for j in range(len(profile)-1):
  for i in range(n):
   ni=(i+1)%n;faces.append((j*n+i,j*n+ni,(j+1)*n+ni,(j+1)*n+i))
 me=bpy.data.meshes.new(name+' mesh');me.from_pydata(verts,[],faces);me.update()
 ob=bpy.data.objects.new(name,me);bpy.context.collection.objects.link(ob);ob.location=loc;assign(ob,mat)
 b=ob.modifiers.new('Precision chamfer','BEVEL');b.width=.0004;b.segments=2
 return ob
cx=-.056
body=ring_profile('Hefesto | hollow calibration body',[(0,0),(.052,0),(.052,.063),(.048,.066),(.047,.066),(.044,.061),(.038,.060),(.035,.050),(.029,.047),(.026,.039),(.022,.039),(.022,.014),(0,.014),(0,0)],(cx,0,.002),graphite)
ring_profile('Machined calibration rim',[(.048,.0658),(.05,.0658),(.05,.0666),(.048,.0666),(.048,.0658)],(cx,0,.002),edge)
cylinder('Internal reference cavity floor',.021,.001,(cx,0,.017),ink)
pin=cylinder('Oxido physical registration pin',.0038,.013,(cx+.055,-.008,.024),oxide,48)
pin.rotation_euler[1]=math.pi/2
for j in range(3):
 x=.046+j*.004;y=-.008-j*.010;z=.004+j*.0045
 plate=cylinder('Ariadne | evidence layer '+str(j+1),.052,.0023,(x,y,z),paper)
 verts=[];faces=[]
 for i in range(72):
  a=2*math.pi*i/72
  r0=.046 if i%6==0 else .048
  r1=.050;w=.00017
  q=len(verts)
  for r,sign in [(r0,-1),(r1,-1),(r1,1),(r0,1)]:
   verts.append((x+r*math.cos(a)+sign*w*math.sin(a),y+r*math.sin(a)-sign*w*math.cos(a),z+.0013))
  faces.append((q,q+1,q+2,q+3))
 me=bpy.data.meshes.new('Calibration tick geometry '+str(j));me.from_pydata(verts,[],faces);me.update()
 ob=bpy.data.objects.new('Observed positions | layer '+str(j+1),me);bpy.context.collection.objects.link(ob);assign(ob,ink)
bpy.ops.mesh.primitive_plane_add(size=1,location=(0,0,0))
assign(bpy.context.object,floor);bpy.context.object.name='Mineral paper | physical ground'
def light(name,kind,location,energy,color,size):
 data=bpy.data.lights.new(name,kind);data.energy=energy;data.color=color
 ob=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(ob);ob.location=location
 if kind=='POINT':data.shadow_soft_size=size
 return ob
light('Key | broad upper left softbox','POINT',(-.22,-.15,.42),13,(1,.92,.84),.11)
light('Fill | cool mineral bounce','POINT',(.22,.15,.20),3.4,(.8,.84,1),.18)
sun=light('Ambient direction','SUN',(0,0,.5),.65,(1,.99,.97),0);sun.rotation_euler=(math.radians(15),math.radians(-25),math.radians(-20))
camera_data=bpy.data.cameras.new('NIVAR delivery camera')
cam=bpy.data.objects.new('NIVAR delivery camera',camera_data);bpy.context.collection.objects.link(cam);scene.camera=cam
cam.location=(.21,-.35,.42);target=Vector((0,-.015,.028));cam.rotation_euler=(target-Vector(cam.location)).to_track_quat('-Z','Y').to_euler()
camera_data.type='ORTHO';camera_data.ortho_scale=.285;camera_data.lens=55
scene.view_settings.view_transform='AgX'
target_file=artifacts.file(name='evidence-instrument-poster.png',media_type='image/png')
scene.render.image_settings.media_type='IMAGE';scene.render.image_settings.file_format='PNG';scene.render.filepath=target_file.path
bpy.ops.render.render(write_still=True)
target_file.publish()
result={'objects':len(bpy.data.objects),'intent':'Illustrative conceptual evidence instrument. No measured product or evidence.','camera_scale_m':camera_data.ortho_scale,'fps':30,'frame_range':[1,180]}
