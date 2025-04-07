import cairo
import os
import math

script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

w = 466
h = 466
common_surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, w, h)
ctx = cairo.Context(common_surface)

output_surfaces = list(range(2))
output_surfaces = [cairo.ImageSurface(cairo.FORMAT_ARGB32, w, h) for x in output_surfaces]

base_files = ['faces/ticks_day.png', 'hands/hand_circle.png', 'hands/hand_8_0.png']
base_rotations = [0, 0, math.pi]
base_surfaces = [cairo.ImageSurface.create_from_png(f'../assets/common/{file}') for file in base_files]

object_files = ['faces/numbers_12hr_day.png', 'faces/numbers_24hr_day.png']
object_surfaces = [cairo.ImageSurface.create_from_png(f"../assets/common/{file}") for file in object_files]

output_files = ['faces/numbers_12hr_day_preview.png', 'faces/numbers_24hr_day_preview.png']

for idx, image_surface in enumerate(base_surfaces):
    ctx.save()
    ctx.translate(233, 233)
    ctx.rotate(base_rotations[idx])
    ctx.set_source_surface(image_surface, -233, -233)
    ctx.paint()
    ctx.restore()

for idx, output_surface in enumerate(output_surfaces):
    ctx = cairo.Context(output_surface)
    ctx.set_source_surface(common_surface)
    ctx.paint()
    ctx.set_source_surface(object_surfaces[idx])
    ctx.paint()
    output_surface.write_to_png(f'../assets/common/{output_files[idx]}')

