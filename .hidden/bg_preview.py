import cairo
import os
import math

script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(f'{script_dir}/../assets/common')
print(os.listdir())

w = 466
h = 466

file_sets = [
    ['faces/ticks_16_15.png', 'hands/hand_circle.png', 'hands/hand_8_0.png', 'faces/numbers_hex_12hr_day2.png'],
    ['faces/ticks_16_15.png', 'hands/hand_circle.png', 'hands/hand_8_0.png', 'faces/numbers_hex_24hr_day2.png'],
    ['faces/ticks_8_5.png', 'hands/hand_circle.png', 'hands/hand_8_0.png', 'faces/numbers_octal_12hr_day2.png'],
    ['faces/ticks_8_5.png', 'hands/hand_circle.png', 'hands/hand_8_0.png', 'faces/numbers_octal_24hr_day2.png'],
]


rotations = [0, 0, math.pi, 0]

output_files = [
    'previews/hex_12hr_day_preview.png',
    'previews/hex_24hr_day_preview.png',
    'previews/octal_12hr_day_preview.png',
    'previews/octal_24hr_day_preview.png',
]


for idx, file_set in enumerate(file_sets):
    surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, w, h)
    ctx = cairo.Context(surface)
    ctx.translate(233, 233)
    for idx2, file in enumerate(file_set):
        print(file)
        image_surface = cairo.ImageSurface.create_from_png(file)
        ctx.save()
        ctx.rotate(rotations[idx2])
        ctx.set_source_surface(image_surface, -233, -233)
        ctx.paint()
        ctx.restore()
    surface.write_to_png(f'{output_files[idx]}')

