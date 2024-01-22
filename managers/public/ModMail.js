const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { createCanvas, loadImage, Image } = require('canvas');

const graphic = require(modules.CustomGraphics);
const events = require(modules.Events)
const bucket = require(modules.Bucket)
let wha = "modNotifications"

class ModMail {
    constructor() {
        events.addEvent(this)
    }
    getEvents() {
        
        let ref = bucket.getData("savedRefs")
        return [{ "type": 3, "channelId": ref[wha].channelId }];
    }
    Update() {
        console.log("RARAR")
    }

    async onEventUpdate(interaction) {
        var to = await client.channels.cache.find(channel => channel.id === interaction.message.channelId)

        var that = await to.messages.fetch(interaction.message.id);

        that.edit({ files: [await this.getFooterImage(interaction.member.user)], components: [] })

        interaction.reply({ content: "Thank you!", ephemeral: true })
    }
    async getFooterImage(what) {
        let id;
        if (!what) id = config.clientId;
        else id = what.id;
        const canvas = createCanvas(1000, 100)
        const context = canvas.getContext('2d')
        context.fillStyle = graphic.prefColors(0, 0, canvas.width, canvas.height)
        graphic.roundRect(context, 0, 0, canvas.width, canvas.height, 20, true)


        await graphic.headShot(context, id, 20, 20, 30, 2)
        if (id == config.clientId) {
            context.beginPath();
            context.moveTo(100, canvas.height / 2);
            context.lineTo(canvas.width - 50, canvas.height / 2);
            context.strokeStyle = "white";
            context.lineWidth = 2;
            context.stroke();
            context.font = 'bold 50pt Poppins'
            context.textAlign = 'left'
            context.textBaseline = 'middle'
            context.fillStyle = "white";
            context.fillText("!", canvas.width - 40, canvas.height / 2)
        } else {
            context.font = 'bold 30pt Poppins'
            context.textAlign = 'left'
            context.textBaseline = 'middle'
            context.fillStyle = "white";
            context.fillText(what.globalName+" has carried out this task!", 100, canvas.height / 2)
        }

        return new AttachmentBuilder(canvas.toBuffer(), { name: 'footer.png' });
    }
    async createModAction(type, what, author) {
        let me = client.users.cache.find(user => user.id == author)
        const exampleEmbed = new EmbedBuilder()
            .setDescription(me.toString()+":  "+what)
            .setColor(graphic.prefEmbedColor())
            .setTimestamp();
        
        if (author) exampleEmbed.setAuthor({
            name: type,
            iconURL: me.displayAvatarURL({ extension: 'png' }),
        })

        const button = new ButtonBuilder()
            .setCustomId("modmail-button-modactiondone")
            .setLabel("Carry out")
            .setStyle(ButtonStyle.Success);
        const actionRows = new ActionRowBuilder().addComponents(button);

        const attachment = await this.getFooterImage();
        exampleEmbed.setImage(`attachment://${attachment.name}`);
        let ref = bucket.getData("savedRefs")
        let to = await client.channels.cache.find(channel => channel.id === ref[wha].channelId);
        
        to.send({ embeds: [exampleEmbed], files: [attachment], components: [actionRows] });
    }
}

module.exports = new ModMail();