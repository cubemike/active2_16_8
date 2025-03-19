#!/usr/bin/python3

import cairo
import math

def get_required_font_size(ctx, text, desired_height, test_size=48):
    ctx.set_font_size(test_size)
    font_extents = ctx.font_extents()
    scaling_factor = desired_height / font_extents[2]
    return test_size * scaling_factor

def find_max_dimensions_and_offsets(all_text_sets, desired_text_height, font):
    temp_surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, 1, 1)
    ctx = cairo.Context(temp_surface)

    ctx.select_font_face(font)
    font_size = get_required_font_size(ctx, all_text_sets[0][0], desired_text_height)
    ctx.set_font_size(font_size)

    global_max_top = 0
    global_max_bottom = 0

    for texts in all_text_sets:
        print(texts)
        for text in texts:
            extents = ctx.text_extents(text)
            global_max_top = min(global_max_top, extents.y_bearing)
            global_max_bottom = max(global_max_bottom, extents.y_bearing + extents.height)

    global_height = math.ceil(global_max_bottom - global_max_top)
    global_y_offset = -global_max_top


    results = []
    for texts in all_text_sets:
        max_left = 0
        max_right = 0
        for text in texts:
            extents = ctx.text_extents(text)
            max_left = min(max_left, extents.x_bearing)
            max_right = max(max_right, extents.x_bearing + extents.width)

        width = math.ceil(max_right-max_left)
        x_offset = -max_left

        results.append((width, global_height+4, x_offset, global_y_offset+2))

    return results

def set_source_rgb(ctx, rgb):
    byteList = bytes.fromhex(rgb)
    ctx.set_source_rgb(byteList[0]/255, byteList[1]/255, byteList[2]/255)

def create_text_image(text, color, width, height, x_offset, y_offset, desired_text_height, font):
    surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, width, height)
    ctx = cairo.Context(surface)

    #ctx.set_source_argb(0, 0, 0, 0)
    #ctx.paint()

    ctx.select_font_face(font)
    ctx.set_font_size(get_required_font_size(ctx, text, desired_text_height))

    set_source_rgb(ctx, color)
    ctx.move_to(x_offset, y_offset)
    ctx.show_text(text)

    return surface

#month_green = "25e310"
#month_red = "e31010"
#month_orange = "e37d10"
#month_pink = "f53bb1"
#month_yellow = "e0e339"
#month_white = "ffffff"
#month_blue = "4853f7"

red = "FF5555"
orange = "FFb144"
yellow = "FFFF55"
green = "55FF55"
cyan = "55FFFF"
blue = "7777FF"
pink = "FF55FF"
white = "FFFFFF"

months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
          'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
months = [m.lower() for m in months]
month_colors = [red, green, red, green, red, red,
                red, green, yellow, orange, pink, white]

days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
days = [d.lower() for d in days]
day_colors = [blue, white, white, white, white, white, red]
numbers = list('0123456789-.')
numbers.append('°')
digits = list('0123456789-.')

text_height = 50
digit_height = 25
font = 'ubuntu mono'

all_sets = [months, days, numbers]
dimensions = find_max_dimensions_and_offsets(all_sets, text_height, font)
month_dims, day_dims, number_dims = dimensions
print(dimensions)

digit_sets = [digits]
dimensions_digits = find_max_dimensions_and_offsets(digit_sets, digit_height, font)
digit_dims, = dimensions_digits
print(digit_dims)


for idx, text in enumerate(months):
    surface = create_text_image(text, month_colors[idx], *month_dims, text_height, font)
    surface.write_to_png(f"months/{idx}.png")

for idx, text in enumerate(days):
    surface = create_text_image(text, day_colors[idx], *day_dims, text_height, font)
    surface.write_to_png(f"weekdays/{idx}.png")

for idx, text in enumerate(numbers):
    surface = create_text_image(text, "FFFFFF", *number_dims, text_height, font)
    surface.write_to_png(f"digit_50/{text}.png")

for idx, text in enumerate(digits):
    surface = create_text_image(text, "FFFFFF", *digit_dims, digit_height, font)
    surface.write_to_png(f"digit_25/{text}.png")
