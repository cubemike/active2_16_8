#!/usr/bin/python3

import cairo
import math

def hourToTheta(hour, night=False):
    m1=4./3.
    m2=1./3.

    hour1 = 8
    hour2 = 24

    hour_ = m2*max(0,min(hour, hour1)) + \
            m1*max(0,min(hour-hour1, hour2-hour1)) + \
            m2*max(0,hour-hour2)

    theta = hour_ * 2*math.pi/24

        

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
    ctx.set_source_rgba(1, 1, 1, 1)
    ctx.set_line_width(2)

    # Draw clock circle
    #ctx.arc(0, 0, 232, 0, 2 * math.pi)
    #ctx.stroke()

    ctx.save()
    ctx.rotate(-2*math.pi/18)

    # Draw hour markers
    for minutes in range(int(hourStart*60), int(hourStop*60), 5):

        hour = minutes/60

        # Save context state
        ctx.save()

        angle = hourToTheta(minutes/60, night)

        if (hour < clockwiseTextStart or hour > clockwiseTextStop):
            ctx.rotate(angle)
            alpha = 1
        else:
            ctx.rotate(angle+math.pi)
            alpha = -1


        if (minutes in [0, 4*60, 8*60]) or (hour > 8 and minutes%60 == 0):
            ctx.move_to(0, alpha*(170+33))
            ctx.line_to(0, alpha*(200+31))
        elif (minutes==6*60) or (minutes==2*60) or (hour > 8 and minutes%30 == 0):
            ctx.move_to(0, alpha*(183+31))
            ctx.line_to(0, alpha*(200+31))
        elif (minutes in [1*60, 3*60, 5*60, 7*60]) or (hour >= 8 and minutes%15 == 0):
            ctx.move_to(0, alpha*(191+31))
            ctx.line_to(0, alpha*(200+31))
        elif (hour < 8 and (minutes%60 in [20, 40])) or (hour >= 8 and minutes%5 == 0):
            ctx.move_to(0, alpha*(196+31))
            ctx.line_to(0, alpha*(200+31))


        ctx.stroke()

        if minutes%60==0 and (hour > 8 or hour%4==0): 
            # Draw numbers
            ctx.set_font_size(35)
            ctx.select_font_face("ubuntu mono", 
            cairo.FONT_SLANT_NORMAL, 
            cairo.FONT_WEIGHT_NORMAL)
            
            # Get text dimensions for centering
            # number = str(12 if hour == 0 else hour)
            number = str(int(hour))
            text_extents = ctx.text_extents(number)
            
            # Position and rotate text
            ctx.move_to(- text_extents.width/2, alpha*185 + text_extents.height/2)
            #ctx.rotate(math.pi/2)  # Rotate text to face outward
            ctx.show_text(number)

        ctx.restore()


    # Save to file
    surface.write_to_png(filename)

def saveHand(filename, time):
	# Create surface and context
	surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, 466, 466)
	ctx = cairo.Context(surface)

	# Fill background white
	ctx.set_source_rgba(0, 0, 0, 0)
	ctx.paint()

	# Move coordinate system to center and scale
	ctx.translate(233, 233)
	ctx.set_source_rgb(237/255, 115/255, 46/255)
	ctx.set_line_width(7)

	ctx.save()
	ctx.rotate(-hourToTheta(4-time))

	# Draw clock circle
	ctx.arc(0, 0, 8, 0, 2 * math.pi)
	ctx.stroke()

	ctx.move_to(0, 8)
	ctx.line_to(0, 200)
	ctx.stroke()

	ctx.move_to(0, 8)
	ctx.line_to(0, 30)
	ctx.stroke()

	ctx.restore()

	# Save to file
	surface.write_to_png(filename)

saveFace(filename='face.png', hourStart=0, hourStop=24, clockwiseTextStart=12, clockwiseTextStop=20, night=True)
saveHand('hand_0.png', 0)
saveHand('hand_15.png', 15/60)
saveHand('hand_30.png', 30/60)
saveHand('hand_45.png', 45/60)
saveHand('hand_day_0.png', 0)
saveHand('hand_day_5.png', 4*5/60)
saveHand('hand_day_10.png', 4*10/60)


