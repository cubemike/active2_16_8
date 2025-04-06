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
let editBg = ''

let weatherSensor = null;

let isSimulator = false;
let hour_mode = '12hr'

const weather_offset_x = 165;
const weather_offset_y = 300;

const date_offset_x = 112;
const date_offset_y = 207;

function setMonth(month) {
    monthText.setProperty(hmUI.prop.MORE, {src: `months/${month}.png`});
}

function setDay(day) {
    dayTextImg.setProperty(hmUI.prop.TEXT, `${(day<10?"0":"") + day}`);
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

let testHour_setFace = 23
let testMonth_setFace = 0
let testWeekday_setFace = 0
let testDay_setFace = 1
let lastUpdateHour = -1;
let isInTestMode = false;
function setFace(minutes_increment) {

    console.log("increment: " + minutes_increment)

    let hour = 0;
    let month = 0;
    let weekday = 0;
    let day = 0;
    let date = 0;

    if (isSimulator && (typeof minutes_increment === 'number')) {
        hour = testHour_setFace = (testHour_setFace + minutes_increment/60)%24
        console.log("testHour_setFace: " + testHour_setFace)
        month = testMonth_setFace  = (testMonth_setFace + 1) % 12
        weekday = testWeekday_setFace = (testWeekday_setFace + 1) % 7
        day = testDay_setFace = testDay_setFace % 31 + 1
        isInTestMode = true
    } else {
        date = new Date();
        month = date.getMonth();
        weekday = date.getDay();
        day = date.getDate();
        hour = date.getHours()+date.getMinutes()/60;
    }

    setTime(hour);

    if (isInTestMode || (lastUpdateHour == -1) || (lastUpdateHour > hour)) {
        setMonth(month);
        setWeekday(weekday);
        setDay(day);
    }

    console.log(`lastUpdateHour: ${lastUpdateHour} hour: ${hour}`)
    if (isInTestMode || (lastUpdateHour == -1) || (lastUpdateHour > hour) || (hour >= 8 && lastUpdateHour < 8)) {
        setIndicators(hour)
    }

    lastUpdateHour = hour;

    if (isInTestMode) {
        isInTestMode = false;
        console.log('Cleaned up after test mode')
    }
}

function getHourMode() {
    let currentType = editBg.getProperty(hmUI.prop.CURRENT_TYPE)
    let hour_mode;

    console.log('Current type:' + editBg.getProperty(hmUI.prop.CURRENT_TYPE))

    switch (currentType) {
        case 1:
            hour_mode = '12hr'
            break;
        case 2:
            hour_mode = '24hr'
            break;
    }

    console.log('hour_mode: ' + hour_mode)

    return hour_mode

}

function setIndicators(hour) {

    if (hour < 8) {
        srcTicks = 'faces/ticks_night.png'
        srcNumbers = `faces/numbers_${getHourMode()}_night.png`
    } else {
        srcTicks = 'faces/ticks_day.png'
        srcNumbers = `faces/numbers_${getHourMode()}_day.png`
    }

    console.log(srcTicks)
    console.log(srcNumbers)


    ticksImg.setProperty(hmUI.prop.MORE, {
        src: srcTicks
    });
    numbersImg.setProperty(hmUI.prop.MORE, {
        src: srcNumbers
    });
}

function weatherButton() {
    console.log('weather pressed')
    router.launchApp({appId: router.SYSTEM_APP_WEATHER, native: true});
}

WatchFace({
    init_view() {

        console.log('hi')

        let BGROOT = 'faces/'

        editBg = hmUI.createWidget(hmUI.widget.WATCHFACE_EDIT_BG, {
          edit_id: 103,
          x: 0,
          y: 0,
          bg_config: [
            { id: 1, preview: BGROOT + 'numbers_12hr_day.png', path: BGROOT + 'empty.png' },
            { id: 2, preview: BGROOT + 'numbers_24hr_day.png', path: BGROOT + 'empty.png' },
          ],
          count: 2,
          default_id: 1,
          fg: BGROOT + 'ticks_day.png',
          tips_x: 466/2-130/2-5,
          tips_y: 428,
          tips_bg: 'tips_bg.png'
        })

        ticksImg = hmUI.createWidget(hmUI.widget.IMG, {
            x: 0,
            y: 0,
            w: 466,
            h: 466,
            show_level: hmUI.show_level.ONLY_NORMAL,
            src: 'faces/ticks_day.png'
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
            src: `faces/numbers_${hour_mode}_day.png`
        });


        heartImg = hmUI.createWidget(hmUI.widget.IMG, {
            x: 180,
            y: 121,
            src: "icons8-heart-48.png"
        });

        heartTextImg = hmUI.createWidget(hmUI.widget.TEXT_IMG, {
            x: 230,
            y: 125,
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
            x: 0 + weather_offset_x,
            y: 0 +  weather_offset_y,
            font_array: getDigitFontArray(25),
            negative_image: 'digit_25/neg.png',
            type: hmUI.data_type.WEATHER_HIGH
        });

        weatherLowImg = hmUI.createWidget(hmUI.widget.TEXT_IMG, {
            x: 0 + weather_offset_x,
            y: 22 +  weather_offset_y,
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
            y: 90,
            w: 100,
            h: 100,
            normal_src: 'weatherButton.png',
            press_src: 'weatherButton.png',
            //normal_color: 0x00ffff,
            //press_color: 0x00ffff,
            click_func: setFace.bind(null, 60),
        });


        //console.log('Current type:' + editBg.getProperty(hmUI.prop.CURRENT_TYPE))
        //editBg.setProperty(hmUI.prop.PATH, 'faces/numbers_24hr_night.png')
        console.log('Current type:' + editBg.getProperty(hmUI.prop.CURRENT_TYPE))

        const widgetDelegate = hmUI.createWidget(hmUI.widget.WIDGET_DELEGATE, {
            resume_call: setFace,
        });

        //timer1 = timer.createTimer(1000, 250, setFace.bind(null, 1));

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
