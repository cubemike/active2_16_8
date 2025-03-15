import ui from '@zos/ui'
import * as router from '@zos/router'

let handImg = '';
let faceImg = null;
let monthText = null;
let dayText = null;
let weekdayText = null;
let weatherImg = null;

const weather_offset_x = 165;
const weather_offset_y = 130;

const colors = {red: 	0xff4444,
				orange: 0xffb144,
				yellow: 0xffff44,
				green: 	0x44ff44,
				cyan: 	0x44ffff,
				blue: 	0x5555ff,
				pink: 	0xff44ff,
				white: 	0xffffff};

const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun',
				'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const weekdays = ['sun', 'mon', 'tue', 'wed', 'tau', 'fri', 'sat']

const month_colors = [colors.red, colors.green, colors.red, colors.green,
					  colors.red, colors.red, colors.red, colors.green, 
					  colors.yellow, colors.orange, colors.pink, colors.white]

const weekday_colors = [colors.blue, colors.white, colors.white, colors.white, 
				        colors.white, colors.white, colors.red]

function getFontArraySize(size) {
	array = []
	for (i = 0; i < 10; i++) {
		array.push('digit_' + size + '/' + i + '.png')
	}
	return array
}

function getWeatherImageArray() {
	array = [];
	for (i = 0; i < 29; i++) {
		array.push('weather/' + i + '.png');
	}
	return array;
}

function setMonth(month) {
	monthText.setProperty(ui.prop.MORE, {text: months[month],
										color: month_colors[month]});
}

function setDay(day) {
	dayText.setProperty(ui.prop.MORE, {text: "" + day});
}

function setWeekday(weekday) {
	weekdayText.setProperty(ui.prop.MORE, {text: weekdays[weekday],
										  color: weekday_colors[weekday]});
}

function hourToAngle_16_8(hour)
{
	function fpEqual(a, b) {
		if (Math.abs(a-b) < 0.001)
			return true
		else
			return false
	}

	let angle = {}

	if (hour < 8)
		rawAngle = (hour+(16-4))*(360/16);
	else
		rawAngle = (hour-8)*(360/16);

    rawAngle = rawAngle%360

	angle.frac = rawAngle % 1
	angle.whole = Math.floor(rawAngle)	

	if (fpEqual(1, angle.frac)) {
		angle.frac = 0
		angle.whole++ 
	}

	console.log('\nwholeDeg: ' + angle.whole +
				'\nfracDeg:  ' + angle.frac + 
				'\n');

    return angle
}

function setTime(hour)
{
	src = 'hands/hand_8_0.png';

	angle = hourToAngle_16_8(hour);

	fracIdx = Math.round(angle.frac/(1/8))

	src = 'hands/hand_8_' + fracIdx + '.png'

	handImg.setProperty(ui.prop.MORE, {
		angle: angle.whole,
		src: src
	});
}

function setFace() {
	let date = new Date();

	if (1) {
		hour = date.getHours()+date.getMinutes()/60;
		month = date.getMonth();
		weekday = date.getDay();
		day = date.getDate();
		console.log("\nhour:    " + hour,
				    "\nmonth:   " + month,
					"\nweekday: " + weekday,
					"\nday:     " + day +
					"\n");
	} else {
		hour = 17
		month = 11
		weekday = 0
		day = 33
	}

	setTime(hour);
	setMonth(month);
	setWeekday(weekday);
	setDay(day);

    if (hour < 8)
        src = 'faces/8.png'
    else
        src = 'faces/16.png'

    faceImg.setProperty(ui.prop.MORE, {
        src: src
    });
}

function weatherButton() {
	console.log('weather pressed')
	router.launchApp({appId: router.SYSTEM_APP_WEATHER, native: true});
}

WatchFace({
    init_view() {
	
		faceImg = ui.createWidget(ui.widget.IMG, {
			x: 0,
			y: 0,
			w: 466,
			h: 466,
			show_level: ui.show_level.ONLY_NORMAL,
		});

		handImg = ui.createWidget(ui.widget.IMG, {
			x: 0,
			y: 0,
			center_x: 233,
			center_y: 233,
			w: 446,
			h: 446,
			show_level: ui.show_level.ONLY_NORMAL,
		});

		monthText = ui.createWidget(ui.widget.TEXT, {
			x: 265,
			y: 210-5,
			font: "UbuntuMono-Regular.ttf",
			text_size: 50,
		});

		dayText = ui.createWidget(ui.widget.TEXT, {
			x: 340,
			y: 210-5,
			font: "UbuntuMono-Regular.ttf",
			color:0xffffff,
			text_size: 50,
		});

		weekdayText = ui.createWidget(ui.widget.TEXT, {
			x: 125,
			y: 210-5,
			h: 60,
			w: 200,
			font: "UbuntuMono-Regular.ttf",
			color:0xffffff,
			text_size: 50,
			text: "ttt"
		});

		weatherHighText = ui.createWidget(ui.widget.TEXT_IMG, {
			x: 0 + weather_offset_x,
			y: 4 + weather_offset_y,
			font_array: getFontArraySize(20),
			negative_image: 'digit_20/-.png',
			align_h: ui.align.RIGHT,
			type: ui.data_type.WEATHER_HIGH,
		});

		weatherLowText = ui.createWidget(ui.widget.TEXT_IMG, {
			x: 0  + weather_offset_x,
			y: 22 + weather_offset_y,
			font_array: getFontArraySize(20),
			negative_image: 'digit_20/-.png',
			align_h: ui.align.RIGHT,
			type: ui.data_type.WEATHER_LOW,
		});

		weatherCurrentText = ui.createWidget(ui.widget.TEXT_IMG, {
			x: 35 + weather_offset_x,
			y: 0 +  weather_offset_y,
			font_array: getFontArraySize(50),
			negative_image: 'digit_50/-.png',
			unit_en: 'digit_50/°.png',
			align_h: ui.align.LEFT,
			type: ui.data_type.WEATHER_CURRENT,
		});

		weatherImg = ui.createWidget(ui.widget.IMG_LEVEL, {
			x: weather_offset_x + 110,
			y: weather_offset_y + 0,
			image_array: getWeatherImageArray(),
			image_length: 29,
			type: ui.data_type.WEATHER_CURRENT,
		});

		button = ui.createWidget(ui.widget.BUTTON, {
			x: weather_offset_x,
			y: weather_offset_y-5,
			w: 150,
			h: 50,
			normal_src: 'weatherButton.png',
			press_src: 'weatherButton.png',
			click_func: weatherButton
		});
		
		const widgetDelegate = ui.createWidget(ui.widget.WIDGET_DELEGATE, {
			resume_call: setFace
		});

		console.log("Data type weather current: " +ui.data_type.WEATHER_LOW);
    },
    onInit() {
		console.log('index page.js on init invoke');
    },
    build() {
		this.init_view();
		console.log('index page.js on ready invoke');
    },
	onDestroy() {
		console.log('index page.js on destroy invoke');
    }
});
