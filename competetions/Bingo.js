
const events = require(modules.Events)
const Schedule = require(modules.Schedule);

class Bingo {
    constructor() {
        events.addEvent(this)
        //Schedule.addSchedule('* * * * *', this.Update)
    }
    getEvents() {
        return [{ "type": 2, "member.user.id": "29264734618082048"},{ "type": 0, "member.user.id": "29264734631082048"}];
    }
    Update() {
        console.log("RARAR")
    }
    onEventUpdate() {
        console.log("AASSS")
    }
}

module.exports = new Bingo();