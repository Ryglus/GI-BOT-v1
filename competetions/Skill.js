const { GuildScheduledEventManager, GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage, Image } = require('canvas');
const events = require(modules.Events)
const bucket = require(modules.Bucket)
const fs = require('fs');
const graphic = require(modules.CustomGraphics);

const keys = ["attack", "hitpoints", "mining", "strength", "agility", "smithing", "defence", "herblore", "fishing", "ranged", "thieving", "cooking", "prayer", "crafting", "firemaking", "magic", "fletching", "woodcutting", "runecraft", "slayer", "farming", "construction", "hunter", "overall"];

//startdate,length,skills
let info = {
    "startdate": {
        title:"When it begins?",
        select: "number",
        desc: "get from unixtimestamp of when it begins?"
    },
    "enddate": {
        title:"Start date",
        select: "number",
        desc: "get from unixtimestamp  of when it ends?"
    }, 
    "length": {
        title:"Duration",
        select: "choice",
        options:["1d","3d","7d","14d"],
        desc: "for how long will 1 skill be ran for?"
    }, 
    "xp": {
        title:"Types of xp display on leaderboard",
        select: "choice",
        options:["never","first 50%","last 50%","always"],
        desc: "choose the length of competetion"
    },
    "skills": {
        title:"Skills",
        select: "multiselect",
        options: keys,
        desc: "choose the length of competetion"
    }
}
class SkillCompetetion {
    constructor() {
        //events.addEvent(this)
        this.initiate()
    }
    async initiate() {
        let what = "test"
        let ref = bucket.getData("savedRefs")
        if (!ref.hasOwnProperty(what)) {
            ref[what] = {};
            bucket.setData(ref,"savedRefs")
        } else if (!ref[what].hasOwnProperty("messageId")) {
            let to = await client.channels.cache.find(channel => channel.id === ref[what].channelId);
            to.send({files: [new AttachmentBuilder(await this.createInviteGraphic("MissionShag","457886178440511501", "Runecraft"), 'graph.png')]}).then(e=>{
                ref[what].messageId = e.id;
                bucket.setData(ref,"savedRefs")
            });
        } else if (ref[what].hasOwnProperty("messageId")) {
            let to = await client.channels.cache.find(channel => channel.id === ref[what].channelId);
            let that = await to.messages.fetch(ref[what].messageId);

            that.edit({files: [new AttachmentBuilder(await this.createInviteGraphic("MissionShag","457886178440511501", "Runecraft"), 'graph.png')]});
        }
    }
    getEvents() {
        return [{ "type": 0 }]
    }
    onEventUpdate() {

    }
    async setup(index) {
        return info[index]
    }
    async createInviteGraphic(name, creator, skill) {
        const canvas = createCanvas(880, 352);
        const context = canvas.getContext('2d');
        context.fillStyle = graphic.prefColors(0, 0, canvas.width, canvas.height)
        await graphic.roundRect(context, 0, 0, canvas.width, canvas.height, 20, true)

        
        await graphic.headShot(context, creator, 20, 20, 40)
        context.fillStyle = graphic.prefColors(0, 0, canvas.width, canvas.height)
        context.font = 'bold 43pt Poppins-bold'
        context.fillStyle = "white";
        context.textBaseline="middle"
        context.fillText(name + "'s Skill event", 120,60,canvas.width-130)
        context.font = 'bold 34pt Poppins-bold'
        context.textAlign="center"
        context.fillText("Skill: "+skill, canvas.width/2,155)
        context.fillText("Start: 1st Dec, 22:00 UTC", canvas.width/2,200)
        context.fillText("End:   8st Dec, 22:00 UTC", canvas.width/2,245)

        context.font = 'bold 30pt Poppins-bold'
        context.fillText("Apply to this event in order to join!", canvas.width/2,canvas.height-30)
        const skillsImage = await loadImage(resources + "images/skills/"+skill+"_icon.png")
        let scale = graphic.getImageScaling(skillsImage, 100, 100, canvas.width-110, canvas.height/2-(90/2), 0)
        await graphic.addWhiteBorderedImage(skillsImage, context, scale, 3, true)
        scale = graphic.getImageScaling(skillsImage, 100, 100, 20, canvas.height/2-(90/2), 0)
        await graphic.addWhiteBorderedImage(skillsImage, context, scale, 3, true)

        return await canvas.toBuffer();
    }

    async skillMonth() {
        var skillmonth = JSON.parse(fs.readFileSync("./skillmonth/competitions.json"));
        for (e in skillmonth) {
            var now = Math.round((new Date()).getTime() / 1000)
            if (now > skillmonth[e].Startdate && (now < Number(skillmonth[e].Startdate + (Object.keys(skillmonth[e].Skills).length * skillmonth[e].Duration)) + 500)) {
                var history = JSON.parse(fs.readFileSync('./skillmonth/history.json'));
                var week = Math.floor((Math.round(now - skillmonth[e].Startdate) / skillmonth[e].Duration));
                var cross = Math.floor(Math.round((now - 3600) - skillmonth[e].Startdate) / skillmonth[e].Duration)
                var collective = [];
                var bweek = week;
                for (let i = (cross !== -1) ? cross : 0; i <= bweek; i++) {
                    var collective = []
                    week = i
                    await getosrs.hiscores(Object.keys(skillmonth[e].Competitors[skillmonth[e].Skills[week]])).then(res => {
                        for (gamer in res) {
                            if (skillmonth[e].Competitors[skillmonth[e].Skills[week]].hasOwnProperty(res[gamer].discordId)) {
                                if (!history.hasOwnProperty(e)) {
                                    history[e] = {}
                                }
                                if (!skillmonth[e].hasOwnProperty("UpdateMessage")) {
                                    skillmonth[e].UpdateMessage = {}
                                }
                                if (!history[e].hasOwnProperty(res[gamer].discordId)) {
                                    history[e][res[gamer].discordId] = {}
                                }
                                if (!history[e][res[gamer].discordId].hasOwnProperty(gamer)) {
                                    history[e][res[gamer].discordId][gamer] = {}
                                }
                                if (!history[e][res[gamer].discordId][gamer].hasOwnProperty(skillmonth[e].Skills[week])) {
                                    history[e][res[gamer].discordId][gamer][skillmonth[e].Skills[week]] = {}
                                }
                                if (!skillmonth[e].Competitors[skillmonth[e].Skills[week]][res[gamer].discordId].hasOwnProperty(gamer)) {
                                    skillmonth[e].Competitors[skillmonth[e].Skills[week]][res[gamer].discordId][gamer] = {}
                                }
                                if (!skillmonth[e].Competitors[skillmonth[e].Skills[week]][res[gamer].discordId][gamer].hasOwnProperty("startxp")) {
                                    skillmonth[e].Competitors[skillmonth[e].Skills[week]][res[gamer].discordId][gamer].startxp = res[gamer].skills[skillmonth[e].Skills[week]].xp;
                                }
                                skillmonth[e].Competitors[skillmonth[e].Skills[week]][res[gamer].discordId][gamer].gained = res[gamer].skills[skillmonth[e].Skills[week]].xp - skillmonth[e].Competitors[skillmonth[e].Skills[week]][res[gamer].discordId][gamer].startxp;

                                history[e][res[gamer].discordId][gamer][skillmonth[e].Skills[week]][new Date().getTime()] = res[gamer].skills[skillmonth[e].Skills[week]]
                            }
                            collective[collective.length] = {
                                "rsn": gamer,
                                "discid": res[gamer].discordId,
                                "lvl": res[gamer].skills[skillmonth[e].Skills[week]].level,
                                "xp": res[gamer].skills[skillmonth[e].Skills[week]].xp,
                                "gained": skillmonth[e].Competitors[skillmonth[e].Skills[week]][res[gamer].discordId][gamer].gained
                            };
                        }
                        collective.sort(function (a, b) { return b.gained - a.gained })

                    })
                    if (cross < bweek && cross >= 0) {
                        if (i == cross) {
                            sllfinishweek(skillmonth[e].Skills[week], collective, skillmonth[e].UpdateMessage[skillmonth[e].Skills[week]], e, skillmonth[e].DisplayXP, (skillmonth[e].Startdate + ((week + 1) * skillmonth[e].Duration)));
                        } else if (i == bweek) {
                            sllupdateweek(skillmonth[e].Skills[week], collective, skillmonth[e].UpdateMessage[skillmonth[e].Skills[week]], e, skillmonth[e].DisplayXP, (skillmonth[e].Startdate + ((week + 1) * skillmonth[e].Duration)));
                        }
                    } else {
                        sllupdateweek(skillmonth[e].Skills[week], collective, skillmonth[e].UpdateMessage[skillmonth[e].Skills[week]], e, skillmonth[e].DisplayXP, (skillmonth[e].Startdate + ((week + 1) * skillmonth[e].Duration)));
                    }
                }
                fs.writeFileSync('./skillmonth/history.json', JSON.stringify(history, null, 2))
                fs.writeFileSync('./skillmonth/competitions.json', JSON.stringify(skillmonth, null, 2))
            }
        }
    }
    async sllfinishweek(skill, people, where) {
        var filez = [];
        const canvas = createCanvas(1400, 120);
        const context = canvas.getContext('2d');
        var grd = context.createRadialGradient(0, 0, canvas.width, canvas.height);
        grd.addColorStop(0, "#200122")
        grd.addColorStop(1, "#6f0000");
        context.fillStyle = grd;
        context.strokeStyle = grd;
        roundRect(context, 0, 0, canvas.width, canvas.height, 20, true);
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
        var skillpicname = skill.charAt(0).toUpperCase() + skill.slice(1) + '_icon.png';
        var skillimage = await loadImage('./pics/skills/' + skillpicname);
        var scale = getImageScaling(100, 100, 0, skillimage, 900, 10)
        context.drawImage(skillimage, scale.sx, scale.sy, scale.ex, scale.ey);
        context.webkitImageSmoothingEnabled = true;
        context.mozImageSmoothingEnabled = true;
        context.imageSmoothingEnabled = true;

        context.font = 'bold 40pt Poppins-bold'
        context.textAlign = 'left'
        context.textBaseline = 'middle'
        context.fillStyle = 'white'
        context.fillText("SKILLMONTH LEADERBOARD", 30, canvas.height / 2);

        let me = client.users.cache.find(user => user.id == "292647346318082048")
        const avatar = await loadImage(me.displayAvatarURL({ format: 'png' }));

        context.save();
        context.beginPath();
        context.arc(canvas.width - avatar.width + 95, canvas.height - avatar.height + 95, 25, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        context.drawImage(avatar, canvas.width - avatar.width + 70, canvas.height - avatar.height + 70, 50, 50);
        context.restore();
        context.font = 'bold 15pt Poppins'
        context.textAlign = 'right'
        context.fillStyle = 'white'
        context.fillText("POWERD BY RYGLUS", canvas.width - avatar.width + 60, canvas.height - 33);

        filez[filez.length] = new Discord.MessageAttachment(canvas.toBuffer(), 'REE.png');

        {
            var cat1 = [];
            var cat2 = [];
            var rs = new RSExp();
            people.forEach(pps => {
                if ((rs.xp_to_level(pps.xp - pps.gained) - 1) < 75) {
                    cat1[cat1.length] = pps;
                } else {
                    cat2[cat2.length] = pps;
                }
            });
            var n = Math.max(cat1.length, cat2.length), valval = 0;
            console.log(n);
            if (n <= 3)
                valval = 222
            else if (n == 4)
                valval = 310
            else
                valval = 310 + 75 * ((n) / 2 - 2)
            const canvas = createCanvas(1400, valval);
            const ctx = canvas.getContext('2d');

            ctx.webkitImageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
            ctx.textAlign = 'center'
            ctx.textBaseline = 'top'

            var crown = [];
            ctx.font = 'bold 26pt Poppins'
            crown[1] = await loadImage('./skillmonth/images/crowns1.png');
            crown[0] = await loadImage('./skillmonth/images/crowns2.png');
            crown[2] = await loadImage('./skillmonth/images/crowns3.png');
            var padding = 10;
            var half = canvas.width / 2;
            var mergerski = [cat1, cat2];
            var topoff = 22;
            ctx.textAlign = 'left'
            var stand = [1, 0, 2]
            var leftshift = padding / 2;
            ctx.lineWidth = 3;
            for (let j = 0; j < mergerski.length; j++) {
                for (let i = 0; i < mergerski[j].length; i++) {
                    if (mergerski[j][i].gained != 0) {
                        var grd = context.createRadialGradient(padding + (half * j) - (Math.random() * 100), (90 * i) + topoff + padding, half - padding + (Math.random() * 100), 60);
                        grd.addColorStop(0, "#200122")
                        grd.addColorStop(1, "#6f0000");
                        ctx.strokeStyle = grd;
                        ctx.fillStyle = grd;
                        ctx.textAlign = 'left'
                        var x = (padding * 2) + (half * j - 10) + 12 + leftshift, y = (90 * i) + topoff + padding + 13, y2 = (80 * i) + topoff + padding + 30;
                        if (i < 3) {
                            const gradient = ctx.createLinearGradient((padding * 1) + (half * j - 10) + leftshift + ((i % 3) * half / 3), ((90 * (i - i % 3 >>> 1)) + topoff + padding) + (stand[i] * 5), half / 3 - (padding * 1), 80 - (stand[i] * 5));
                            if (stand[i] == 0) {
                                gradient.addColorStop(0, '#d09d1f');
                                gradient.addColorStop(0.74, '#c6920d');
                            } else if (stand[i] == 1) {
                                gradient.addColorStop(0, '#C0C0C0');
                                gradient.addColorStop(1, '#B1B1B1');
                            } else if (stand[i] == 2) {
                                gradient.addColorStop(0, '#A97142');
                                gradient.addColorStop(1, '#A94D00');
                            }
                            ctx.strokeStyle = gradient;
                            var wrdx = (padding * 1) + (half * j - 10) + leftshift + ((i % 3) * half / 3), wrdy = ((90 * (i - i % 3 >>> 1)) + topoff + padding) + (stand[i] * 5);
                            roundRect(ctx, wrdx, wrdy, half / 3 - (padding * 1), 185 - (stand[i] * 5), 20, true, true);
                            {
                                let some1 = client.users.cache.find(user => user.id == mergerski[j][stand[i]].discid)
                                const avatar = await loadImage(some1.displayAvatarURL({ format: 'png' }));
                                var size = 40;
                                const offscreenCanvas = createCanvas(crown[i].width * 5, crown[i].height * 5);
                                const offscreenCtx = offscreenCanvas.getContext('2d');
                                offscreenCtx.webkitImageSmoothingEnabled = false;
                                offscreenCtx.mozImageSmoothingEnabled = false;
                                offscreenCtx.imageSmoothingEnabled = false;
                                const centerX = offscreenCanvas.width / 2;
                                const centerY = offscreenCanvas.height / 2;
                                offscreenCtx.translate(centerX, centerY);
                                offscreenCtx.rotate(Math.PI / 5);
                                offscreenCtx.translate(-centerX, -centerY);
                                offscreenCtx.drawImage(crown[stand[i]], 0, 0, offscreenCanvas.width, offscreenCanvas.height);

                                var movex = 70, movey = 24;
                                ctx.drawImage(offscreenCanvas, wrdx + 50 + movex, wrdy - 20 + movey, 30, 30);
                                ctx.strokeStyle = gradient;
                                ctx.save();
                                ctx.beginPath();
                                ctx.arc(wrdx + (size) + movex, wrdy + (size) + movey, size + 3, size + 3, 0, Math.PI * 2, true);
                                ctx.stroke();
                                ctx.closePath();
                                ctx.clip();
                                ctx.restore();
                                ctx.save();
                                ctx.beginPath();
                                ctx.arc(wrdx + (size) + movex, wrdy + (size) + movey, size, size, 0, Math.PI * 2, true);
                                ctx.closePath();
                                ctx.clip();
                                ctx.drawImage(avatar, wrdx + movex, wrdy + movey, size * 2, size * 2);
                                ctx.restore();
                            }
                            ctx.fillStyle = 'White'
                            ctx.textAlign = 'center'
                            ctx.font = 'bold 23pt Poppins-bold'
                            ctx.fillText(mergerski[j][stand[i]].rsn, wrdx + 112, wrdy + 112 - (stand[i] * 5))
                            ctx.font = 'bold 22pt Poppins'
                            ctx.fillText(abbreviateNumber(mergerski[j][stand[i]].gained), wrdx + 112, wrdy + 143 - (stand[i] * 5))
                        } else if (i < 4) {
                            var shift = 70;
                            y2 -= shift;
                            roundRect(ctx, x, y2, half - (padding * 4) - 8 - leftshift, 70, 20, true);
                            ctx.fillStyle = 'White'
                            ctx.font = 'bold 26pt Poppins'
                            ctx.fillText(i + 1 + ".  " + mergerski[j][i].rsn, x + 15, y2 + 10)
                            ctx.textAlign = 'right'
                            ctx.fillText(abbreviateNumber(mergerski[j][i].gained), x + 630, y2 + 10)
                        } else {
                            roundRect(ctx, x + ((i % 2 >>> 0) * ((half - (padding * 4) - 8 - leftshift) / 2)) + ((i % 2 >>> 0) * 10), (80 * (6 + i - i % 2 >>> 1)) + topoff + padding - 120, ((half - (padding * 4) - 8 - leftshift) / 2) - ((i % 2 >>> 0) * 10), 70, 20, true);
                            ctx.fillStyle = 'White'
                            ctx.font = 'bold 23pt Poppins'
                            ctx.fillText(i + 1 + ".  " + mergerski[j][i].rsn, x + ((i % 2 >>> 0) * ((half - (padding * 4) - 8 - leftshift) / 2)) + ((i % 2 >>> 0) * 10) + 15, ((80 * (6 + i - i % 2 >>> 1)) + topoff + padding + 11 - 120))
                            ctx.textAlign = 'right'
                        }
                    }
                }
            }

            ctx.textAlign = 'center'
            ctx.textBaseline = 'top'
            ctx.fillStyle = 'White'

            ctx.font = 'bold 28pt Poppins-bold'
            ctx.fillText("1-75", half / 2, -11)
            ctx.fillText("76-99", half + half / 2, -11)

            filez[filez.length] = new Discord.MessageAttachment(canvas.toBuffer(), 'sll.png');
        }

        var to = client.channels.cache.find(channel => channel.id === where.channelId);
        to.messages.fetch(where.header).then(r => {
            r.edit({ files: [filez[0]] });
        }).catch(error => { })
        to.messages.fetch(where.messageId).then(r => {
            r.edit({ files: [filez[1]] });
        }).catch(error => { })
    }
    async sllupdateweek(skill, people, where, e, showxp, end) {
        var filez = [];
        const canvas = createCanvas(1400, 120);
        const context = canvas.getContext('2d');
        var grd = context.createRadialGradient(0, 0, canvas.width, canvas.height);
        grd.addColorStop(0, "#200122")
        grd.addColorStop(1, "#6f0000");
        context.fillStyle = grd;
        context.strokeStyle = grd;
        roundRect(context, 0, 0, canvas.width, canvas.height, 20, true);
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
        var skillpicname = skill.charAt(0).toUpperCase() + skill.slice(1) + '_icon.png';
        var skillimage = await loadImage('./pics/skills/' + skillpicname);
        var scale = getImageScaling(100, 100, 0, skillimage, 900, 10)
        context.drawImage(skillimage, scale.sx, scale.sy, scale.ex, scale.ey);
        context.webkitImageSmoothingEnabled = true;
        context.mozImageSmoothingEnabled = true;
        context.imageSmoothingEnabled = true;

        context.font = 'bold 40pt Poppins-bold'
        context.textAlign = 'left'
        context.textBaseline = 'middle'
        context.fillStyle = 'white'
        context.fillText("SKILLMONTH LEADERBOARD", 30, canvas.height / 2);

        let me = client.users.cache.find(user => user.id == "292647346318082048")
        const avatar = await loadImage(me.displayAvatarURL({ format: 'png' }));

        context.save();
        context.beginPath();
        context.arc(canvas.width - avatar.width + 95, canvas.height - avatar.height + 95, 25, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        context.drawImage(avatar, canvas.width - avatar.width + 70, canvas.height - avatar.height + 70, 50, 50);
        context.restore();
        context.font = 'bold 15pt Poppins'
        context.textAlign = 'right'
        context.fillStyle = 'white'
        context.fillText("POWERD BY RYGLUS", canvas.width - avatar.width + 60, canvas.height - 33);
        context.font = 'bold 23pt Poppins'
        context.fillText("ENDS " + (moment.unix(end).fromNow()).toUpperCase(), canvas.width - 13, 25);
        filez[filez.length] = new Discord.MessageAttachment(canvas.toBuffer(), 'REE.png');

        {
            var cat1 = [];
            var cat2 = [];
            var rs = new RSExp();
            people.forEach(pps => {
                if ((rs.xp_to_level(pps.xp - pps.gained) - 1) > 75 && pps.gained > 5) {
                    cat2[cat2.length] = pps;
                } else if (pps.gained > 5) {
                    cat1[cat1.length] = pps;
                }
            });
            var n = Math.max(cat1.length, cat2.length), valval = 0;
            if (n <= 3)
                valval = 100 * n
            else if (n % 2 == 0)
                valval = 390 + 90 * (n / 2 - 2)
            else
                valval = 390 + 90 * ((n + 1) / 2 - 2)
            valval += 20;
            const canvas = createCanvas(1400, valval);
            const ctx = canvas.getContext('2d');
            ctx.webkitImageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
            ctx.textAlign = 'center'
            ctx.textBaseline = 'top'

            var crown = [];
            ctx.font = 'bold 26pt Poppins'
            crown[1] = await loadImage('./skillmonth/images/crowns1.png');
            crown[0] = await loadImage('./skillmonth/images/crowns2.png');
            crown[2] = await loadImage('./skillmonth/images/crowns3.png');
            var padding = 10;
            var half = canvas.width / 2;
            var mergerski = [cat1, cat2];
            var topoff = 20;
            ctx.textAlign = 'left'
            var leftshift = padding / 2;
            for (let j = 0; j < mergerski.length; j++) {
                for (let i = 0; i < mergerski[j].length; i++) {
                    if (mergerski[j][i].gained != 0) {
                        var grd = context.createRadialGradient(padding + (half * j) - (Math.random() * 100), (90 * i) + topoff + padding, half - padding + (Math.random() * 100), 60);
                        grd.addColorStop(0, "#200122")
                        grd.addColorStop(1, "#6f0000");
                        ctx.strokeStyle = grd;
                        ctx.fillStyle = grd;
                        ctx.textAlign = 'left'
                        var x = (padding * 2) + (half * j) + 12 + leftshift, y = (90 * i) + topoff + padding + 13, y2 = (80 * i) + topoff + padding + 30;
                        if (i < 3) {
                            roundRect(ctx, (padding * 2) + (half * j) + leftshift, (90 * i) + topoff + padding, half - (padding * 4), 80, 20, true);
                            let some1 = client.users.cache.find(user => user.id == mergerski[j][i].discid)
                            const avatar = await loadImage(some1.displayAvatarURL({ format: 'png' }));
                            var size = 27;
                            const offscreenCanvas = createCanvas(crown[i].width * 5, crown[i].height * 5);
                            const offscreenCtx = offscreenCanvas.getContext('2d');
                            offscreenCtx.webkitImageSmoothingEnabled = false;
                            offscreenCtx.mozImageSmoothingEnabled = false;
                            offscreenCtx.imageSmoothingEnabled = false;
                            const centerX = offscreenCanvas.width / 2;
                            const centerY = offscreenCanvas.height / 2;
                            offscreenCtx.translate(centerX, centerY);
                            offscreenCtx.rotate(Math.PI / 5);
                            offscreenCtx.translate(-centerX, -centerY);
                            offscreenCtx.drawImage(crown[i], 0, 0, offscreenCanvas.width, offscreenCanvas.height);
                            ctx.drawImage(offscreenCanvas, x + 30, y - 20, 30, 30);
                            ctx.strokeStyle = "white";
                            ctx.lineWidth = 3;
                            ctx.save();
                            ctx.beginPath();
                            ctx.arc(x + (size), y + (size), size + 3, size + 3, 0, Math.PI * 2, true);
                            ctx.stroke();
                            ctx.closePath();
                            ctx.clip();
                            ctx.restore();
                            ctx.save();
                            ctx.beginPath();
                            ctx.arc(x + (size), y + (size), size, size, 0, Math.PI * 2, true);
                            ctx.closePath();
                            ctx.clip();
                            ctx.drawImage(avatar, x, y, size * 2, size * 2);
                            ctx.restore();
                            ctx.fillStyle = 'White'
                            ctx.fillText(mergerski[j][i].rsn, x + 68, y + 2)
                            ctx.textAlign = 'right'
                            if (showxp) ctx.fillText(abbreviateNumber(mergerski[j][i].gained), x + 630, y + 2)
                        } else if (i < 6) {
                            roundRect(ctx, x, y2, half - (padding * 4) - 8 - leftshift, 70, 20, true);
                            ctx.fillStyle = 'White'
                            ctx.fillText(i + 1 + ".  " + mergerski[j][i].rsn, x + 20, y2 + 10)
                            ctx.textAlign = 'right'
                            if (showxp) ctx.fillText(abbreviateNumber(mergerski[j][i].gained), x + 630, y2 + 10)
                        } else {
                            roundRect(ctx, x + ((i % 2 >>> 0) * ((half - (padding * 4) - 8 - leftshift) / 2)) + ((i % 2 >>> 0) * 10), (80 * (6 + i - i % 2 >>> 1)) + topoff + padding + 30, ((half - (padding * 4) - 8 - leftshift) / 2) - ((i % 2 >>> 0) * 10), 70, 20, true);
                            ctx.fillStyle = 'White'
                            ctx.font = 'bold 24pt Poppins'
                            ctx.fillText(i + 1 + ".  " + mergerski[j][i].rsn, x + ((i % 2 >>> 0) * ((half - (padding * 4) - 8 - leftshift) / 2)) + ((i % 2 >>> 0) * 10) + 11, ((80 * (6 + i - i % 2 >>> 1)) + topoff + padding + 30 + 11))
                            ctx.textAlign = 'right'
                        }
                    }
                }
            }
            ctx.textAlign = 'center'
            ctx.textBaseline = 'top'
            ctx.fillStyle = 'White'

            ctx.font = 'bold 28pt Poppins-bold'
            ctx.fillText("1-75", half / 2 + 12, 0)
            ctx.fillText("76-99", half + half / 2 + 12, 0)

            filez[filez.length] = new Discord.MessageAttachment(canvas.toBuffer(), 'sll.png');
        }
        if (where == undefined) {
            var skillmonth = JSON.parse(fs.readFileSync("./skillmonth/competitions.json"));
            var to = client.channels.cache.find(channel => channel.id === skillmonth[e].Destination)
            to.send({ files: [filez[0]] }).then(doesntmatter => {
                to.send({ files: [filez[1]] }).then(waat => {
                    skillmonth[e].UpdateMessage[skill] = { "channelId": waat.channelId, "guildId": waat.guildId, "messageId": waat.id, "header": doesntmatter.id }
                    fs.writeFileSync('./skillmonth/competitions.json', JSON.stringify(skillmonth, null, 2))
                })
            })

        } else {
            client.channels.cache.find(channel => channel.id === where.channelId)
            var to = client.channels.cache.find(channel => channel.id === where.channelId)
            to.messages.fetch(where.header).then(r => {
                r.edit({ files: [filez[0]] });
            }).catch(error => { })
            to.messages.fetch(where.messageId).then(r => {
                r.edit({ files: [filez[1]] });
            }).catch(error => { })
        }
    }

}
module.exports = new SkillCompetetion();