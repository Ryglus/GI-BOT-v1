
const events = require(modules.Events)
const Schedule = require(modules.Schedule);
const hs = require(modules.AdvancedHiscores);
const bucket = require(modules.Bucket)

class Leagues {
    constructor() {
        Schedule.addSchedule('0 * * * *', this)
        //this.initiate();
    }

    async initiate() {
        let what = "leagues"
        let ref = bucket.getData("savedRefs")
        if (!ref.hasOwnProperty(what)) {
            ref[what] = {};
            bucket.setData(ref,"savedRefs")
        } else if (!ref[what].hasOwnProperty("messageId")) {
            let to = await client.channels.cache.find(channel => channel.id === ref[what].channelId);
            to.send(await this.stringedmessage()).then(e=>{
                ref[what].messageId = e.id;
                bucket.setData(ref,"savedRefs")
            });
        } else if (ref[what].hasOwnProperty("messageId")) {
            let to = await client.channels.cache.find(channel => channel.id === ref[what].channelId);
            let that = await to.messages.fetch(ref[what].messageId);
            that.edit(await this.stringedmessage());
        }
    }
    async Update() {
        this.initiate();
    }
    async stringedmessage() {
        let rsns = await hs.leaguesFetchLeaderboard();

        const dataArray = Object.entries(rsns.data).map(([key, value]) => ({ name: key, data: value }));

        // Sorting based on the 'total' property in descending order
        dataArray.sort((a, b) => b.data.points - a.data.points);
        let string="";
        dataArray.forEach(e => {
            string += "**"+e.name+"**: "+ e.data.points +"\n";
        });
        return string;
    }
    onEventUpdate() {
        console.log("AASSS")
    }
}

module.exports = new Leagues();