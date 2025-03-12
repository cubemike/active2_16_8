const logger = Logger.getLogger('watchface_SashaCX75');
import ui from '@zos/ui'
import router from '@zos/router'
import notification from '@zos/notification'

let normal_background_bg_img = '';
let indicator = '';
let date = '';

let dayImg = null;
let monthImg = null;
let dateImg = null;
let weatherImg = null;
let notification_img = null;

let hour = 0;
let month = 0;
let dayOfWeek = 0;
let dayNumber = 0;
let timer1 = null;
let oldDate = 32;
const radius = 199;
let lasthour = 0;
let weatherCount = 0;
const HandType = Object.freeze({
	POINTER: 0,
	ARC: 1
});
const handType = HandType.POINTER;

let step = null;

function getFontArraySize(size) {
	array = []
	for (i = 0; i < 10; i++) {
		array.push('digit_' + size + "_" + i + '.png')
	}
	return array
}

function getWeekArray() {
	array = [];
	for (i = 0; i < 7; i++) {
		array.push('day_' + i + '.png');
	}
	return array;
}
function getWeatherImageArray() {

	array = [];
	for (i = 0; i < 29; i++) {
		array.push('weather/' + i + '_white.png');
	}
	return array;
}

const weather_offset_x = 165;
const weather_offset_y = 130;

function weatherCallback() {
	weatherImg.setProperty(ui.prop.MORE, {src: "weather/"+weatherCount+"_white.png"});
	weatherCount = (weatherCount+1)%29
}

function setMonth(monthLabel, month) {
	monthLabel.setProperty(ui.prop.MORE, {src: "month_"+(month+1)+".png"});
}

function setDate(dateLabel, date) {
	dateLabel.setProperty(ui.prop.MORE, {src: "number_"+date+".png"});
	//console.log("date")
	//dateLabel.setProperty(ui.prop.MORE, {x: 100});
}

function setDay(dayLabel, day) {
	dayLabel.setProperty(ui.prop.MORE, {src: "day_"+day+".png"});
}

function hourToAngle(hour)
{
	m1 = 4./3.;
	m2 = 1./3.;

	hour1 = 8;
	hour2 = 24;

	b = 360/24;

	angle =       m2*Math.max(0,Math.min(hour, hour1)) +
					  m1*Math.max(0,Math.min(hour-hour1, hour2-hour1)) +
			  m2*Math.max(0,hour-hour2);

	return Math.round(angle*b);
}

function hourToAngle16_8(hour)
{
	if (hour < 18)
		angle= (hour)*(360/18);
	else
		angle= (hour-8)*(360/16);

	console.log("angle: " + angle);

	switch (handType) {
		case HandType.ARC:
			return angle;
			break;
		case HandType.POINTER:
			return angle;
			break;
	}
}

function setTimeSteps()
{
	console.log("steps: " + step.current);
	hour = Math.floor(step.current/100)+(step.current%100)/60;
	setTime(hour);
}

function setTime(hour)
{
	hour_ = hour;
	src = 'hand_0.png';

	if (hour <= 8) {
		minutes = 15*Math.floor(60*hour/15);
		hour_ = Math.floor(minutes/60);
		switch (minutes%60) {
			case 0:
				src = 'hand_0.png';
				break;
			case 15:
				src = 'hand_15.png';
				break;
			case 30:
				src = 'hand_30.png';
				break;
			case 45:
				src = 'hand_45.png';
				break;
		}
	} else {
		minutes = 5*Math.ceil(60*hour/5);
		hour_ = (minutes-minutes%15)/60;
		switch (minutes%15) {
			case 0:
				src = 'hand_day_0.png';
				break;
			case 5:
				src = 'hand_day_5.png';
				break;
			case 10:
				src = 'hand_day_10.png';
				break;
		}
	}


	normal_angle_hour = hourToAngle(hour_);
	console.log('Hour: ' + hour + ' hour_: ' + hour_ + ' src: ' + src);

	switch (handType) {
		case HandType.ARC:
			indicator.setProperty(ui.prop.MORE, {
				start_angle: start_angle,
				end_angle: normal_angle_hour
			});
			break;
		case HandType.POINTER:
			indicator.setProperty(ui.prop.MORE, {
				angle: normal_angle_hour,
				src: src
			});
			break;
	}

	lasthour = hour;
}

function setFace() {
	date = new Date();
	//hour = Math.floor(step.current/100)+(step.current%100)/60
	//hour = (hour+1)%24
	//month = (month+1)%12
	//dayOfWeek  = (dayOfWeek+1)%7
	//dayNumber = (dayNumber+1)%31

	hour = date.getHours()+date.getMinutes()/60;
	month = date.getMonth();
	dayOfWeek = date.getDay();
	dayNumber = date.getDate();

	setTime(hour);
	if (oldDate > date.getDate())
		setMonth(monthImg, month);

	oldDate = date.getDate()
	//setDay(dayImg, dayOfWeek);
	//setDate(dateImg, dayNumber);

	//timer.stopTimer(timer1);

	//msPastHour = 1000*(60*date.getMinutes()+date.getSeconds());
	//msToNext5MinuteInterval = 5*60*1000-(msPastHour%(5*60*1000));
	//console.log(msPastHour + " " + msToNext5MinuteInterval);

	//timer1 = timer.createTimer(
	//  msToNext5MinuteInterval,
	//  1000000,
	//  timerCallback
	//);
	notifications = notification.getAllNotifications()
	if (notifications.length == 1) {
		notification_img.setProperty(ui.prop.MORE, {color: 0});
	} else {
		notification_img.setProperty(ui.prop.MORE, 
				{color: ffffff, text:"*" + notifications.length + "*"});
	}
}

function weatherButton() {
	console.log('weather pressed')
	router.launchApp({appId: SYSTEM_APP_WEATHER, native: true});
}

WatchFace({
    init_view() {
	
	console.log('Watch_Face.ScreenNormal');
	normal_background_bg_img = ui.createWidget(ui.widget.IMG, {
		x: 0,
		y: 0,
		w: 466,
		h: 466,
		src: 'face.png',
		show_level: ui.show_level.ONLY_NORMAL,
	});

	indicator = ui.createWidget(ui.widget.IMG, {
			src: 'hand_0.png',
			x: 0,
			y: 0,
			center_x: 233,
			center_y: 233,
			w: 446,
			h: 446,
	show_level: ui.show_level.ONLY_NORMAL,
	});

	monthImg = ui.createWidget(ui.widget.IMG, {
		x: 265,
		y: 210,
		src: 'month_1.png',
		show_level: ui.show_level.ONLY_NORMAL
	});

	//dayImg = ui.createWidget(ui.widget.IMG, {
	//	x: 125,
	//	y: 210,
	//	src: 'day_0.png',
	//	show_level: ui.show_level.ONLY_NORMAL
	//});

	//dateImg = ui.createWidget(ui.widget.IMG, {
	//	x: 350,
	//	y: 210,
	//	font_array: getFontArraySize(50),	
	//	text: "22",
	//	show_level: ui.show_level.ONLY_NORMAL
	//});

	const widgetDelegate = ui.createWidget(ui.widget.WIDGET_DELEGATE, {
		resume_call: setFace
	});


	const date = ui.createWidget(ui.widget.IMG_DATE, {
	  day_startX: 340,
	  day_startY: 210,
	  day_unit_sc: 'unit.png', // Unit
	  day_unit_tc: 'unit.png',
	  day_unit_en: 'unit.png',
	  day_align: ui.align.LEFT,
	  day_space: 0, // Spacing of text.
	  day_zero: 0, // Whether to make up zeroes.
	  day_follow: 0, // Whether to follow.
	  day_en_array: getFontArraySize(50),
	  // Month and day as above, need to replace the prefix with month/day.
	});

	const week = ui.createWidget(ui.widget.IMG_WEEK, {
		x: 125,
		y: 210,
		week_en: getWeekArray()
	});

		//normal_stress_current_text_font = ui.createWidget(ui.widget.TEXT_FONT, {
        //      x: 233,
        //      y: 180,
        //      text_size: 40,
        //      char_space: 0,
        //      line_space: 0,
        //      font: 'fonts/UbuntuMono-Regular.ttf',
        //      color: 0x00FFFFFF,
        //      align_h: ui.align.LEFT,
        //      align_v: ui.align.TOP,
        //      padding: true,
        //      text_style: ui.text_style.ELLIPSIS,
        //      type: ui.data_type.WEATHER_HIGH,
        //      show_level: ui.show_level.ONLY_NORMAL,
		//});

		normal_weather_high_text_font = ui.createWidget(ui.widget.TEXT_IMG, {
			x: 0 + weather_offset_x,
			y: 4 + weather_offset_y,
			font_array: getFontArraySize(20),
			negative_image: 'digit_20_-.png',
			align_h: ui.align.RIGHT,
			align_v: ui.align.TOP,
			padding: false,
			text_style: ui.text_style.ELLIPSIS,
			type: ui.data_type.WEATHER_HIGH,
			show_level: ui.show_level.ONLY_NORMAL,
		});

		normal_weather_low_text_font = ui.createWidget(ui.widget.TEXT_IMG, {
			x: 0  + weather_offset_x,
			y: 22 + weather_offset_y,
			font_array: getFontArraySize(20),
			negative_image: 'digit_20_-.png',
			align_h: ui.align.RIGHT,
			align_v: ui.align.TOP,
			padding: false,
			text_style: ui.text_style.ELLIPSIS,
			type: ui.data_type.WEATHER_LOW,
			show_level: ui.show_level.ONLY_NORMAL,
		});

		test_img = ui.createWidget(ui.widget.TEXT_IMG, {
			x: 35 + weather_offset_x,
			y: 0 +  weather_offset_y,
			font_array: getFontArraySize(50),
			negative_image: 'digit_50_-.png',
			unit_en: 'digit_50_°.png',
			align_h: ui.align.LEFT,
			align_v: ui.align.TOP,
			padding: false,
			text_style: ui.text_style.ELLIPSIS,
			type: ui.data_type.WEATHER_CURRENT,
			show_level: ui.show_level.ONLY_NORMAL,
		});
	
	weatherImg = ui.createWidget(ui.widget.IMG_LEVEL, {
		x: weather_offset_x + 110,
		y: weather_offset_y + 0,
		image_array: getWeatherImageArray(),
		image_length: 29,
		type: ui.data_type.WEATHER_CURRENT,
		src: 'weather/0.png',
		show_level: ui.show_level.ONLY_NORMAL
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

	
		notification_img = ui.createWidget(ui.widget.TEXT, {
			x: 0,
			y: 350,
			w: 466,
			font: 'UbuntuMono-Regular.ttf',
			color: 0xffffff,
			text_size: 50,
			align_h: ui.align.CENTER_H,
			align_v: ui.align.TOP,
			padding: false,
			text_style: ui.text_style.ELLIPSIS,
			type: ui.data_type.WEATHER_CURRENT,
			show_level: ui.show_level.ONLY_NORMAL,
			text: "5",
		});




    },
    onInit() {
	logger.log('index page.js on init invoke');
    },
    build() {
	this.init_view();
	logger.log('index page.js on ready invoke');
    },
    onDestroy() {
	logger.log('index page.js on destroy invoke');
    }
});
