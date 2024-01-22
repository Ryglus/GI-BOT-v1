const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SimpleContextFetchingStrategy } = require('discord.js');
const { createCanvas, loadImage, Image } = require('canvas');
const imageToBase64 = require('image-to-base64');
const GIFEncoder = require('gif-encoder-2')

const events = require(modules.Events)
const net = require(modules.Networking);
const graphic = require(modules.CustomGraphics);
const ge = require(modules.GrandExchange);
const bucket = require(modules.Bucket)
const util = require(modules.Util)
const users = require(modules.Users)
const emoji = require(modules.Emojis)
const hs = require(modules.AdvancedHiscores);

class PostYourRSN {
    constructor() {
        events.addEvent(this)
        //this.initiate()
    }
    async initiate() {
        let what = "postyourrsn"
        let ref = bucket.getData("savedRefs")
        if (!ref.hasOwnProperty(what)) {
            ref[what] = {};
            bucket.setData(ref,"savedRefs")
        } else if (!ref[what].hasOwnProperty("messageId")) {
            let to = await client.channels.cache.find(channel => channel.id === ref[what].channelId);
            to.send(await this.getMainDisplay()).then(e=>{
                ref[what].messageId = e.id;
                bucket.setData(ref,"savedRefs")
            });
        } else if (ref[what].hasOwnProperty("messageId")) {
            let to = await client.channels.cache.find(channel => channel.id === ref[what].channelId);
            let that = await to.messages.fetch(ref[what].messageId);
            that.edit(await this.getMainDisplay());
        }
    }
    getEvents() {
        let what = "postyourrsn"
        let ref = bucket.getData("savedRefs")
        return [{ "type": 0, "channelId": ref[what].channelId }, { "type": 3, "channelId": ref[what].channelId }];
    }
    async onEventUpdate(interaction) {

        if (interaction.type == 0) {
            if (interaction.author.id != config.clientId) {
                interaction.delete()
                let rsns = await hs.fetchPlayers(interaction.content.split(" | "));
                if (Object.keys(rsns.errors).length >= 1) {
                    interaction.channel.send(`${interaction.author.toString()} ${Object.keys(rsns.errors).map(playerName => ` **${playerName}**: ${rsns.errors[playerName].toString()}`).join('\n')}`).then(sent => {
                        setTimeout(function () {
                          sent.delete();
                        }, 15000);
                      }); 
                } else {
                    let ppl = bucket.getData("people");
                    if (!ppl.hasOwnProperty(interaction.author.id)) ppl[interaction.author.id] = {"RSN":interaction.content.split(" | ")}
                    else ppl[interaction.author.id].RSN = interaction.content.split(" | ")
                    users.verifyUser(interaction.author.id);
                    bucket.setData(ppl,"people")
                }
            }
        } else if (interaction.type == 3) {
            let ppl = bucket.getData("people");
            if (ppl[interaction.member.user.id].hasOwnProperty("RSN")) {
                let names = ppl[interaction.member.user.id].RSN
                interaction.reply({ content: `Your names: `+names.join(", "), ephemeral: true })
            } else if (ppl.hasOwnProperty(interaction.member.user.id)) {
                interaction.reply({ content: "Couldnt find any names belonging to you, you might wanna post your rsn for us.", ephemeral: true })
            } else {
                interaction.reply({ content: "Couldnt find any names belonging to you, you might wanna post your rsn for us.", ephemeral: true })
            }
            

        }
    }
    async getMainDisplay() {
        const embed = new EmbedBuilder()
        embed.setColor(graphic.prefEmbedColor())
        embed.setTitle("This channel is for our bot to asign your RSN to your discord acount")
        embed.setDescription("Post your __**RSN exactly as it appears ingame**__ (do **__NOT__** include extra symbols/letters such as: `!`,`#`,`rsn:`,`RSN`,`account name`) \n Example:\n `arman902`\n \n If you have two or __more__ accounts, please post them in the following format, following the same guidelines as above:\n`arman902 | Blazer420`\n\n" +
            "Your message **WILL BE DELETED INSTANTLY** via the bot -- In other words: If it deletes...__**IT IS WORKING**__\n" +
            "Your Discord Nickname will be changed automatically to whatever you type. \n**Please ONLY enter your RSN.**");
        let gif = await this.createTypeGif();
        embed.setImage(`attachment://${gif.name}`);

        let checkInEmoji = await emoji.createOrGetEmoji("patch check fill", await graphic.getIconImage('patch-check-fill.svg', graphic.prefColors(0, 0, 128, 128), 128, 128), false, graphic.prefTextFillColors(0, 0, 128, 128))
        const button = new ButtonBuilder()
            .setCustomId("postYourRSN-button-names")
            .setEmoji(checkInEmoji)
            .setLabel("Check my names")
            .setStyle(ButtonStyle.Secondary);
        const actionRows = new ActionRowBuilder().addComponents(button);


        
        return { content: "", embeds: [embed], files: [gif], components: [actionRows] }
    }
    async createTypeGif() {
        const canvWidth = 1000, canvHeigt = 150;
        var encoder = new GIFEncoder(canvWidth, canvHeigt, 'neuquant', true)
        encoder.start()
        encoder.setDelay(300)
        encoder.setRepeat(false)
        let text = "Ryglu | Rygged | UIM Ryglus", startX = 150;
        const canvas = createCanvas(canvWidth, canvHeigt)
        const context = canvas.getContext('2d')
        context.fillStyle = graphic.prefColors(0, 0, canvas.width, canvas.height)
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.fillStyle = "rgba(0, 0, 0, 0.3)"
        await graphic.roundRect(context, 20, 20, canvas.width - 40, canvas.height - 40, 20, true)
        await graphic.headShot(context, config.clientId, 50, 44, 30)
        for (let i = 0; i < text.length * 1.5; i++) {
            const gifCanvas = createCanvas(canvWidth, canvHeigt)
            const ctx = gifCanvas.getContext('2d')
            ctx.drawImage(canvas, 0, 0)
            ctx.font = 'bold 30pt Poppins'
            ctx.fillStyle = "white"
            ctx.textBaseline = "middle"
            ctx.strokeStyle = "white";
            let fakeI = i;
            if (i < 2) {ctx.fillText(text, startX, gifCanvas.height / 2); fakeI=text.length+2}
            else if (i <= (text.length * 1.5)) ctx.fillText(text.slice(0, i-2), startX, gifCanvas.height / 2)
            else fakeI = 0

            if (i % 2 == 1) {
                ctx.moveTo(startX + ctx.measureText(text.slice(0, fakeI-2)).width + 3, 50); ctx.lineTo(startX + ctx.measureText(text.slice(0, fakeI-2)).width + 3, canvas.height - 50); ctx.stroke();
            }
            encoder.addFrame(ctx)
        }
        encoder.finish();
        return new AttachmentBuilder(encoder.out.getData(), { name: 'Discover.gif', extension: 'image/gif' });
    }
}

module.exports = new PostYourRSN();