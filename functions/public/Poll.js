const { createCanvas, loadImage, Image } = require('canvas');
const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { v4: uuidv4 } = require('uuid');

const events = require(modules.Events)
const bucket = require(modules.Bucket)
const graphic = require(modules.CustomGraphics);


var storedPolls = []
class Poll {
    constructor() {
        events.addEvent(this)
        storedPolls = this.getPolls();
        //this.createPollGraphic({ id: '292647346318082048', bot: false, system: false, username: 'ryglus', globalName: 'Ryglus', discriminator: '0', avatar: '95cdaf4f6969ce31c5208ecb607d0835', banner: undefined, accentColor: undefined, avatarDecoration: null }, { "results": [0, 1,0,0,1], "question": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur ligula sapien, pulvinar a vestibulum quis, facilisis vel sapien. Curabitur sagittis hendrerit ante. Curabitur bibendum justo non orci. Morbi scelerisque luctus velit. Phasellus et lorem id felis nonummy placerat.", "timestamp": "2023-09-20T21:31:03.094Z", "options": ["Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur ligula sapien, pulvinar a vestibulum quis, facilisis vel sapien. Curabitur sagittis hendrerit ante. Curabitur bibendum justo non orci. Morbi scelerisque luctus velit. Phasellus et lorem id felis nonummy placerat.", "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur ligula sapien, pulvinar a vestibulum quis, facilisis vel sapien. Curabitur sagittis hendrerit ante. Curabitur bibendum justo non orci. Morbi scelerisque luctus velit. Phasellus et lorem id felis nonummy placerat.","3","4","5"] });
        //this.createPollGraphic({ id: '292647346318082048', bot: false, system: false, username: 'ryglus', globalName: 'Ryglus', discriminator: '0', avatar: '95cdaf4f6969ce31c5208ecb607d0835', banner: undefined, accentColor: undefined, avatarDecoration: null }, { "results": [0, 1,0,0,1], "question": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur ligula sapien, pulvinar", "timestamp": "2023-09-20T21:31:03.094Z", "options": ["1","2","3","4","5"] });

    }
    getPolls() {
        var polls = bucket.getData("polls"), deletedEmptyPolls = false;
        var rtpol = [];
        Object.keys(polls).forEach(pollId => {
            if (Object.keys(polls[pollId]).length <= 2) {
                delete polls[pollId];
                deletedEmptyPolls = true;
            } else {
                rtpol[rtpol.length] = { "type": 5, "customId": "modal-poll-" + pollId }
            }
        });
        if (deletedEmptyPolls) {
            bucket.setData(polls, "polls")
        }
        return rtpol;
    }
    createPoll(question) {
        const answerId = uuidv4();
        var polls = bucket.getData("polls")
        polls[answerId] = { question: question, timestamp: new Date(), results: [] }
        bucket.setData(polls, "polls")
        storedPolls[storedPolls.length] = { "type": 5, "customId": "modal-poll-" + answerId };
        return answerId;
    }
    getEvents() {
        return storedPolls;
    }
    scheduledUpdate() {
        console.log("RARAR")
    }
    async onEventUpdate(interaction) {
        var polls = bucket.getData("polls")
        const id = interaction.customId.replace("modal-poll-", "");
        var option = [];
        interaction.fields.fields.forEach(o => {
            if (o.value != '') {
                option[option.length] = o.value
            }

        })
        polls[id].options = option;
        for (var p in polls[id].options) {
            polls[id].results[p] = 0;
        }
        bucket.setData(polls, "polls")
        interaction.reply({ content: "The poll has been made for you. it will be known under ID: " + id + ", if you require more information (wip)", ephemeral: true })
        interaction.channel.send({ files: [await this.createPollGraphic(interaction.member.user, polls[id])] })

    }
    async createPollGraphic(member, poll) {
        const canvas = createCanvas(1400, 890);
        const context = canvas.getContext('2d');
        
        context.font = 'bold 20pt Poppins-bold'
        var lines = graphic.splitTextIntoLines(context, poll.question, canvas.width - 100)
        var fontsize = 200 / (lines.length)
        while (fontsize * lines.length < 200) {
            context.font = 'bold ' + fontsize + 'pt Poppins-bold'
            fontsize = 200 / (lines.length + 1)
            lines = graphic.splitTextIntoLines(context, poll.question, canvas.width - 100)
        }
        context.fillStyle = "rgba(0, 0, 0, 0.3)"
        const lineYheight = 34 * (lines.length + 1)
        const lineYdiff = (165 * 2 + lineYheight) / 2
        var canvasOptions = await graphic.createRectanglesWithText(canvas.width - 18, canvas.height - (165 + lineYheight + 9) - 9, poll.options)
        canvas.height = 165 + lineYheight + 9+canvasOptions.height+40;
        const prefColors = graphic.prefColors(0, 0, 1400, canvas.height)
        context.fillStyle = prefColors;
        graphic.roundRect(context, 0, 0, canvas.width, canvas.height, 20, true);
        {
            context.fillStyle = "rgba(0, 0, 0, 0.3)"
            graphic.roundRect(context, 10, 7, canvas.width - 20, 150, 20, true);
            await graphic.headShot(context, member.id, 24, 20, 62, 6)

            context.textAlign = 'left'
            context.textBaseline = 'middle'
            context.fillStyle = "white"
            context.font = 'bold 30pt Poppins-bold'
            context.fillText(member.globalName, 165, 46)
            context.font = 'bold 60pt Poppins-bold'
            context.fillText("Has polled", 165, 106)
            context.drawImage(await graphic.drawMultiColoredBar(627, 124, poll.results, poll.options, true), 750, 20)
            context.save()
            context.strokeStyle = "white"
            context.lineWidth = 5
            context.beginPath(); context.moveTo(741, 18); context.lineTo(741, 146); context.stroke();
            context.restore();
            context.save(); context.textAlign = 'center'; context.font = 'bold 24pt Poppins-bold'; context.translate(722, 82); context.rotate(-Math.PI / 2); context.fillText("Results", 0, 0); context.restore();

        }
        context.drawImage(canvasOptions.canvas, 10, 165 + lineYheight + 9)
        context.fillStyle = "rgba(0, 0, 0, 0.3)"
        {
            graphic.roundRect(context, 10, 165, canvas.width - 20, lineYheight, 20, true);
            context.font = 'bold 30pt Poppins-bold'
            context.fillStyle = "white"
            context.fillText("Q", 5, 175);
            context.font = 'bold 20pt Poppins-bold'
            context.textAlign = 'center'
            for (let i = 0; i < lines.length; i++) {
                const lineY = lineYdiff + 34 * (i - lines.length / 2 + 0.5);
                context.fillText(lines[i], canvas.width / 2, lineY);
            }
            
        }

        
        var tag = await graphic.producerTag(40, true);
        context.drawImage(tag, canvas.width-tag.width-5, canvas.height-tag.height-5)
        //var to = await client.channels.cache.find(channel => channel.id === '951896304227876934')
        //to.send({ files: [new AttachmentBuilder(canvas.toBuffer(), 'Poll.png')] })
        return new AttachmentBuilder(canvas.toBuffer(), 'Poll.png');
    }
}
module.exports = new Poll()