//import hmUI from '@zos/hmUI'
//import * as router from '@zos/router'
//import * as hmUI from '@zos/ui'

let handImg = '';
let ticksImg = null;
let numbersImg = null;
let sunsetImg = null;
let monthTextImg = null;
let dayTextImg = null;
let weekdayTextImg = null;
let weatherImg = null;
let weatherLowTextImg = null;
let weatherHighTextImg = null;
let weatherCurrentTextImg = null;

let weatherSensor = null;

let isSimulator = false;
let isInTestMode = false;
let lastUpdateHour = -1;

const weather_offset_x = 165;
const weather_offset_y = 300;

const date_offset_x = 112;
const date_offset_y = 207;

const colors = {red: 	0xff5555,
				orange: 0xffb144,
				yellow: 0xffff55,
				green: 	0x55ff55,
				cyan: 	0x55ffff,
				blue: 	0x7777ff,
				pink: 	0xff55ff,
				white: 	0xffffff};

const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun',
				'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const months_full = ['january', 'february', 'march', 'april', 'may', 'june',
				'july', 'august', 'september', 'october', 'november', 'december'];

const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const weekdays_full = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

const month_colors = [colors.red, colors.green, colors.red, colors.green,
					  colors.red, colors.red, colors.red, colors.green, 
					  colors.yellow, colors.orange, colors.pink, colors.white]

const weekday_colors = [colors.blue, colors.white, colors.white, colors.white, 
				        colors.white, colors.white, colors.red]

function setMonth(month) {
	monthText.setProperty(hmUI.prop.MORE, {src: `months/${month}.png`});
}

function setDay(day) {
	dayTextImg.setProperty(hmUI.prop.TEXT, `${day}`);
}

function setWeekday(weekday) {
	weekdayTextImg.setProperty(hmUI.prop.MORE, {src: `weekdays/${weekday}.png`});
}

function getDigitFontArray(size) {
	array = []
	for (i = 0; i < 10; i++) {
		array.push(`digit_${size}/${i}.png`);
	}
	return array
}	

function getWeatherImageArray() {
	array = []
	for (i=0; i < 30; i++) {
		array.push(`weather/${i}.png`)
	}
	return array
}

function log(obj) {
	console.log(JSON.stringify(obj, null, 4), '\n');
}

function setWeather() {
	const weatherData = weatherSensor.getForecastWeather()
	const currentData = { city: weatherData.cityName, 
						  current: weatherSensor.current, 
					 	  forecast: weatherData.forecastData.data[0],
					 	  solar: weatherData.tideData.data[0] };
	log(currentData);

	//weatherHighText.setProperty(hmUI.prop.MORE, {text: `${currentData.forecast.high}`});
	//weatherLowText.setProperty(hmUI.prop.MORE, {text: `${currentData.forecast.low}`});
	//weatherCurrentText.setProperty(hmUI.prop.MORE, {text: `${currentData.current}°`});
	//weatherImg.setProperty(hmUI.prop.MORE, {src: `weather/${currentData.forecast.index}.png`});

	setSunset(currentData.solar.sunset.hour+currentData.solar.sunset.minute/60)
}

function setHeartRate() {
	heartTextImg.setProperty(hmUI.prop.TEXT, `${heartSensor.last}`);
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
		rawAngle = (hour)*(360/8);
	else
		rawAngle = (hour-8)*(360/16);

    rawAngle = rawAngle%360

	angle.deg = Math.floor(rawAngle)	
	angle.mdeg = 1000*(rawAngle%1)

	if (fpEqual(1000, angle.mdeg)) {
		angle.mdeg = 0
		angle.deg++ 
	}
	angle.mdeg = Math.round(angle.mdeg)

	log(angle);

    return angle
}

function setTime(hour)
{
	src = 'hands/hand_8_0.png';

	angle = hourToAngle_16_8(hour);

	fracIdx = Math.round(angle.mdeg/(1000/8))

	src = 'hands/hand_8_' + fracIdx + '.png'

	handImg.setProperty(hmUI.prop.MORE, {
		angle: angle.deg,
		src: src
	});
}

function setSunset(hour)
{
	src = 'hands/sunset_8_0.png';

	angle = hourToAngle_16_8(hour);

	fracIdx = Math.round(angle.mdeg/(1000/8))

	src = 'hands/sunset_8_' + fracIdx + '.png'

	sunsetImg.setProperty(hmUI.prop.MORE, {
		angle: angle.deg,
		src: src
	});
}

function setFace() {
    //if (typeof lastUpdateHour == 'undefined') {
    //    lastUpdateHour = -1
    //    console.log(`lastUpdateHour: ${lastUpdateHour}`)
    //}
	let date = new Date();

	hour = date.getHours()+date.getMinutes()/60;
	//console.log("\nhour:    " + hour,
	//		    "\nmonth:   " + month,
	//			"\nweekday: " + weekday,
	//			"\nday:     " + day +
	//			"\n");

	if (isSimulator) {
		hour = 12
		month = 2
		weekday = 0
		day = 12
	}

	setTime(hour);

    if (isInTestMode || (lastUpdateHour == -1) || (lastUpdateHour > hour)) {
        month = date.getMonth();
        weekday = date.getDay();
        day = date.getDate();

        setMonth(month);
        setWeekday(weekday);
        setDay(day);
    }
	//setWeather();
	//setHeartRate();

    if (isInTestMode || (lastUpdateHour == -1) || (lastUpdateHour > hour) || (hour >= 8 && lastUpdateHour < 8)) {
        if (hour < 8) {
            srcTicks = 'faces/ticks_8.png'
            srcNumbers = 'faces/numbers_8.png'
            //sunsetImg.setProperty(hmUI.prop.MORE, {
            //	alpha: 0,
            //});
        } else {
            srcTicks = 'faces/ticks_16.png'
            srcNumbers = 'faces/numbers_16.png'
            //sunsetImg.setProperty(hmUI.prop.MORE, {
            //	alpha: 0xff,
            //});
        }

        ticksImg.setProperty(hmUI.prop.MORE, {
            src: srcTicks
        });
        numbersImg.setProperty(hmUI.prop.MORE, {
            src: srcNumbers
        });
    }

    lastUpdateHour = hour;
    if (isInTestMode) {
        isInTestMode = false;
        console.log('Cleaned up after test mode')
    }
}

{
	let hour = 8
	let month = 0
	let weekday = 0
	let day = 1

	function testFace() {

        isInTestMode = true
		
		//hour = (hour+0.25)%24
		hour += 1
		//if (hour > 13 && hour < 19)
		//	hour = 19
		//else if (hour > 21)
		//	hour = 11
		if (hour == 24)
			hour = 0

		month = (month+1)%12
		//day = day%31+1
		day++
		if (day > 31) day = 1
		weekday = (weekday+1)%7

		console.log("\nhour:    " + hour,
					"\nmonth:   " + month,
					"\nweekday: " + weekday,
					"\nday:     " + day +
					"\n");

		setTime(hour);
		setMonth(month);
		setWeekday(weekday);
		setDay(day);
		//setWeather();

		if (hour < 8) {
			srcTicks = 'faces/ticks_8.png'
			srcNumbers = 'faces/numbers_8.png'
			//sunset_alpha = 0
		} else {
			srcTicks = 'faces/ticks_16.png'
			srcNumbers = 'faces/numbers_16.png'
			//sunset_alpha = 0xff
		}

		ticksImg.setProperty(hmUI.prop.MORE, {
			src: srcTicks
		});
		numbersImg.setProperty(hmUI.prop.MORE, {
			src: srcNumbers
		});
		//sunsetImg.setProperty(hmUI.prop.MORE, {
		//	alpha: sunset_alpha,
		//});
	}
}

function weatherButton() {
	console.log('weather pressed')
	router.launchApp({appId: router.SYSTEM_APP_WEATHER, native: true});
}

WatchFace({
    init_view() {
	
		console.log('hi')

		ticksImg = hmUI.createWidget(hmUI.widget.IMG, {
			x: 0,
			y: 0,
			w: 466,
			h: 466,
			show_level: hmUI.show_level.ONLY_NORMAL,
			src: 'faces/ticks_8.png'
		});

		//sunsetImg = hmUI.createWidget(hmUI.widget.IMG, {
		//	x: 0,
		//	y: 0,
		//	center_x: 233,
		//	center_y: 233,
		//	w: 446,
		//	h: 446,
		//	show_level: hmUI.show_level.ONLY_NORMAL,
		//});

		handImg = hmUI.createWidget(hmUI.widget.IMG, {
			x: 0,
			y: 0,
			center_x: 233,
			center_y: 233,
			w: 446,
			h: 446,
			show_level: hmUI.show_level.ONLY_NORMAL,
		});

		//gradientImg = hmUI.createWidget(hmUI.widget.IMG, {
		//	x: 0,
		//	y: 0,
		//	src: 'gradient.png'
		//});

		numbersImg = hmUI.createWidget(hmUI.widget.IMG, {
			x: 0,
			y: 0,
			w: 466,
			h: 466,
			show_level: hmUI.show_level.ONLY_NORMAL,
			src: 'faces/numbers_8.png'
		});


		heartImg = hmUI.createWidget(hmUI.widget.IMG, {
			x: 180,
			y: 121,
			src: "icons8-heart-48.png"
		});

		//heartText = hmUI.createWidget(hmUI.widget.TEXT, {
		//	x: 230,
		//	y: 120,
		//	font: "UbuntuMono-Regular.ttf",
		//	text_size: 50,
		//	align_h: hmUI.align.LEFT,
		//	text: '0123456789',
		//	color: 0xffffff
		//});

		heartTextImg = hmUI.createWidget(hmUI.widget.TEXT_IMG, {
			x: 230,
			y: 125,
			font_array: getDigitFontArray(50),
			type: hmUI.data_type.HEART
		});

		//weekdayText = hmUI.createWidget(hmUI.widget.TEXT, {
		//	x: date_offset_x,
		//	y: 205,
		//	w: 100,
		//	font: "UbuntuMono-Regular.ttf",
		//	text_size: 50,
		//	align_h: hmUI.align.LEFT,
		//	text: 'abcdefghijklmnopqrstuvwxyz,'
		//});

		weekdayTextImg = hmUI.createWidget(hmUI.widget.IMG, {
			x: date_offset_x,
			y: date_offset_y,
		});

		commaText = hmUI.createWidget(hmUI.widget.IMG, {
            src: 'weekdays/7.png',
			x: date_offset_x+70,
			y: date_offset_y,
			w: 100,
		});

		//monthText = hmUI.createWidget(hmUI.widget.TEXT, {
		//	x: date_offset_x + 105,
		//	y: 205,
		//	w: 200,
		//	font: "UbuntuMono-Regular.ttf",
		//	align_h: hmUI.align.CENTER_LEFT,
		//	text_size: 50,
		//	text: "abcdefghijklmnopqrstuvwxyz"
		//});

		monthText = hmUI.createWidget(hmUI.widget.IMG, {
			x: date_offset_x + 105,
			y: date_offset_y,
		});

		//dayText = hmUI.createWidget(hmUI.widget.TEXT, {
		//	x: date_offset_x + 195,
		//	y: 202,
		//	w: 200,
		//	color: 0xffffff,
		//	font: "UbuntuMono-Regular.ttf",
		//	align_h: hmUI.align.LEFT,
		//	text_size: 50,
		//	text: '0123456789'
		//});

		dayTextImg = hmUI.createWidget(hmUI.widget.TEXT_IMG, {
			x: date_offset_x + 195,
			y: date_offset_y,
			font_array: getDigitFontArray(50),
		});

		//weatherHighText = hmUI.createWidget(hmUI.widget.TEXT, {
		//	x: 0 + weather_offset_x,
		//	y: 0 + weather_offset_y,
		//	w: 30,
		//	color: 0xffffff,
		//	font: 'UbuntuMono-Regular.ttf',
		//	text_size: 25,
		//	text: "0123456789",
		//	negative_image: 'digit_20/-.png',
		//	align_h: hmUI.align.RIGHT,
		//	type: hmUI.data_type.WEATHER_HIGH,
		//});

		weatherHighImg = hmUI.createWidget(hmUI.widget.TEXT_IMG, {
			x: 0 + weather_offset_x,
			y: 0 +  weather_offset_y,
			font_array: getDigitFontArray(25),
			type: hmUI.data_type.WEATHER_HIGH
		});

		//weatherLowText = hmUI.createWidget(hmUI.widget.TEXT, {
		//	x: 0  + weather_offset_x,
		//	y: 22 + weather_offset_y,
		//	w: 30,
		//	color: 0xffffff,
		//	font: 'UbuntuMono-Regular.ttf',
		//	text_size: 25,
		//	text: "0123456789",
		//	align_h: hmUI.align.RIGHT,
		//	type: hmUI.data_type.WEATHER_LOW,
		//});

		weatherLowImg = hmUI.createWidget(hmUI.widget.TEXT_IMG, {
			x: 0 + weather_offset_x,
			y: 22 +  weather_offset_y,
			font_array: getDigitFontArray(25),
			type: hmUI.data_type.WEATHER_LOW
		});

		//weatherCurrentText = hmUI.createWidget(hmUI.widget.TEXT, {
		//	x: 35 + weather_offset_x,
		//	y: -2 +  weather_offset_y,
		//	w: 70,
		//	color: 0xffffff,
		//	font: 'UbuntuMono-Regular.ttf',
		//	text_size: 50,
		//	align_h: hmUI.align.RIGHT,
		//	text: "0123456789°"
		//});

		weatherCurrentImg = hmUI.createWidget(hmUI.widget.TEXT_IMG, {
			x: 35 + weather_offset_x,
			y: -2 +  weather_offset_y,
			font_array: getDigitFontArray(50),
			unit_en: 'digit_50/°.png',
			type: hmUI.data_type.WEATHER_CURRENT
		});

		console.log(getDigitFontArray(50))

		weatherImg = hmUI.createWidget(hmUI.widget.IMG_LEVEL, {
			x: weather_offset_x + 110,
			y: weather_offset_y + 0,
			type: hmUI.data_type.WEATHER_CURRENT,
			image_array: getWeatherImageArray(),
			image_length:29
		});

		button = hmUI.createWidget(hmUI.widget.BUTTON, {
			x: weather_offset_x,
			y: weather_offset_y-5,
			w: 150,
			h: 50,
			normal_src: 'weatherButton.png',
			press_src: 'weatherButton.png',
			click_func: weatherButton
		});

		button = hmUI.createWidget(hmUI.widget.BUTTON, {
			x: 180,
			y: 100,
			w: 100,
			h: 100,
			normal_src: 'weatherButton.png',
			press_src: 'weatherButton.png',
			click_func: testFace
		});
		
		const widgetDelegate = hmUI.createWidget(hmUI.widget.WIDGET_DELEGATE, {
			resume_call: setFace,
		});

		weatherSensor = hmSensor.createSensor(hmSensor.id.WEATHER);

		//heartSensor = hmSensor.createSensor(hmSensor.id.HEART);

		//timer1 = timer.createTimer(1000, 250, testFace);
		
		batterySensor = hmSensor.createSensor(hmSensor.id.BATTERY)
		if (batterySensor.current == 0)
			isSimulator = true

		console.log('done')
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
