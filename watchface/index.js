﻿//import hmUI from '@zos/hmUI'
//import * as router from '@zos/router'
//import * as hmUI from '@zos/ui'
import TestDate from './TestDate.js'
import Time from './Time.js'

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
let editBg = null;

let isSimulator = false;
let hour_mode = '12hr';
let clock_mode = 'octal';
let testDate = new TestDate(new Time(22, 0), 0, 0, 1);

function getMapObject(hourStart, stateNext, tickCount, angleHourStart, tickSrc) {
    return {
        hourStart:      hourStart,
        stateNext:      stateNext,
        tickCount:      tickCount,
        angleHourStart: angleHourStart,
        tickSrc:        tickSrc
    }
}

const mode_map = {
    'hex': {
            'night1': getMapObject(  0*60,     'night2',  8,    0, 'faces/ticks_8_15.png'  ),
            'night2': getMapObject(  4*60,       'day1',  8,    0, 'faces/ticks_8_15.png'  ),
              'day1': getMapObject(  8*60,       'day2', 16, 8*60, 'faces/ticks_16_15.png' ),
              'day2': getMapObject( 16*60,     'night1', 16, 8*60, 'faces/ticks_16_15.png' ),
    },
    'octal': {
            'night1': getMapObject(  0*60,     'night2', 8,     0, 'faces/ticks_8_15.png' ),
            'night2': getMapObject(  4*60,       'day1', 8,     0, 'faces/ticks_8_15.png' ),
              'day1': getMapObject(  8*60,       'day2', 8,  8*60, 'faces/ticks_8_5.png'  ),
              'day2': getMapObject( 12*60, 'afternoon1', 8,  8*60, 'faces/ticks_8_5.png'  ),
        'afternoon1': getMapObject( 16*60, 'afternoon2', 8, 16*60, 'faces/ticks_8_5.png'  ),
        'afternoon2': getMapObject( 20*60,     'night1', 8, 16*60, 'faces/ticks_8_5.png'  ),
    }
}
Object.freeze(mode_map)


const weather_offset_x = 165;
const weather_offset_y = 300;

const date_offset_x = 112;
const date_offset_y = 207;

const heart_rate_offset_x = 180;
const heart_rate_offset_y = 121;

function log() {
    console.log(...arguments, '\n')
}

function setMonth(month) {
    const srcMonth =  `months/${month}.png`
    if (srcMonth !== monthText.src) {
        log('setting srcMonth:', srcMonth);
        monthText.setProperty(hmUI.prop.MORE, {src: srcMonth});
    }
}

function setDay(day) {
    const dayText =  `${(day<10?"0":"") + day}`
    if (dayText !== dayTextImg.text) {
        log('setting dayText:', dayText);
        dayTextImg.setProperty(hmUI.prop.TEXT, dayText);
        dayTextImg.text = dayText
    }
}

function setWeekday(weekday) {
    const srcWeekday =  `weekdays/${weekday}.png`
    if (srcWeekday !== weekdayTextImg.src) {
        log('setting srcWeekday:', srcWeekday);
        weekdayTextImg.setProperty(hmUI.prop.MORE, {src: srcWeekday});
    }
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
        array.push(`weather/${i}.png`);
    }
    return array
}

function getNumbersPath(clockMode, hourMode, state) {
    return `faces/numbers_${clockMode}_${hourMode}_${state}.png`
}

function getTicksPath(hourCount) {
    return `faces/ticks_${hourCount}.png`
}

function getDialState(time) {
    let dialState;
    Object.keys(mode_map[clock_mode]).forEach(state => {
        if (time >= mode_map[clock_mode][state].hourStart) {
            dialState = state
        }
    })
    return dialState
}

function timeToAngle(time)
{
    let angle;
    const dialState = getDialState(time)
    let hourStart = mode_map[clock_mode][dialState].angleHourStart;
    let hourCount = mode_map[clock_mode][dialState].tickCount;

    angle = (time-hourStart)*6/hourCount;

    angle = Math.round(angle*1000)/1000
    log(time, angle.toFixed(3), 'degrees')

    return angle
}

function setTime(time)
{

    let src = 'hands/hand_8_0.png';

    let angle = timeToAngle(time);
    let eighths = Math.round((angle % 1)/0.125)

    src = 'hands/hand_8_' + eighths + '.png'

    handImg.setProperty(hmUI.prop.MORE, {
        angle: Math.floor(angle),
        src: src
    });
}

function setFace(minutes_increment) {

    getHourMode()

    if (typeof minutes_increment === 'number') {
        testMode = true
        log("increment: " + minutes_increment)
    } else {
        testMode = false;
    }
    if (testMode) {
        date = testDate;
        const prevHours = date.getHours()
        testDate.increment(minutes_increment)
        if (testDate.getHours() < prevHours) {
            testDate.incrementDate()
        }
    } else if (isSimulator) {
        date = testDate;
        if (testDate.getHours() == 2) {
            testDate.increment(18*60)
        } else if (testDate.getHours() == 12) {
            testDate.increment(18*60)
        } else if (testDate.getHours() == 20) {
            testDate.increment(16*60)
        } else {
            testDate.increment(20*60)
        }
    } else {
        date = new Date();
    }

    time = new Time(date.getHours(), date.getMinutes())

    setTime(time);
    setIndicators(time)

    setMonth(date.getMonth());
    setWeekday(date.getDay());
    setDay(date.getDate());

}

function getHourMode() {
    let currentType = editBg.getProperty(hmUI.prop.CURRENT_TYPE)

    log('Current type:', editBg.getProperty(hmUI.prop.CURRENT_TYPE))

    switch (currentType) {
        case 1:
            clock_mode = 'hex'
            hour_mode = '12hr'
            break;
        case 2:
            clock_mode = 'hex'
            hour_mode = '24hr'
            break;
        case 3:
            clock_mode = 'octal'
            hour_mode = '12hr'
            break;
        case 4:
            clock_mode = 'octal'
            hour_mode = '24hr'
            break;
    }

    log('hour_mode:', hour_mode)
    log('clock_mode:', clock_mode)

    return hour_mode

}

function setIndicators(time) {

    //log('dialState', dialState)
    const dialState = getDialState(time)
    srcNumbers = getNumbersPath(clock_mode, hour_mode, dialState);
    srcTicks = mode_map[clock_mode][dialState].tickSrc;

    if (srcTicks !== ticksImg.src) {
        log('setting srcTicks:', srcTicks)
        ticksImg.setProperty(hmUI.prop.MORE, {
            src: srcTicks
        });
    }
    if (srcNumbers !== numbersImg.src) {
        log('setting srcNumbers:', srcNumbers)
        numbersImg.setProperty(hmUI.prop.MORE, {
            src: srcNumbers
        });
    }
}

function weatherButton() {
    log('weather pressed')
    router.launchApp({appId: router.SYSTEM_APP_WEATHER, native: true});
}

WatchFace({
    init_view() {

        log('hi')

        editBg = hmUI.createWidget(hmUI.widget.WATCHFACE_EDIT_BG, {
          edit_id: 103,
          x: 0,
          y: 0,
          bg_config: [
            { id: 1, preview: 'previews/hex_12hr_day_preview.png', path: 'empty.png' },
            { id: 2, preview: 'previews/hex_24hr_day_preview.png', path: 'empty.png' },
            { id: 3, preview: 'previews/octal_12hr_day_preview.png', path: 'empty.png' },
            { id: 4, preview: 'previews/octal_24hr_day_preview.png', path: 'empty.png' },
          ],
          count: 4,
          default_id: 1,
          fg: 'empty.png',
          tips_x: 466/2-130/2-5,
          tips_y: 500,
          tips_bg: 'tips_bg.png'
        })

        ticksImg = hmUI.createWidget(hmUI.widget.IMG, {
            x: 0,
            y: 0,
            w: 466,
            h: 466,
            show_level: hmUI.show_level.ONLY_NORMAL,
        });

        circleImg = hmUI.createWidget(hmUI.widget.IMG, {
            x: 0,
            y: 0,
            center_x: 233,
            center_y: 233,
            w: 446,
            h: 446,
            show_level: hmUI.show_level.ONLY_NORMAL,
            src: 'hands/hand_circle.png'
        });

        handImg = hmUI.createWidget(hmUI.widget.IMG, {
            x: 0,
            y: 0,
            center_x: 233,
            center_y: 233,
            w: 446,
            h: 446,
            show_level: hmUI.show_level.ONLY_NORMAL,
        });

        numbersImg = hmUI.createWidget(hmUI.widget.IMG, {
            x: 0,
            y: 0,
            w: 466,
            h: 466,
            show_level: hmUI.show_level.ONLY_NORMAL,
        });

        heartImg = hmUI.createWidget(hmUI.widget.IMG, {
            x: heart_rate_offset_x + 0,
            y: heart_rate_offset_y + 0,
            src: "icons8-heart-48.png"
        });

        heartTextImg = hmUI.createWidget(hmUI.widget.TEXT_IMG, {
            x: heart_rate_offset_x + 50,
            y: heart_rate_offset_y + 4,
            font_array: getDigitFontArray(50),
            type: hmUI.data_type.HEART
        });

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

        monthText = hmUI.createWidget(hmUI.widget.IMG, {
            x: date_offset_x + 105,
            y: date_offset_y,
        });

        dayTextImg = hmUI.createWidget(hmUI.widget.TEXT_IMG, {
            x: date_offset_x + 195,
            y: date_offset_y,
            font_array: getDigitFontArray(50),
        });

        weatherHighImg = hmUI.createWidget(hmUI.widget.TEXT_IMG, {
            x: 3 + weather_offset_x,
            y: -5 +  weather_offset_y,
            font_array: getDigitFontArray(25),
            negative_image: 'digit_25/neg.png',
            type: hmUI.data_type.WEATHER_HIGH
        });

        weatherLowImg = hmUI.createWidget(hmUI.widget.TEXT_IMG, {
            x: 3 + weather_offset_x,
            y: 19 +  weather_offset_y,
            font_array: getDigitFontArray(25),
            negative_image: 'digit_25/neg.png',
            type: hmUI.data_type.WEATHER_LOW
        });

        weatherCurrentImg = hmUI.createWidget(hmUI.widget.TEXT_IMG, {
            x: 35 + weather_offset_x,
            y: -2 +  weather_offset_y,
            font_array: getDigitFontArray(50),
            unit_en: 'digit_50/deg.png',
            negative_image: 'digit_50/neg.png',
            type: hmUI.data_type.WEATHER_CURRENT
        });

        log(getDigitFontArray(50))

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
            y: 90,
            w: 100,
            h: 100,
            normal_src: 'weatherButton.png',
            press_src: 'weatherButton.png',
            click_func: () => {
                setFace(15);
                log(''.padStart(40, '*'));
            }
        });


        //log('Current type:' + editBg.getProperty(hmUI.prop.CURRENT_TYPE))
        //editBg.setProperty(hmUI.prop.PATH, 'faces/numbers_24hr_night.png')
        log('Current type:' + editBg.getProperty(hmUI.prop.CURRENT_TYPE))

        const widgetDelegate = hmUI.createWidget(hmUI.widget.WIDGET_DELEGATE, {
            resume_call: () => {
                setFace();
                log(''.padStart(40, '*'));
            }
        });

        //timer1 = timer.createTimer(1000, 250, setFace.bind(null, 1));
        //setFace()
        //setFace(60*6)

        batterySensor = hmSensor.createSensor(hmSensor.id.BATTERY)
        if (batterySensor.current == 0)
            isSimulator = true

        log('done')
    },
    onInit() {
        log('index page.js on init invoke');
    },
    build() {
        this.init_view();
        log('index page.js on ready invoke');
    },
    onDestroy() {
        log('index page.js on destroy invoke');
    }
});
