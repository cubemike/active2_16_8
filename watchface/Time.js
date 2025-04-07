export default class Time {
    constructor(hours, minutes) {
        this.hours = hours;
        this.minutes = minutes;
    }

    getHours() {
        return this.hours;
    }

    getMinutes() {
        return this.minutes;
    }

    toString() {
        return this.hours.toString().padStart(2, '0') + ':' + this.minutes.toString().padStart(2, '0')
    }
}


Time.prototype.valueOf = function () {
    return this.hours*60 + this.minutes
}
