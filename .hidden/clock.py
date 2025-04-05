import os
import hashlib

import cairo
import math
from enum import Enum
import gi
gi.require_version('Pango', '1.0')
gi.require_version('PangoCairo', '1.0')
from gi.repository import Pango, PangoCairo

import gi
gi.require_version('PangoCairo', '1.0')
from gi.repository import PangoCairo

class Hand(Enum):
    CURSOR_ANGLED_BACK = 1
    CURSOR_CURVED_BACK = 2
    RETICLE = 3
    CURSOR_FLOATING = 4

def drawHand(ctx, hand):
    match hand:
        case Hand.CURSOR_ANGLED_BACK:
            ctx.set_source_rgba(0, 0, 0, 1)
            ctx.set_line_width(5)
            ctx.move_to(-10, 155)
            ctx.line_to(0, 220)
            ctx.line_to(10, 155)
            ctx.line_to(0, 160)
            ctx.line_to(-10, 155)
            ctx.stroke()

            ctx.set_source_rgb(237/255, 115/255, 46/255)
            ctx.set_line_width(3)
            ctx.move_to(-10, 155)
            ctx.line_to(0, 220)
            ctx.line_to(10, 155)
            ctx.line_to(0, 160)
            ctx.line_to(-10, 155)
            ctx.stroke_preserve()
            ctx.fill()

        case Hand.CURSOR_CURVED_BACK:
            back_x         = 15
            back_y         = 145
            bezier_x     = 5
            bezier_y     = 151
            point_y     = 220

            ctx.set_source_rgba(0, 0, 0, 1)
            ctx.set_line_width(5)
            ctx.move_to(-back_x, back_y)
            ctx.curve_to(-bezier_x, bezier_y, bezier_x, bezier_y, back_x, back_y)
            ctx.line_to(0, point_y)
            ctx.line_to(-back_x, back_y)
            ctx.stroke()

            ctx.set_source_rgb(237/255, 115/255, 46/255)
            ctx.set_line_width(3)
            ctx.move_to(-back_x, back_y)
            ctx.curve_to(-bezier_x, bezier_y, bezier_x, bezier_y, back_x, back_y)
            ctx.line_to(0, point_y)
            ctx.line_to(-back_x, back_y)
            ctx.stroke_preserve()
            ctx.fill()
            
            #ctx.set_line_width(5)
            #ctx.stroke()
            #ctx.arc(0, 0, 145, 0, 2*math.pi)
            #ctx.stroke()

        case Hand.RETICLE:
            ret_x = 10
            ret_y = 150
            ctx.set_line_width(5)
            ctx.set_source_rgb(237/255, 115/255, 46/255)

            ctx.move_to(-ret_x, 240)
            ctx.line_to(-ret_x, ret_y)
            #ctx.move_to(0, ret_y)
            ctx.arc(0, ret_y, ret_x, math.pi, 0)
            ctx.move_to(ret_x, ret_y)
            ctx.line_to(ret_x, 240)
            ctx.stroke()

        case Hand.CURSOR_FLOATING:
            back_x         = 20
            back_y         = 145
            point_y     = 215
            pointer_theta = .15

            ctx.set_source_rgba(0, 0, 0, 1)
            #ctx.set_line_width(5)
            #ctx.move_to(-back_x, back_y)
            #ctx.line_to(0, point_y)
            #ctx.line_to(-back_x, back_y)
            ctx.set_line_width(7)
            ctx.move_to(0, point_y)
            ctx.arc(0, 0, back_y+15, math.pi/2-pointer_theta, math.pi/2+pointer_theta)
            ctx.line_to(0, point_y)
            ctx.stroke_preserve()
            ctx.stroke()

            ctx.set_source_rgb(237/255, 115/255, 46/255)
            ctx.set_line_width(5)
            ctx.move_to(0, point_y)
            ctx.arc(0, 0, back_y+14, math.pi/2-pointer_theta, math.pi/2+pointer_theta)
            ctx.line_to(0, point_y)
            ctx.stroke_preserve()
            ctx.fill()
            #ctx.stroke()
            
            ctx.set_line_width(7)
            ctx.arc(0, 0, back_y, 0, 2*math.pi)
            ctx.stroke()

            #ctx.set_line_width(7)
            #ctx.set_source_rgba(0, 0, 0, 1)
            #ctx.arc(0, 0, back_y+6, 0, 2*math.pi)
            #ctx.stroke()
            
            

def saveHand(filename, time):
    # Create surface and context
    surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, 466, 466)
    ctx = cairo.Context(surface)

    # Fill background white
    ctx.set_source_rgba(0, 0, 0, 0)
    ctx.paint()
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    ctx.set_line_join(cairo.LINE_JOIN_ROUND)

    # Move coordinate system to center and scale
    ctx.translate(233, 233)

    ctx.save()
    ctx.rotate(-math.pi+hourToTheta(time))


    #drawHand(ctx, Hand.CURSOR_CURVED_BACK)
    drawHand(ctx, Hand.CURSOR_FLOATING)

    ctx.restore()

    # Save to file
    surface.write_to_png(filename)

def hourToTheta(hour, night=False):

    if night:    
        theta = (hour)*(2*math.pi/8)
    else:
        theta = (hour-8)*(2*math.pi/16)
    return theta

def saveFace(filename='face.png', hourStart=0, hourStop=24, clockwiseTextStart=12, clockwiseTextStop=19, night=False):
    # Create surface and context
    surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, 466, 466)
    ctx = cairo.Context(surface)
    ctx.select_font_face("ubuntu mono")

    # Fill background white
    ctx.set_source_rgba(0, 0, 0, 0)
    ctx.paint()

    # Move coordinate system to center and scale
    ctx.translate(233, 233)

    # Draw clock circle
    #ctx.arc(0, 0, 232, 0, 2 * math.pi)
    #ctx.stroke()

    ctx.save()
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    ctx.set_line_join(cairo.LINE_JOIN_ROUND)

    # Draw hour markers
    for minutes in range(int(hourStart*60), int(hourStop*60), 5):
        hour = minutes/60

        # Save context state
        ctx.save()

        angle = hourToTheta(minutes/60, night)

        if False: #(hour < clockwiseTextStart or hour > clockwiseTextStop):
            ctx.rotate(angle)
            alpha = 1
        else:
            ctx.rotate(angle+math.pi)
            alpha = -1


        if minutes%60 == 0:
            tick_width = 5
            tick_start = 200
            tick_end = 240
        elif minutes%30 == 0:
            tick_width = 3
            tick_start = 205
            tick_end = 240
        elif minutes%15 == 0:
            tick_width = 3
            tick_start = 215
            tick_end = 240
        #elif minutes%5 == 0:
        #    ctx.move_to(0, alpha*(190+31))
        #    ctx.line_to(0, alpha*(200+33))
        #elif minutes%5 == 0:
        #    ctx.move_to(0, alpha*(196+31))
        #    ctx.line_to(0, alpha*(200+33))



        if minutes%15 == 0:
            ctx.move_to(0, alpha*(tick_start))
            ctx.line_to(0, alpha*(tick_end))
            ctx.set_source_rgba(0, 0, 0, 1)
            ctx.set_line_width(tick_width+2)
            ctx.stroke()

            ctx.move_to(0, alpha*(tick_start))
            ctx.line_to(0, alpha*(tick_end))
            ctx.set_source_rgba(1, 1, 1, 1)
            ctx.set_line_width(tick_width)
            ctx.stroke()

        ctx.restore()

    ctx.arc(0, 0, 233, 0, 2 * math.pi)
    ctx.arc(0, 0, 400, 0, 2 * math.pi)
    ctx.set_fill_rule(cairo.FILL_RULE_EVEN_ODD)
    ctx.set_operator(cairo.OPERATOR_CLEAR)
    ctx.fill()



    # Save to file
    surface.write_to_png(filename)


def saveSunset(filename, time):
    # Create surface and context
    surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, 466, 466)
    ctx = cairo.Context(surface)

    # Fill background white
    ctx.set_source_rgba(0, 0, 0, 0)
    ctx.paint()
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    ctx.set_line_join(cairo.LINE_JOIN_ROUND)

    # Move coordinate system to center and scale
    ctx.translate(233, 233)

    ctx.save()
    ctx.rotate(-math.pi+hourToTheta(time))

    # Draw clock circle
    #ctx.arc(0, 0, 8, 0, 2 * math.pi)
    #ctx.stroke()
    #ctx.move_to(0, 8)
    #ctx.line_to(0, 30)
    #ctx.stroke()

    ctx.set_source_rgba(0, 0, 0, 1)
    ctx.set_line_width(7)
    ctx.move_to(0, 200)
    ctx.line_to(0, 233)
    ctx.stroke()

    ctx.set_source_rgb(135/255, 88/255, 252/255)
    ctx.set_line_width(5)
    ctx.move_to(0, 200)
    ctx.line_to(0, 233)
    ctx.stroke()


    ctx.restore()

    # Save to file
    surface.write_to_png(filename)

def saveDial(filename, hourStart, hourStop, night, twentyFour_hour=False):

    surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, 466, 466)
    ctx = cairo.Context(surface)
    pangocairo_context = PangoCairo.create_context(ctx)
    layout = PangoCairo.create_layout(ctx)

    font = Pango.FontDescription()
    font.set_family("Ubuntu Mono Custom")

    # Move coordinate system to center and scale
    ctx.translate(233, 233)

    for hour in range(hourStart, int(hourStop)):
        # Draw numbers
        ctx.save()

        if twentyFour_hour == False:
            font.set_size(30 * Pango.SCALE)
            #number = f"{hour:02}"
            if hour == 0:
                number_idx = 12-1
            if hour > 12:
                number_idx = hour-12-1
            else:
                number_idx = hour-1

            #strs = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', U'0\u0305', U'1\u0305', U'2\u0305']
            #strs = [ U'\ue005', '1', '2', '3', '4', '5', '6', '7', '8', '9',U'\uE000', U'\u0190']
            strs = ['1', '2', '3', '4', '5', '6', '7', '8', '9', U'\uE000', U'\u0190', 'δ']
            #strs = ['Δ', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'E' ]
            number = strs[number_idx]
            #layout.set_text(number)
            #text_extents = ctx.text_extents(number)
            #print(number, text_extents)
        else:
            if hour < 8:
                font.set_size(30 * Pango.SCALE)
                number = str(hour)
            else:
                font.set_size(25 * Pango.SCALE)
                number = f'{hour:02}'

        layout.set_font_description(font)


        layout.set_text(number)
        width, height = layout.get_pixel_size()

        numbers_upright = True
        angle = hourToTheta(hour, night)

        if numbers_upright:
            x = -174*math.sin(angle)
            y = 174*math.cos(angle)
        else:
            x = 0
            y = -176
            ctx.rotate(angle+math.pi)

        x = x-width/2
        y = y-height/2-1

#        if x < -180:
#            x = x + 2


        print(f'{number} x:{x} y:{y}')

        ctx.move_to(x, y)
        ctx.set_source_rgba(0, 0, 0, 1)
        ctx.set_line_width(3)
        PangoCairo.layout_path(ctx, layout)
        ctx.stroke()

        ctx.set_source_rgba(1, 1, 1, 1)
        ctx.move_to(x, y)
        PangoCairo.layout_path(ctx, layout)
        ctx.fill()

        ctx.restore()

    surface.write_to_png(filename)

def saveGradient(filename):
    
    surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, 466, 466)
    ctx = cairo.Context(surface)

    ctx.set_source_rgba(0, 0, 0, 0)
    ctx.paint()

    # Move coordinate system to center and scale
    ctx.translate(233, 233)

    gradient = cairo.RadialGradient(0, 0, 120, 0, 0, 150)
    gradient.add_color_stop_rgba(0, 0, 0, 0, 0.1)
    #gradient.add_color_stop_rgba(, 0, 0, 0, 0.1)
    gradient.add_color_stop_rgba(1, 0, 0, 0, 0)

    ctx.set_source(gradient)

    ctx.arc(0, 0, 200, 0, 2*math.pi)

    ctx.fill()

    surface.write_to_png(filename)

script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

assets_dir = '../assets/common/'
homedir = os.path.expanduser('~')
fontdir = homedir + '/.local/share/fonts'
fontname = 'UbuntuMono-Regular-Custom.ttf'

if os.path.exists(fontdir + '/' + fontname):
    with open(fontname, 'rb') as file:
        data = file.read()
        md5_current = hashlib.md5(data).hexdigest()
        print(md5_current)

    with open(fontdir + '/' + fontname, 'rb') as file:
        data = file.read()
        md5_installed = hashlib.md5(data).hexdigest()
        print(md5_installed)

    if md5_current != md5_installed:
        os.system('cp ./*.ttf ~/.local/share/fonts/')
        os.system('fc-cache -f')
else:
    os.system('cp ./*.ttf ~/.local/share/fonts/')
    os.system('fc-cache -f')

saveDial(filename=assets_dir + 'faces/numbers_8.png', hourStart=0, hourStop=8, night=True)
saveDial(filename=assets_dir + 'faces/numbers_16.png', hourStart=8, hourStop=24, night=False, twentyFour_hour=False)
saveFace(filename=assets_dir + 'faces/ticks_16.png', hourStart=8, hourStop=23.9, night=False)
saveFace(filename=assets_dir + 'faces/ticks_8.png', hourStart=0, hourStop=8, night=True)
# Since these start at 0 (during the night) we need to rotate by 4x the minutes
for i in range(0, 8):
    saveHand(f'{assets_dir}hands/hand_8_{i}.png', i/60/3)

# for i in range(0, 8):
#     saveSunset(f'{assets_dir}hands/sunset_8_{i}.png', i/60/3)

