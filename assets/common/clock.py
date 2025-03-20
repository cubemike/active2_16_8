#!/usr/bin/python3

import cairo
import math

def hourToTheta(hour, night=False):

	if night:	
		theta = (hour)*(2*math.pi/16) - math.pi/2
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
		#	ctx.move_to(0, alpha*(190+31))
		#	ctx.line_to(0, alpha*(200+33))
		#elif minutes%5 == 0:
		#	ctx.move_to(0, alpha*(196+31))
		#	ctx.line_to(0, alpha*(200+33))



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

	# Draw clock circle
	#ctx.arc(0, 0, 8, 0, 2 * math.pi)
	#ctx.stroke()
	#ctx.move_to(0, 8)
	#ctx.line_to(0, 30)
	#ctx.stroke()

	ctx.set_source_rgba(0, 0, 0, 1)
	ctx.set_line_width(7)
	ctx.move_to(0, 140)
	ctx.line_to(0, 220)
	ctx.stroke()

	ctx.set_source_rgb(237/255, 115/255, 46/255)
	ctx.set_line_width(5)
	ctx.move_to(0, 140)
	ctx.line_to(0, 220)
	ctx.stroke()


	ctx.restore()

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

def saveDial(filename, hourStart, hourStop, night):

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


	ctx.set_source_rgba(1, 1, 1, 1)

	for hour in range(hourStart, int(hourStop)):
		# Draw numbers
		ctx.save()
		angle = hourToTheta(hour, night)
		ctx.rotate(angle+math.pi)
		ctx.set_font_size(35)
		ctx.select_font_face("ubuntu mono", 
		cairo.FONT_SLANT_NORMAL, 
		cairo.FONT_WEIGHT_NORMAL)
		
		# Get text dimensions for centering
		# number = str(12 if hour == 0 else hour)
		number = str(int(hour))
		text_extents = ctx.text_extents(number)
		
		# Position and rotate text
		ctx.move_to(- text_extents.width/2-2, -180 + text_extents.height/2)
		#ctx.rotate(math.pi/2)  # Rotate text to face outward
		ctx.show_text(number)

	#	x = -171*math.sin(angle)
	#	y = 178*math.cos(angle)
		# Position and rotate text
		ctx.move_to( -text_extents.width/2-1 ,  -180 + text_extents.height/2)
		#ctx.rotate(math.pi/2)  # Rotate text to face outward
		ctx.set_source_rgba(0, 0, 0, 1)
		ctx.text_path(number)
		ctx.set_line_width(3)
		ctx.stroke()

		ctx.set_source_rgba(1, 1, 1, 1)
		ctx.move_to( -text_extents.width/2-1 ,  -180 + text_extents.height/2)
		ctx.text_path(number)
		ctx.fill()

		ctx.restore()

	surface.write_to_png(filename)

saveDial(filename='faces/numbers_8.png', hourStart=0, hourStop=9, night=True)
saveDial(filename='faces/numbers_16.png', hourStart=8, hourStop=24, night=False)
saveFace(filename='faces/ticks_16.png', hourStart=8, hourStop=23.9, night=False)
saveFace(filename='faces/ticks_8.png', hourStart=0, hourStop=8.1, night=True)
# Since these start at 0 (during the night) we need to rotate by 4x the minutes
for i in range(0, 8):
	saveHand(f'hands/hand_8_{i}.png', i/60/3)

for i in range(0, 8):
	saveSunset(f'hands/sunset_8_{i}.png', i/60/3)


