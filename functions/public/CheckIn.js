const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { createCanvas, loadImage, Image } = require('canvas');
const imageToBase64 = require('image-to-base64');

const events = require(modules.Events)
const net = require(modules.Networking);
const graphic = require(modules.CustomGraphics);
const ge = require(modules.GrandExchange);
const bucket = require(modules.Bucket)
const util = require(modules.Util)
const users = require(modules.Users)
const emoji = require(modules.Emojis)

class CheckIn {
    constructor() {
        events.addEvent(this)
        this.initiate()
    }
    async initiate() {
        let what = "activityChecker"
        let ref = bucket.getData("savedRefs")
        if (!ref.hasOwnProperty(what)) {
            ref[what] = {};
            bucket.setData(ref,"savedRefs")
        } else if (!ref[what].hasOwnProperty("messageId")) {
            let to = await client.channels.cache.find(channel => channel.id === ref[what].channelId);
            to.send(await this.getRankProggresion(["1151054931558682634", "1151054931558682634", "1151054931558682634"])).then(e=>{
                ref[what].messageId = e.id;
                bucket.setData(ref,"savedRefs")
            });
        } else if (ref[what].hasOwnProperty("messageId")) {
            let to = await client.channels.cache.find(channel => channel.id === ref[what].channelId);
            let that = await to.messages.fetch(ref[what].messageId);
            that.edit(await this.getRankProggresion(["1151054931558682634", "1151054931558682634", "1151054931558682634"]));
        }
    }
    getEvents() {
        return [{ "type": 3 }];
    }
    async onEventUpdate(interaction) {
        if (interaction.customId.includes("checkin-button-accept")) {
            interaction.reply({ content: await users.rankUpUserById(interaction.member.user.id), ephemeral: true })
        }
    }
    async getRankProggresion(ids) {
        const canvas = createCanvas(1400, 250);
        const context = canvas.getContext('2d');

        context.fillStyle = graphic.prefColors(0, 0, canvas.width, canvas.height);
        graphic.roundRect(context, 0, 0, canvas.width, canvas.height, 20, true);
        var rankIcons = bucket.getData("clanIcons")
        let ranks = users.getAllRankNames()
        let newIcon = false;
        for (let i = 0; i < ranks.length; i++) {
            if (!rankIcons.hasOwnProperty(ranks[i])) {
                let requestedIcon = await this.requestBase64Image(ranks[i])
                if (requestedIcon) {
                    newIcon = true;
                    rankIcons[ranks[i]] = { base64: requestedIcon };
                }
            }

        }
        if (newIcon) bucket.setData(rankIcons, "clanIcons")

        const guild = await client.guilds.fetch(config.mainGuild);

        const rolesArray = guild.roles.cache.map((role) => role);
        rolesArray.sort((a, b) => a.rawPosition - b.rawPosition);
        let roleEmojis = [];

        for (const name in rolesArray) {
            if (rankIcons.hasOwnProperty(rolesArray[name].name.toLowerCase())) roleEmojis[roleEmojis.length] = await emoji.createOrGetEmoji(rolesArray[name].name.toLowerCase(), await graphic.loadImageFromBase64(rankIcons[rolesArray[name].name.toLowerCase()].base64), true)
        }


        context.strokeStyle = graphic.prefTextFillColors(0, 0, canvas.width, canvas.height);
        graphic.roundRect(context, 20, 30, canvas.width - 40, canvas.height - 50, 20, false, true, 5)


        let img = await graphic.loadImageFromBase64(rankIcons["beast"].base64)
        let scale = graphic.getImageScaling(img, 60, 60, 60, 0, 0);

        context.font = 'bold 20pt Poppins-bold'
        context.textAlign = "left"
        context.textBaseline = "middle"
        context.fillStyle = graphic.prefColors(0, 0, canvas.width, canvas.height);
        graphic.roundRect(context, scale.sx, scale.sy, scale.ex + context.measureText("MVP's of the month").width + 13, scale.ey, 20, true)
        context.fillStyle = "white"
        context.fillText("MVP's of the month", scale.sx + scale.ex + 5, scale.ey / 2);

        graphic.imageSmoothing(context, false)
        context.drawImage(img, scale.sx + 5, scale.sy, scale.ex, scale.ey)
        graphic.imageSmoothing(context, true)


        let cats = ["The Grinder", "Lucky charm", "The PKer"]
        context.font = 'bold 20pt Poppins'
        /*
        for (let i = 0; i < cats.length; i++) {
            let totalImg = await loadImage(resources + "/images/skills/Overall_icon.png")
            scale = graphic.getImageScaling(totalImg, 60, 60, 40 + i * ((canvas.width - 70) / cats.length), 70, 20);
            context.fillText(cats[i], scale.sx + scale.ex + 5, 100);
            graphic.roundRect(context, 40 + i * ((canvas.width - 70) / cats.length), 70, ((canvas.width - 70) / cats.length) - 10, 200, 20, false, true, 3)

            await graphic.headShot(context, ids[i], 40 + i * ((canvas.width - 70) / cats.length)+((canvas.width - 70) / cats.length)/2-35, 130, 30)
            graphic.imageSmoothing(context, false)
            context.drawImage(totalImg, scale.sx, scale.sy, scale.ex, scale.ey)
            graphic.imageSmoothing(context, true)
        }
        */
        context.textAlign = "center"
        context.fillText("Work in progress", canvas.width / 2, canvas.height / 2);


        let rankDisposition = [8, 3, 1, 4];
        let text = ["1 month ranks", "Donator ranks", "Special ranks", "Admin roles"];
        let resultString = '';

        let cumulativeStartIndex = 1; // Initialize the cumulative start index
        for (let i = 0; i < rankDisposition.length; i++) {
            resultString += "- " + text[i] + ': ';
            const startIndex = cumulativeStartIndex;
            const endIndex = startIndex + rankDisposition[i];
            let emojisForGroup = roleEmojis.slice(startIndex, endIndex);
            for (let emoji of emojisForGroup) {
                resultString += emoji + " ";
            }
            resultString += '\n';
            cumulativeStartIndex = endIndex;
        }

        let checkInEmoji = await emoji.createOrGetEmoji("alarm fill", await graphic.getIconImage('alarm-fill.svg', graphic.prefTextFillColors(0, 0, 128, 128), 128, 128), false, graphic.prefTextStrokeColors(0, 0, 128, 128))
        const button = new ButtonBuilder()
            .setCustomId("checkin-button-accept")
            .setEmoji(checkInEmoji)
            .setLabel("Confirm my activity")
            .setStyle(ButtonStyle.Secondary);
        const actionRows = new ActionRowBuilder().addComponents(button);
        let StringTime = "<t:" + (util.getFirstDayOfNextMonth().getTime() / 1000) + ":R>";
        const exampleEmbed = new EmbedBuilder()
            .setTitle('Activity Checker')
            .setDescription('When you use the Activity Checker Button, you seamlessly enroll in our activity tracking system. This action automatically grants you a new rank in both our Discord and OSRS clan. Please be aware that in-game rank updates may take up to 48 hours to apply. \n\n By signing up for the Activity Checker, you will also be automatically entered into our monthly giveaway. Details of the giveaway and its rules are outlined below.')
            .setColor(graphic.prefEmbedColor())
            .addFields({
                name: 'Giveaway', value: 'The giveaway occurs once per month.\n' +
                    '- All members who have participated in the Activity Checker for that month will be entered into the drawing.\n' +
                    '- Three winners will be randomly selected each month, with each winner receiving a different prize, typically in the form of GP.', inline: true
            }).addFields({ name: 'Check in for this month ends: ' + StringTime, value: "\u200B" })
            .addFields({
                name: "Ranks",
                value: resultString
            });
            
        const attachment = new AttachmentBuilder(await canvas.toBuffer(), { name: 'random.png' });
        exampleEmbed.setImage(`attachment://${attachment.name}`);


        return { embeds: [exampleEmbed], files: [attachment], components: [actionRows] }
    }

    async requestBase64Image(name) {
        try {
            const response = await imageToBase64('https://oldschool.runescape.wiki/images/' + net.hypertextify("Clan_icon_-_" + util.capitalizeFirstLetter(name)) + ".png");
            if (response !== "c3RvcmFnZTogb2JqZWN0IGRvZXNuJ3QgZXhpc3QK") {
                return 'data:image/png;base64,' + response;
            } else {
                const response = await imageToBase64('https://oldschool.runescape.wiki/images/' + net.hypertextify(util.capitalizeFirstLetter(name) + "_-_Clan_icon") + "png");
                if (response !== "c3RvcmFnZTogb2JqZWN0IGRvZXNuJ3QgZXhpc3QK") {
                    return 'data:image/png;base64,' + response;
                } else console.log("Could not find item: " + name); // Use item.name for better error reporting
            }
        } catch (error) {
            console.error("Error fetching item image:", error);
        }

    }
}

module.exports = new CheckIn();