const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createCanvas, loadImage, Image } = require('canvas');
const graphic = require(modules.CustomGraphics);
const ge = require(modules.GrandExchange);
const bucket = require(modules.Bucket)
const util = require(modules.Util)

class Wallet {
  constructor() {
    //this.getInvyImage("292647346318082048");
  }

  async getInvyImage(id) {
    const canvasWidth = 1400;
    const cellSize = 200;
    let gap = 10;
    const iconSize = 50; // Size of help, left, and right icons
    const bottomBarHeight = 90;
    let wallets = bucket.getData("wallet")
    if (!wallets.hasOwnProperty(id)) wallets[id] = {"invent":{},"donated":0,"balance":0}
    let wal = wallets[id];
    // Calculate the number of rows and columns based on the inventory length
    const maxRows = 4;

    let numRows = Math.max(Math.min(Math.ceil(Object.keys(wal.invent).length / 5), maxRows), 2);
    const numCols = 5;

    // Calculate the canvas height based on the number of rows and gaps
    const canvasHeight = numRows * cellSize + (numRows - 1) * gap + bottomBarHeight + gap;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const context = canvas.getContext('2d');
    let prices = await this.getTotalInventoryPrice(wal.invent)

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        // Calculate the x and y positions with gaps
        const x = col === 0 ? col * cellSize : col * (cellSize + gap);
        const y = row === 0 ? row * cellSize : row * (cellSize + gap);

        // Draw a rounded rectangle in each cell
        context.fillStyle = graphic.prefColors(x, y, cellSize + 50, cellSize + 50);
        graphic.roundRect(context, x, y, cellSize, cellSize, 20, true);
        context.fillStyle = "rgba(0, 0, 0, 0.3)";
        graphic.roundRect(context, x + 10, y + 10, cellSize - 20, cellSize - 20, 50, true);

        const itemIndex = row * numCols + col;
        if (itemIndex < Object.keys(wal.invent).length) {
          let key = Object.keys(wal.invent)[itemIndex]
          const image = await ge.getItemImage(Number(key));
          if (image) {
            const scale = graphic.getImageScaling(image, cellSize, cellSize, x, y, 57);
            graphic.addWhiteBorderedImage(image, context, scale, 3, true);
          }
          context.font = 'bold ' + cellSize * 0.08 + 'pt Poppins-bold'
          context.fillStyle = "white"; context.textAlign = 'right';
          if (wal.invent[key].amount > 1) context.fillText("x" + util.abbreviateNumber(wal.invent[key].amount, true), x + cellSize * 0.95, y + (cellSize * 0.13), cellSize)
          context.textAlign = 'center';
          context.fillText(util.abbreviateNumber(prices.individual[key]*wal.invent[key].amount,true), x + cellSize / 2, y + (cellSize * 0.98), cellSize)
        }
        context.font = 'bold ' + cellSize * 0.08 + 'pt Poppins-bold'
        context.fillStyle = "white"; context.textAlign = 'right';

        context.fillText(itemIndex + 1, x + cellSize * 0.95, y + (cellSize * 0.95), cellSize)
      }
    }


    let articleX = (cellSize + gap) * numCols
    context.fillStyle = graphic.prefColors(articleX, 0, canvasWidth - articleX, canvasHeight);
    graphic.roundRect(context, articleX, 0, canvasWidth - articleX, (2 * (cellSize + gap)) - gap, 20, true);

    graphic.headShot(context, id, articleX + (canvasWidth - articleX) / 2 - 75, 40, 75, 3, true)

    context.font = 'bold ' + 30 + 'pt Poppins-bold'
    context.fillStyle = "white"; context.textAlign = 'center';
    let them = client.users.cache.find(user => user.id == id)
    context.fillText(them.globalName + "'s", articleX + (canvasWidth - articleX) / 2, 240)
    context.fillText("wallet", articleX + (canvasWidth - articleX) / 2, 280)

    context.font = 'bold ' + 15 + 'pt Poppins-bold'
    context.fillText("ID:" + id, articleX + (canvasWidth - articleX) / 2, 25)

    context.font = 'bold ' + 15 + 'pt Poppins-bold'
    context.fillText(util.abbreviateNumber(wal.amount,false), articleX + (canvasWidth - articleX) / 2, 300)
    context.fillText(util.abbreviateNumber(prices.total, false) || 0, articleX + (canvasWidth - articleX) / 2, 320)







    // Define the icons and their positions
    const iconInfo = [
      { iconName: "caret-left-square-fill.svg", text: "First page" },
      { iconName: "caret-left-fill.svg", text: "Previous page" },
      { iconName: "arrow-repeat.svg", text: "Refresh" },
      { iconName: "caret-right-fill.svg", text: "Next page" },
      { iconName: "caret-right-square-fill.svg", text: "Last page" },
    ];
    const bottomBarY = canvasHeight - bottomBarHeight;
    gap = 5;
    for (let i = 0; i < iconInfo.length; i++) {
      let w = (canvas.width - ((iconInfo.length - 2) * gap)) / iconInfo.length
      const x = i === 0 ? i * w : i * (w + gap);
      const xMid = i === 0 ? x + w / 2 : x + w / 2 - gap;
      const y = bottomBarY;
      const iconI = iconInfo[i];
      const iconImage = await graphic.getIconImage(iconI.iconName, "white", iconSize, iconSize);

      // Draw a rounded rectangle around the icon
      context.fillStyle = graphic.prefColors(x, y, w, bottomBarHeight);
      graphic.roundRect(context, x, y, w - gap, bottomBarHeight, 20, true);

      // Draw the icon on top of the rounded rectangle
      context.drawImage(iconImage, xMid - iconSize / 2, y + 8, iconSize, iconSize);
      context.font = 'bold ' + 15 + 'pt Poppins-bold'
      context.fillStyle = "white"
      context.fillText(iconI.text, xMid, y + 78)
    }

    let to = await client.channels.cache.find(channel => channel.id === '1153761821229060107');
    let that = await to.messages.fetch('1157219428337995796');
    that.edit({ files: [new AttachmentBuilder(canvas.toBuffer(), 'Invy.png')], components: await this.getInvyButtons(numRows,Object.keys(wal.invent).length) });
  }

  async getTotalInventoryPrice(invy) {
    let prices = await ge.getItemsCurrentPrice(Object.keys(invy));
    let total = { "individual": prices, "total": 0 };
    Object.keys(invy).forEach(slot => {
      total.total += prices[slot] * invy[slot].amount
    });
    return total
  }

  async getInvyButtons(numRows,max) {
    numRows++;
    const numCols = 5;
    const buttons = [];
    for (let i = 0; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        const label = (i * numCols + j + 1).toString();
        const customId = `wallet-${(i * numCols + j + 1)}`;
        if ((numRows * numCols) - numCols < (i * numCols + j + 1)) {
          const button = new ButtonBuilder()
            .setCustomId(customId)
            .setLabel("A")
            .setStyle(ButtonStyle.Secondary);
          row.push(button);
        } else {
          const button = new ButtonBuilder()
          .setCustomId(customId)
          .setLabel(label)
          .setStyle(ButtonStyle.Secondary);
          if ((i * numCols + j + 1)>max) {
            button.setDisabled(true)
          }  
          row.push(button);
        }

      }
      buttons.push(row);
    }
    const actionRows = buttons.map((row) => new ActionRowBuilder().addComponents(row));
    return actionRows;
  }
}

module.exports = new Wallet();