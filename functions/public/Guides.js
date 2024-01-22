const fs = require('fs'), path = require('path');
const { registerFont, createCanvas, loadImage, Image } = require('canvas');
const { AttachmentBuilder,MessageActionRow, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const graphics = require(modules.CustomGraphics);
class Guide {

    constructor() {
        //this.sendGuideSelectMenu()
    }
    async sendGuideSelectMenu() {
        // Replace 'YOUR_CHANNEL_ID' with the actual channel ID where you want to send the message
        const channelId = '1151842842533187614';

        // Fetch the channel by ID
        const channel = client.channels.cache.get(channelId);

        if (!channel) {
            console.error(`Channel with ID ${channelId} not found.`);
            return;
        }

        // Generate select menu options based on guides in the directory
        const guideDirectory = resources+'/guides/';
        const guideOptions = [];

        fs.readdirSync(guideDirectory).forEach((guide) => {
            // Assuming guide is a subdirectory name
            guideOptions.push(
                new StringSelectMenuOptionBuilder()
                    .setLabel(guide)
                    .setDescription(guide)
                    .setValue(guide)
            );
        });

        
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('guideSelect')
            .setPlaceholder('Select a guide')
            .addOptions(guideOptions);

        const row = new ActionRowBuilder()
            .addComponents(selectMenu);
        // Create a message with the select menu
        const message = {
            content: 'Choose a guide:',
            components: [row],
        };

        // Send the message to the channel
        const sentMessage = await channel.send(message);
    }
    async getHeader(title,creator) {
        const canvas = createCanvas(1400, 420);
        const context = canvas.getContext('2d');

        context.fillStyle = graphics.prefColors(0, 0, canvas.width, canvas.height);
        context.strokeStyle = graphics.prefColors(0, 0, canvas.width, canvas.height);
        graphics.roundRect(context, 0, 120, canvas.width, 120, 20, true);

        context.font = 'bold 40pt Poppins-bold'
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillStyle = 'white'
        context.fillText(title.toUpperCase(), canvas.width/2, 180);

        await graphics.headShot(context, creator, 20, 75, 50, 3)

        context.font = 'bold 40pt Poppins'
        context.textAlign = 'left'
        context.fillText("by M3RCHM3NOW".toUpperCase(), 135, 120);
        var boss = await loadImage(resources+"/images/monsters/Vorkath.png");
        var scale = graphics.getImageScaling(boss,250,250,1100,0,0)
        graphics.addWhiteBorderedImage(boss,context,scale,3)
        return new AttachmentBuilder(canvas.toBuffer(), 'header.png');;
    }
    loadGuide(boss) {
        var text = fs.readFileSync(resources+'/guides/' + boss + '/text.txt').toString('utf-8')
        const files = fs.readdirSync(resources+'/guides/' + boss + '/images', { withFileTypes: true });
        text = text.split("<img>")
        var format = [];
        for (const block of text) {
            if (files.length > text.indexOf(block)) {
                const imageBuffer = fs.readFileSync(resources+'/guides/' + boss + '/images/' + files[text.indexOf(block)].name);
                format[format.length] = { content:block, files: [{ attachment: imageBuffer, name: 'myImage.png' }],ephemeral: true };
            } else {
                format[format.length] = { content:block ,ephemeral: true };
            }
        }

        return format;
    }
}

module.exports = new Guide();