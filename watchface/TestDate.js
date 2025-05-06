export default class TestDate {
    constructor(time, day, month, date) {
        this.hours = time.hours;
        this.minutes = time.minutes
        this.day = day;
        this.date = date;
        this.month = month
    }

    increment(minutes) {
        this.hours = (this.hours + Math.floor((this.minutes + minutes)/60)) % 24
        this.minutes = (this.minutes + minutes) % 60
        //this.month = (this.month + 1) % 12;
        //this.day = (this.day + 1) % 7;
        //this.date = (this.date % 31) + 1;
    }

    incrementDate() {
        this.date = (this.date % 31) + 1
        this.month = (this.month + 1) % 12;
        this.day = (this.day + 1) % 7;
    }

    getHours() {
        return this.hours
    }

    getMinutes() {
        return this.minutes
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


}
