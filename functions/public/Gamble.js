const { createCanvas, loadImage, Image } = require('canvas');
const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
var gifFrames = require('gif-frames');
const events = require(modules.Events)
const Schedule = require(modules.Schedule);
const bucket = require(modules.Bucket)
const graphic = require(modules.CustomGraphics);
const ge = require(modules.GrandExchange);
const GIFEncoder = require('gif-encoder-2')
const util = require(modules.Util)
var config = {
    "max": 4,
    "weekly": 1,
    "price": 1000000,
    "used": []
}


class Gamble {
    constructor() {
        events.addEvent(this)
        //Schedule.addSchedule('* * * * *', this.Update)
        //this.getEvents()
        //this.settup();
    }
    async settup() {
        var to = await client.channels.cache.find(channel => channel.id === '1151566265140392008')

        var that = await to.messages.fetch('1151568052173938758');
        that.edit({ files: [await this.getMainImage()], components: await this.getMainButtons() })
    }
    getEvents() {
        //console.log(bucket.getData("messages").id)
        return [{ "type": 3 }];
    }
    Update() {
        console.log("RARAR")
    }
    //TODO: CREATE INPUT HANDELER WITH IDS AND METHOD CALLING
    async onEventUpdate(interaction) {
        if (interaction.customId.includes("gamble-")) {
            var to = await client.channels.cache.find(channel => channel.id === '1151566265140392008')
            config.used[config.used.length] = Number(interaction.customId.replace("gamble-", ""))
            var that = await to.messages.fetch('1151568052173938758');
            await that.edit({ components: await this.getMainButtons() })
            await interaction.deferReply({ ephemeral: true });

            var items = ["Dark bow", "Coins", "Coins", "Uncut onyx", "Abyssal whip", "Shark", "Volcanic whip mix", "Amulet of fury", "Dragon bones", "Old school bond"]

            interaction.editReply({ files: [await this.getDiscoverGif(items[interaction.customId.replace("gamble-", "") % items.length])], components: [this.getDiscoverButtons()], ephemeral: true });
        }
    }
    getDiscoverButtons() {
        const button = new ButtonBuilder()
            .setCustomId("requestPrize")
            .setLabel("REQUEST PRIZE")
            .setStyle(ButtonStyle.Success);

        const button2 = new ButtonBuilder()
            .setCustomId("sellBack")
            .setLabel("SELL BACK")
            .setStyle(ButtonStyle.Danger);

        const actionRow = new ActionRowBuilder()
            .addComponents(button, button2);

        return actionRow;
    }
    async getDiscoverGif(itemname) {
        console.time('myCode');
        const canvWidth = 150, canvHeigt = 200, amountFrames = 50;


        var encoder = new GIFEncoder(canvWidth, canvHeigt, 'neuquant', true)
        encoder.start()
        encoder.setDelay(100)
        encoder.setRepeat(false)
        const bagtop = await loadImage(resources + "/images/items/lootingBagHalfs/LootingBagTop.png");
        const bagbot = await loadImage(resources + "/images/items/lootingBagHalfs/LootingBagBottom.png")

        var bagscale = graphic.getImageScaling(bagtop, canvWidth, canvHeigt, 0, 50, 5)
        var img = await ge.getItemImage(itemname)
        var framos;
        var prefColours = graphic.prefColors(0, 0, canvWidth * 2, canvHeigt * 2);
        var finalscale = graphic.getImageScaling(img, canvWidth, canvHeigt, 0, 65, 40)
        for (let i = 0; i < amountFrames; i++) {
            if (!framos) {
                const canvas = createCanvas(canvWidth, canvHeigt)
                const ctx = canvas.getContext('2d')
                ctx.fillStyle = prefColours;
                ctx.strokeStyle = prefColours;
                graphic.roundRect(ctx, 0, 0, canvas.width, canvas.height, 0, true, false)

                ctx.drawImage(bagtop, bagscale.sx, bagscale.sy + (i * 5), bagscale.ex, bagscale.ey)

                graphic.imageSmoothing(ctx, false);
                if (i < 9) {
                    var scale = graphic.getImageScaling(img, canvas.width, canvas.height, 0, 60, 100 - (i * 7))
                    ctx.drawImage(img, scale.sx, scale.sy - (i * 12), scale.ex, scale.ey);
                } else {
                    ctx.drawImage(img, finalscale.sx, finalscale.sy - 100, finalscale.ex, finalscale.ey);
                }
                graphic.imageSmoothing(ctx, true);
                if (i > 6) {
                    ctx.font = 'bold 12pt Poppins-bold'
                    ctx.textAlign = 'center'
                    ctx.textBaseline = 'middle'
                    ctx.fillStyle = 'white'
                    ctx.fillText("Congratulations!", canvas.width / 2, canvas.height - 35, (i - 6) * 9)
                    ctx.font = 'bold 11pt Poppins-bold'
                    ctx.fillText(itemname, canvas.width / 2, canvas.height - 20, (i - 6) * 8)
                }
                ctx.drawImage(bagbot, bagscale.sx, bagscale.sy + (i * 5), bagscale.ex, bagscale.ey)
                encoder.addFrame(ctx)
                if (i > 18) {
                    framos = ctx
                }
            } else {
                encoder.addFrame(framos)
            }
        }
        encoder.finish();
        console.timeEnd('myCode');
        return new AttachmentBuilder(encoder.out.getData(), { name: 'Discover.gif', extension: 'image/gif' });
    }
    async getMainImage() {
        const canvas = createCanvas(1400, 890);
        const context = canvas.getContext('2d');
        context.fillStyle = graphic.prefColors(0, 0, canvas.width, canvas.height)

        graphic.roundRect(context, 0, 0, 1400, canvas.height, 20, true)
        context.fillStyle = "white"
        context.font = 'bold 45pt Poppins-bold'
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillText("FRIDAY GAMBLE", canvas.width / 2, 35)
        var items = ["Dark bow", "Volcanic whip mix", "Tanzanite fang", "Uncut onyx", "Abyssal whip", "Shark", "Fire rune", "Amulet of fury", "Dragon bones", "Old school bond"]
        context.strokeStyle = "white"

        var columns = 10, rows = 1, images = [];

        var width = canvas.width - 20, height = 120, thickness = 2;

        var cellWidth = (width - thickness) / columns;
        var cellHeight = (height - thickness) / rows;
        /* 
        for (var i in items) {
            images[images.length]=await ge.getItemImage(items[i])
        }

        context.drawImage(graphic.drawGridWithImages(rows, columns, width, height, thickness, images),10,10)
        */
        var barrows = await loadImage(resources + "/images/monsters/Barrows_Chests.png");
        //context.drawImage(graphic.flipImage(barrows,true,false), -barrows.width/3, 1)
        //context.drawImage(barrows, canvas.width-(barrows.width/3*2), 1)
        context.drawImage(await graphic.producerTag(50, false), 5, 5)
        context.fillStyle = "rgba(0, 0, 0, 0.3)"
        graphic.roundRect(context, 10, canvas.height - 10 - height, width, height, 20, true)


        var infoBoxWidth = 320;
        context.drawImage(graphic.drawInfoBox("Questions", "You can always dm: Ryglu or M3rchm3now, if you dont understand something.", infoBoxWidth, 250, 3, 15, true), 10, 68)
        context.drawImage(graphic.drawInfoBox("Reason", " The reason for this clan activity is to give something back towards the clan members but also recieve income for other clan events.\n All money gained(profit above the buy in amount of the items) will be used for the clan and be placed in the clan bank.\n We made it so people cant get addicted or be able to gamble their whole bank at once.", infoBoxWidth, 470, 3, 15, true), 10, 277)
        var infoboxprice = graphic.drawInfoBox("Price", "1m", infoBoxWidth, 70, 3, 30, true, true)
        context.drawImage(graphic.drawInfoBox("RULES", "You have only 4 tries per month at MAX\nOnly 1 try is allowed to be used per week.\nGamble is only on Fridays (so Friday morning 06:00 until Friday night 00:00 +Gmt 1)", infoBoxWidth, 70, 3, 15, true), canvas.width - 10 - infoboxprice.width, infoboxprice.height + 68 + 10)
        context.drawImage(infoboxprice, canvas.width - 10 - infoboxprice.width, 68)
        context.drawImage(graphic.drawInfoBox("HOW TO", " Under this image you have buttons corresponding to placement in grid.\n If you want to try to gamble you need to have sufficient funds in your wallet.\n Once you buy a 'tile' you will discover what was under it, with options to either sell or request gained item\n If you make no action you can find said item in your wallet's loot pouch", infoBoxWidth, 70, 3, 15, true), canvas.width - 10 - infoboxprice.width, infoboxprice.height + 68 + 245)


        context.drawImage(graphic.drawGrid(rows, columns, width, height, thickness), 10, canvas.height - 10 - height)
        for (let row = 0; row < rows; row++) {

            for (let col = 0; col < columns; col++) {
                var image = await ge.getItemImage(items[row * columns + col])
                if (image) {
                    const x = thickness + col * cellWidth + 10;
                    const y = thickness + row * cellHeight + canvas.height - 10 - height;
                    var scale = graphic.getImageScaling(image, cellWidth, cellHeight * 0.8, x, y, 20)
                    graphic.imageSmoothing(context, false);
                    context.drawImage(image, scale.sx, scale.sy, scale.ex, scale.ey);
                    graphic.imageSmoothing(context, true);
                    context.font = 'bold ' + cellWidth * 0.08 + 'pt Poppins-bold'
                    context.fillStyle = "white"
                    context.fillText(items[row * columns + col], x + cellWidth / 2, y + (cellHeight * 0.8), cellWidth)

                    context.fillText(util.abbreviateNumber((await ge.getItemFullInfo(items[row * columns + col])).high, true), x + cellWidth / 2, y + (cellHeight * 0.9), cellWidth)
                }
            }
        }
        context.fillStyle = "rgba(0, 0, 0, 0.3)"
        graphic.roundRect(context, canvas.width / 2 - 680 / 2, 68, 680, 680, 20, true)
        context.drawImage(graphic.drawGrid(5, 5, 680, 680, 3), canvas.width / 2 - 680 / 2, 68)
        var columnsx = 5, rowsx = 5;

        var width = 680, height = 680, thickness = 2;
        var cellWidth = (width - thickness) / columnsx;
        var cellHeight = (height - thickness) / rowsx;
        for (let row = 0; row < rowsx; row++) {

            for (let col = 0; col < columnsx; col++) {
                var particularItem = items[((row * columnsx) + col) % items.length]

                var scale;
                const x = thickness + col * cellWidth + canvas.width / 2 - width / 2;
                const y = thickness + row * cellHeight + 68;
                if (Math.random() < 0.5) {
                    var image = await ge.getItemImage(particularItem)
                    var scale = graphic.getImageScaling(image, cellWidth, cellHeight * 0.9, x, y, 30)

                    graphic.addWhiteBorderedImage(image, context, scale, 3, true)

                    context.font = 'bold ' + cellWidth * 0.08 + 'pt Poppins-bold'
                    context.fillStyle = "white"
                    context.fillText(items[((row * columnsx) + col) % items.length], x + cellWidth / 2, y + (cellHeight * 0.9), cellWidth)
                } else {
                    var image = await loadImage(resources + "/images/pixelart/questionmark.png");
                    var scale = graphic.getImageScaling(image, cellWidth, cellHeight * 1, x, y, 40)
                    graphic.imageSmoothing(context, false);
                    context.drawImage(image, scale.sx, scale.sy, scale.ex, scale.ey);
                    graphic.imageSmoothing(context, true);
                    context.fillStyle = "white"
                    context.font = 'bold '+30+'pt Poppins-bold'
                    context.fillText((row * columnsx) + col+1, x + cellWidth / 2, y+cellHeight/2, cellWidth)
                }
            }
        }
        return new AttachmentBuilder(canvas.toBuffer(), 'Gamble.png');
    }
    async getMainButtons() {
        const numRows = 5;
        const numCols = 5;
        const buttons = [];

        for (let i = 0; i < numRows; i++) {
            const row = [];
            for (let j = 0; j < numCols; j++) {
                const label = (i * numCols + j + 1).toString();
                const customId = `gamble-${(i * numCols + j + 1)}`;

                const button = new ButtonBuilder()
                    .setCustomId(customId)
                    .setLabel(label)
                    .setStyle(ButtonStyle.Secondary);
                if (config.used.includes((i * numCols + j + 1))) {
                    button.setDisabled(true);
                    button.setStyle(ButtonStyle.Secondary)
                }
                row.push(button);
            }
            buttons.push(row);
        }
        const actionRows = buttons.map((row) => new ActionRowBuilder().addComponents(row));
        return actionRows;
    }
}

module.exports = new Gamble();