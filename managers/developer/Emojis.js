const { registerFont, createCanvas, loadImage, Image } = require('canvas');
const { AttachmentBuilder } = require('discord.js');

const graphic = require(modules.CustomGraphics);

const emojiChannel = '1158030130065715211';
const emojiGuild = '943213858468802611';

class Emoji {
    constructor() {

    }
    manualEmojis() {
        let batchEmojis=["activity","alarm-fill","award","bag-check-fill","envelope-paper"];
        batchEmojis.forEach(async e=>{
            emoji.createOrGetEmoji(e.replaceAll("-"," "),await graphic.getIconImage(e+'.svg', graphic.prefColors(0, 0, 128, 128), 128, 128))
        });
    }
    async getEmoji(emojiName) {
        if (!this.guild) this.guild = await client.guilds.fetch(emojiGuild);

        let emoji = await this.guild.emojis.cache.find((emoji) => emoji.name == emojiName);
        if (emoji) {
            return "<:" + emoji.name + ":" + emoji.id + ">"
        } else {
            return;
        }
    }
    async insertEmoji(emojiName, imageUrl) {
        if (!this.guild) this.guild = await client.guilds.fetch(emojiGuild);
        try {
            const emoji = await this.guild.emojis.create(imageUrl, emojiName);
            return "<:" + emoji.name + ":" + emoji.id + ">"
        } catch (error) {
            console.error(error);
        }
    }
    async createOrGetEmoji(emojiName, image, pixeled = false, stroke) {
        emojiName = emojiName.replaceAll(" ","_")
        if (!this.guild) this.guild = await client.guilds.fetch(emojiGuild);
        let emoji = await this.guild.emojis.cache.find((emoji) => emoji.name == emojiName);
        if (!emoji) {
            const canvas = createCanvas(128, 128);
            const context = canvas.getContext('2d');
            let scale;
            if (stroke) scale = graphic.getImageScaling(image, canvas.width, canvas.height, 0, 0, 3);
            else scale = graphic.getImageScaling(image, canvas.width, canvas.height, 0, 0, 0);
            if (pixeled) graphic.imageSmoothing(context, false)
            if (stroke) await graphic.addWhiteBorderedImage(image, context, scale, 2, false, stroke)
            else context.drawImage(image, scale.sx, scale.sy, scale.ex, scale.ey)
            if (pixeled) graphic.imageSmoothing(context, true)
            
            const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: emojiName });

            return await this.insertEmoji(emojiName, attachment)
            
        } else {
            return "<:" + emoji.name + ":" + emoji.id + ">"
        }

    }
}

module.exports = new Emoji();