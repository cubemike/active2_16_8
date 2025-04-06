export default class TestDate {
    constructor(hour, weekday, day, month) {
        this.hour = hour;
        this.day = day;
        this.date = date;
        this.month = month
    }

    increment(minutes) {
        this.hour = (this.hour+minutes/60) % 24;
        this.month = (this.month + 1) % 12;
        this.day = (this.day + 1) % 7;
        this.date = (this.date % 31) + 1;
    }

    getHours() {
        return this.hour
    }

    getMonth() {
        return this.month
    }

    getDay() {
        return this.day
    }

    getDate() {
        return this.date
    }

    getMinutes() {
        return 0
    }

}
