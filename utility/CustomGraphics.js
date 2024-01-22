const { createCanvas, loadImage, Image } = require('canvas');
const sharp = require('sharp');

const net = require(modules.Networking);
var prefColours = ["#200122", "#6f0000"]
let testColours = ["#330B2D", "#220202"];
let textFillColours = ["#A5A5A5", "#F8F8F8"];
let textStrokeColours = ["#620F59", "#811811"]
class CustomGraphics {
    constructor() {

    }
    prefColors(x1, y1, x2, y2) {
        const canvas = createCanvas(x2, y2);
        const context = canvas.getContext('2d');
        var grd = context.createRadialGradient(x1, y1, x2, y2);
        grd.addColorStop(0, testColours[0])
        grd.addColorStop(1, testColours[1]);
        return grd;
    }
    prefTextFillColors(x1, y1, x2, y2) {
        const canvas = createCanvas(x2, y2);
        const context = canvas.getContext('2d');
        var grd = context.createRadialGradient(x1, y1, x2, y2);
        grd.addColorStop(0, textFillColours[0])
        grd.addColorStop(1, textFillColours[1]);
        return grd;
    }
    prefTextStrokeColors(x1, y1, x2, y2) {
        const canvas = createCanvas(x2, y2);
        const context = canvas.getContext('2d');
        var grd = context.createRadialGradient(x1, y1, x2, y2);
        grd.addColorStop(0, textStrokeColours[0])
        grd.addColorStop(1, textStrokeColours[1]);
        return grd;
    }
    prefEmbedColor() {
        return "#330B2D";
    }
    roundRect(ctx, x, y, width, height, radius = 5, fill = false, stroke = false, thickness = 1) {
        if (typeof radius === 'number') {
            radius = { tl: radius, tr: radius, br: radius, bl: radius };
        } else {
            radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius };
        }
        ctx.lineWidth = thickness
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }
    }
    roundImage(context, image, x, y, width, height, radius) {
        // Create a clipping path for the rounded image
        context.save();
        context.beginPath();
        context.moveTo(x + radius, y);
        context.lineTo(x + width - radius, y);
        context.quadraticCurveTo(x + width, y, x + width, y + radius);
        context.lineTo(x + width, y + height - radius);
        context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        context.lineTo(x + radius, y + height);
        context.quadraticCurveTo(x, y + height, x, y + height - radius);
        context.lineTo(x, y + radius);
        context.quadraticCurveTo(x, y, x + radius, y);
        context.closePath();
        context.clip();

        // Draw the image inside the clipping path
        context.drawImage(image, x, y, width, height);

        // Restore the context to remove the clipping path
        context.restore();
    }
    async getBaner(name) {
        const canvas = createCanvas(1400, 120);
        const context = canvas.getContext('2d');

        context.fillStyle = this.prefColors(0, 0, canvas.width, canvas.height);
        context.strokeStyle = this.prefColors(0, 0, canvas.width, canvas.height);
        this.roundRect(context, 0, 0, canvas.width, canvas.height, 20, true);

        context.font = 'bold 40pt Poppins-bold'
        context.textAlign = 'left'
        context.textBaseline = 'middle'
        context.fillStyle = 'white'
        context.fillText(name.toUpperCase(), 30, canvas.height / 2);
        let me = client.users.cache.find(user => user.id == "292647346318082048")
        const avatar = await loadImage(me.displayAvatarURL({ extension: 'png' }));

        await this.headShot(context, "292647346318082048", canvas.width - avatar.width + 70, canvas.height - avatar.height + 70, 25)
        context.font = 'bold 15pt Poppins'
        context.textAlign = 'right'
        context.fillStyle = 'white'
        context.fillText("POWERD BY RYGLUS", canvas.width - avatar.width + 60, canvas.height - 33);


        return canvas;
    }
    async headShot(ctx, whom, x, y, size, thickness = 2) {
        let some1 = client.users.cache.find(user => user.id == whom)
        if (some1 != undefined) {
            const avatar = await loadImage(some1.displayAvatarURL({ extension: 'png' }));
            ctx.save();
            ctx.strokeStyle = "white";
            ctx.lineWidth = thickness;
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
        }
    }
    addWhiteBorderedImage(image, context, scale, thickness, pixed = false, color) {
        // Create an offscreen canvas and its context
        const offscreenCanvas = createCanvas(context.canvas.width, context.canvas.height);
        const offscreenContext = offscreenCanvas.getContext('2d');
        if (pixed) {
            offscreenContext.webkitImageSmoothingEnabled = false;
            offscreenContext.mozImageSmoothingEnabled = false;
            offscreenContext.imageSmoothingEnabled = false;
        }
        var pix = scale;
        var dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1], s = thickness, asd = 0, x = pix.sx, y = pix.sy;
        for (; asd < dArr.length; asd += 2) offscreenContext.drawImage(image, x + dArr[asd] * s, y + dArr[asd + 1] * s, pix.ex, pix.ey);

        // Set the global composite operation and fill the offscreen canvas with white
        offscreenContext.globalCompositeOperation = "source-atop";
        if (color) offscreenContext.fillStyle = color;
        else offscreenContext.fillStyle = "rgba(255, 255, 255, 1)";
        offscreenContext.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        // Draw the original image in normal mode on the offscreen canvas
        offscreenContext.globalCompositeOperation = "source-over";
        offscreenContext.drawImage(image, pix.sx, pix.sy, pix.ex, pix.ey);
        context.drawImage(offscreenCanvas, 0, 0);
    }
    /**
    * Calculate image scaling and positioning with border.
    * @param {Image} image - Object of image.
    * @param {number} startX - size on X.
    * @param {number} startY - size on Y.
    * @param {number} canvasX - top left corner (x position on canvas).
    * @param {number} canvasY - bottom left corner (y position on canvas).
    * @param {number} border - gap around the border (makes image smaller).
    * @returns {object} - Object containing { sx, sy, ex, ey }.
    */
    getImageScaling(image, startX, startY, canvasX, canvasY, border) {
        // Calculate scaled dimensions while maintaining aspect ratio
        const aspectRatio = image.width / image.height;
        let ex, ey;

        // Calculate ex and ey based on aspect ratio
        if (startX / startY <= aspectRatio) {
            ex = startX - border;
            ey = ex / aspectRatio;
        } else {
            ey = startY - border;
            ex = ey * aspectRatio;
        }

        // Calculate top-left corner coordinates (sx, sy) to center the image
        const sx = canvasX + (startX - ex) / 2;
        const sy = canvasY + (startY - ey) / 2;

        // Add border to coordinates
        const bx = sx; // Subtract the border from sx
        const by = sy; // Subtract the border from sy

        // Return the updated coordinates without adding border to ex and ey
        return { sx: bx, sy: by, ex, ey };
    }
    splitTextIntoLines(ctx, text, maxWidth) {
        const lines = text.split('\n');
        const resultLines = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const words = line.split(/\s+/);
            let currentLine = words[0];

            for (let j = 1; j < words.length; j++) {
                const word = words[j];
                const width = ctx.measureText(currentLine + ' ' + word).width;

                if (width < maxWidth) {
                    currentLine += ' ' + word;
                } else {
                    resultLines.push(currentLine);
                    currentLine = word;
                }
            }

            resultLines.push(currentLine);
        }

        return resultLines;
    }
    addSizeToRootSvgElement(svgData, width, height) {
        // Replace width and height attributes in the root <svg> element
        return svgData.replace(/<svg[^>]*>/, `<svg width="${width}" height="${height}">`);
    }
    async getUserBanner(uid) {
        const url = `https://discord.com/api/v8/users/${uid}`;

        try {
            const response = await net.signedDiscordRequest(url);

            if (response) {
                const data = JSON.parse(response);
                const receive = data['banner'];

                if (receive !== null) {
                    let size = 4096;
                    let format = 'png';
                    if (receive.substring(0, 2) === 'a_') {
                        format = 'gif';
                    }

                    const banner = `https://cdn.discordapp.com/banners/${uid}/${receive}.${format}?size=${size}`;
                    return banner;
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }

        // Return a default banner if none is found
        return;
    }
    async loadImageFromBase64(base64String) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve(img);
            };
            img.onerror = (error) => {
                reject(error);
            };
            img.src = base64String;
        });
    }
    imageSmoothing(context, smooth) {
        context.webkitImageSmoothingEnabled = smooth;
        context.mozImageSmoothingEnabled = smooth;
        context.imageSmoothingEnabled = smooth;
    }
    drawGrid(rows, columns, width, height, thickness) {
        const canvas = createCanvas(width + thickness, height + thickness);
        const context = canvas.getContext('2d');
        context.strokeStyle = "white"
        context.lineWidth = thickness
        this.roundRect(context, thickness, thickness, canvas.width - (thickness * 2), canvas.height - (thickness * 2), 20, false, true)

        // Calculate cell size
        const cellWidth = (width - thickness) / columns;
        const cellHeight = (height - thickness) / rows;

        // Draw horizontal lines
        for (let i = 1; i < rows; i++) {
            const y = thickness + i * cellHeight + 0.5;
            context.beginPath();
            context.moveTo(thickness, y);
            context.lineTo(canvas.width - thickness, y);
            context.stroke();
        }

        // Draw vertical lines
        for (let j = 1; j < columns; j++) {
            const x = thickness + j * cellWidth + 0.5;
            context.beginPath();
            context.moveTo(x, thickness);
            context.lineTo(x, canvas.height - thickness);
            context.stroke();
        }

        return canvas;
    }
    drawGridWithImages(rows, columns, width, height, thickness, images) {
        const canvas = createCanvas(width + thickness, height + thickness);
        const context = canvas.getContext('2d');
        context.strokeStyle = "white";
        context.lineWidth = 3;
        this.roundRect(context, thickness, thickness, canvas.width - (thickness * 2), canvas.height - (thickness * 2), 20, false, true);

        // Calculate cell size
        const cellWidth = (width - thickness) / columns;
        const cellHeight = (height - thickness) / rows;

        // Draw horizontal lines
        for (let i = 1; i < rows; i++) {
            const y = thickness + i * cellHeight + 0.5;
            context.beginPath();
            context.moveTo(thickness, y);
            context.lineTo(canvas.width - thickness, y);
            context.stroke();
        }

        // Draw vertical lines
        for (let j = 1; j < columns; j++) {
            const x = thickness + j * cellWidth + 0.5;
            context.beginPath();
            context.moveTo(x, thickness);
            context.lineTo(x, canvas.height - thickness);
            context.stroke();
        }

        // Draw images within cells
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const image = images[row * columns + col]; // Get the image for this cell
                if (image) {
                    const x = thickness + col * cellWidth;
                    const y = thickness + row * cellHeight;
                    const imageSize = Math.min(cellWidth, cellHeight); // Adjust image size to fit cell
                    context.drawImage(image, x, y, imageSize, imageSize);
                }
            }
        }

        return canvas;
    }
    drawInfoBox(title, text, width, height, thickness, fontsize, stroke = false, center = false) {
        const canvas = createCanvas(width + thickness, height + thickness);
        const context = canvas.getContext('2d');

        context.font = 'bold ' + fontsize + 'pt Poppins-bold'
        var lines = this.splitTextIntoLines(context, text, canvas.width - 20)
        var textHeight = (fontsize + 5) * (lines.length + 0.5)
        canvas.height = textHeight + 50
        context.lineWidth = thickness;
        context.fillStyle = "rgba(0, 0, 0, 0.6)"
        context.strokeStyle = "white"
        this.roundRect(context, 0 + thickness / 2, 0 + thickness / 2, width, textHeight + 50 - thickness, 20, true, stroke)

        context.fillStyle = "white"
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.font = 'bold ' + 25 + 'pt Poppins-bold'
        context.fillText(title, canvas.width / 2, 22);

        context.save()
        context.strokeStyle = "white"
        context.lineWidth = thickness
        context.beginPath(); context.moveTo(10, 40); context.lineTo(width - 10, 40); context.stroke();
        context.restore();

        context.font = 'bold ' + fontsize + 'pt Poppins'
        if (center) context.textAlign = 'center'
        else context.textAlign = 'left'
        for (let i = 0; i < lines.length; i++) {
            const lineY = textHeight / 2 + 40 + (fontsize + 5) * (i - lines.length / 2 + 0.5);
            if (center) context.fillText(lines[i], width / 2, lineY);
            else context.fillText(lines[i], 10, lineY);
        }

        return canvas;
    }
    createRectanglesWithText(width, height, textArray) {
        // Calculate the number of rows and columns based on the number of options
        const numOptions = textArray.length;
        let numRows, numCols;

        if (numOptions === 2) {
            numRows = 1;
            numCols = 2;
        } else if (numOptions === 3) {
            numRows = 1;
            numCols = 3;
        } else if (numOptions === 4) {
            numRows = 2;
            numCols = 2;
        } else {
            // Handle other cases here as needed
            numRows = numOptions; // Default to one row per option
            numCols = 1;
        }

        // Calculate the width and height of each rectangle
        const rectWidth = width / numCols;
        const rectHeight = height / numRows;
        const gapX = 7; // Adjust horizontal gap as needed
        const gapY = 7; // Adjust vertical gap as needed

        // Create a canvas
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Set font properties


        let textIndex = 0;
        let textInde = 0;
        // Loop through the rows
        let cumulativeHeight = 0;
        let totalHeight = 0;
        for (let row = 0; row < numRows; row++) {

            let maxRectHeightInRow = 0; // Initialize the maximum rectangle height for this row

            // Loop through the columns to calculate the maximum height for this row
            for (let col = 0; col < numCols; col++) {
                var text = textArray[textInde++];
                // Set font properties for text measurement
                ctx.font = 'Bold 25px Poppins-bold'; // Change the font size and family as needed

                var lines = this.splitTextIntoLines(ctx, text, rectWidth - 70)

                const rectHeight = 28 * (lines.length + 0.5) + 10;

                if (rectHeight > maxRectHeightInRow) {
                    maxRectHeightInRow = rectHeight; // Update the maximum rectangle height for this row
                }
            }
            if (row == 0) cumulativeHeight += maxRectHeightInRow
            for (let col = 0; col < numCols; col++) {

                const x = col * (rectWidth + (gapX / 2));
                if (numCols == 1) var y = (totalHeight + (gapY / 2));
                else var y = row * (cumulativeHeight + (gapY / 2));
                const text = textArray[textIndex++];
                ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
                this.roundRect(ctx, x, y, rectWidth - (gapX), maxRectHeightInRow - (gapY), 20, true);
                ctx.font = 'bold 30pt Poppins-bold'
                ctx.fillStyle = "white"
                ctx.textBaseline = "middle";
                ctx.fillText(String.fromCharCode(64 + textIndex), x, y + 15);

                ctx.font = 'Bold 20px Poppins-bold'; // Change the font size and family as needed

                const textX = x + 35;
                const textY = ((y * 2 + maxRectHeightInRow) / 2) - 6; // Adjust the vertical position as needed

                var lines = this.splitTextIntoLines(ctx, text, rectWidth - 70)
                for (let j = 0; j < lines.length; j++) {
                    const lineY = textY + 28 * (j - lines.length / 2 + 0.5);
                    ctx.fillText(lines[j], textX, lineY, rectWidth);
                }
                if (col == 0) totalHeight += maxRectHeightInRow
                // Break the loop if all texts have been placed
                if (textIndex >= numOptions) {
                    break;
                }

            }

            // Break the loop if all texts have been placed
            if (textIndex >= numOptions) {
                break;
            }
        }

        return { canvas: canvas, height: totalHeight };
    }
    async drawMultiColoredBar(width, height, segments, titles, isHorizontal, cornerRadius = 15) {
        if (segments.length !== titles.length) {
            throw new Error('Segments and titles arrays must have the same length.');
        }
        const totalPercentage = segments.reduce((total, segment) => total + segment, 0);
        const minimumSegmentValue = .1 * segments.length; // Minimum value to represent 25%
        const adjustedSegments = segments.map(segment => (segment === 0 ? minimumSegmentValue : segment));
        const adjustedTotalPercentage = adjustedSegments.reduce((total, segment) => total + segment, 0);
        const segmentWidth = width / adjustedTotalPercentage;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        let currentPos = isHorizontal ? 0 : height;

        for (let i = 0; i < adjustedSegments.length; i++) {
            let segmentValue = adjustedSegments[i];
            let segmentLength = segmentWidth * segmentValue;
            if (segmentValue === 0) {
                continue; // Skip rendering for segments with 0% value
            }

            let segmentX, segmentY, segmentDimension;

            if (isHorizontal) {
                segmentX = currentPos;
                segmentY = 0;
                segmentDimension = height;
                currentPos += segmentLength;
            } else {
                segmentX = 0;
                segmentY = currentPos - segmentLength;
                segmentDimension = segmentLength;
                currentPos -= segmentLength;
            }

            // Use shades of red for the color
            const redShade = Math.floor(255 * (i / adjustedSegments.length));
            ctx.fillStyle = `rgba(${255 - redShade}, 0, 0, 1)`;
            let color = this.getRandomColor(); // Replace this with your own logic to determine segment color
            ctx.fillStyle = color;
            // Draw the rounded rectangle
            ctx.beginPath();

            if (i === 0) {
                // First segment, round top-left and bottom-left corners
                ctx.moveTo(segmentX + cornerRadius, segmentY);
                ctx.lineTo(segmentX + segmentLength, segmentY);
                ctx.lineTo(segmentX + segmentLength, segmentY + segmentDimension);
                ctx.lineTo(segmentX + cornerRadius, segmentY + segmentDimension);
                ctx.arcTo(segmentX, segmentY + segmentDimension, segmentX, segmentY, cornerRadius);
                ctx.lineTo(segmentX, segmentY + cornerRadius);
                ctx.arcTo(segmentX, segmentY, segmentX + cornerRadius, segmentY, cornerRadius);
            } else if (i === adjustedSegments.length - 1) {
                // Last segment, round top-right and bottom-right corners
                ctx.moveTo(segmentX, segmentY);
                ctx.lineTo(segmentX + segmentLength - cornerRadius, segmentY);
                ctx.arcTo(segmentX + segmentLength, segmentY, segmentX + segmentLength, segmentY + cornerRadius, cornerRadius);
                ctx.lineTo(segmentX + segmentLength, segmentY + segmentDimension - cornerRadius);
                ctx.arcTo(segmentX + segmentLength, segmentY + segmentDimension, segmentX + segmentLength - cornerRadius, segmentY + segmentDimension, cornerRadius);
                ctx.lineTo(segmentX, segmentY + segmentDimension);
            } else {
                // Middle segments, no rounded corners
                ctx.fillRect(segmentX, segmentY, segmentLength, segmentDimension);
            }

            ctx.closePath();
            ctx.fill();

            let textX = segmentX + segmentLength / 2;
            let textY = segmentY + segmentDimension / 2;

            // Set a proportional font size for titles
            let fontSize = height / 3; // Adjust the font size as desired
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'white';
            ctx.font = fontSize + 'px Poppins-bold'; // Set the font size
            if (titles[i].length >= 5) ctx.fillText(String.fromCharCode(65 + i), textX, textY); // Use letters A, B, C, ...
            else ctx.fillText(titles[i], textX, textY);
            ctx.font = fontSize / 2 + 'px Poppins-bold'; // Set the font size
            if (segmentValue >= 1 && fontSize > 7) {
                let percentageText = (segments[i] / totalPercentage * 100).toFixed(0) + '%';
                if (percentageText == "Infinity%") ctx.fillText("-", textX, height - 15);
                else ctx.fillText(percentageText, textX, height - 15);
            }
        }

        return canvas;
    }
    getRandomColor() {
        // Define the gradient start and end colors
        const gradientStart = [32, 1, 34]; // RGB values for #200122
        const gradientEnd = [111, 0, 0];  // RGB values for #6f0000

        // Generate random values between 0 and 1 for each color channel
        const r = Math.random();
        const g = Math.random();
        const b = Math.random();

        // Interpolate the color values within the gradient range
        const color = [
            Math.floor(gradientStart[0] + r * (gradientEnd[0] - gradientStart[0])),
            Math.floor(gradientStart[1] + g * (gradientEnd[1] - gradientStart[1])),
            Math.floor(gradientStart[2] + b * (gradientEnd[2] - gradientStart[2]))
        ];

        // Convert RGB values to a hexadecimal color code
        const colorHex = `#${color.map(channel => {
            const hex = channel.toString(16);
            return hex.length === 1 ? `0${hex}` : hex;
        }).join('')}`;

        return colorHex;
    }
    flipImage(image, flipHorizontal = false, flipVertical = false) {
        // Create a new canvas and context to draw the flipped image
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');

        // Set the canvas dimensions to match the image size
        canvas.width = image.width;
        canvas.height = image.height;

        // Flip the image and draw it on the new canvas
        ctx.save();

        if (flipHorizontal) {
            ctx.scale(-1, 1); // Scale by -1 along the x-axis (horizontal flip)
        }

        if (flipVertical) {
            ctx.scale(1, -1); // Scale by -1 along the y-axis (vertical flip)
        }

        ctx.drawImage(
            image,
            flipHorizontal ? -image.width : 0,
            flipVertical ? -image.height : 0,
            image.width,
            image.height
        );

        ctx.restore();

        // Create a new image element with the flipped canvas as the source
        const flippedImage = new Image();
        flippedImage.src = canvas.toDataURL(); // Convert the canvas to data URL

        return flippedImage;
    }
    async producerTag(height, side) {
        var tag = "POWERED BY RYGLUS"
        const canvas = createCanvas(height / 2, height);
        const context = canvas.getContext('2d');

        context.font = 'bold ' + height / 3 + 'pt Poppins'

        var calcWidth = context.measureText(tag).width + height + 10
        canvas.width = calcWidth
        context.font = 'bold ' + height / 3 + 'pt Poppins'
        context.fillStyle = 'white'
        context.textBaseline = 'middle'
        if (side) {
            await this.headShot(context, "292647346318082048", canvas.width - height + 4, 4, height / 2 - 4)
            context.textAlign = 'right'
            context.fillText(tag, canvas.width - height - 4, canvas.height / 2);
        }
        else {
            await this.headShot(context, "292647346318082048", 4, 4, height / 2 - 4)
            context.textAlign = 'left'
            context.fillText(tag, height + 5, canvas.height / 2);
        }
        return canvas;
    }
    async resizeBase64(base64, width, height) {
        try {
            base64 = base64.split(';base64,').pop();
            const imageBuffer = Buffer.from(base64, 'base64');

            const resizedBuffer = await sharp(imageBuffer)
                .resize(width, height, { fit: 'inside', withoutEnlargement: false, interpolator: 'nearest', kernel: 'nearest' })
                .toBuffer();

            // Convert the resized buffer back to base64 and prepend the data URI prefix
            const resizedBase64 = 'data:image/png;base64,' + resizedBuffer.toString('base64');

            return resizedBase64;
        } catch (error) {
            console.error(error);
            throw error; // You can handle the error as needed
        }
    }
    async getIconImage(iconPath, colour, width, height) {
        const canvas = createCanvas(width, height);
        const context = canvas.getContext('2d');

        await sharp(resources + "/icons/" + iconPath)
            .resize(width, height)
            .toBuffer()
            .then(async data => {
                context.drawImage(await loadImage(data), 0, 0)
                context.globalCompositeOperation = "source-in";

                // draw color
                context.fillStyle = colour;
                context.fillRect(0, 0, canvas.width, canvas.height);
            })
            .catch(err => { });


        return canvas;
    }
    filterVignette = function (canvas, alpha) {

        var context = canvas.getContext("2d");

        var w = canvas.width;
        var h = canvas.height;

        context.rect(0, 0, w, h);

        var outerRadius = w * .5;
        var innerRadius = w * .2;
        var grd = context.createRadialGradient(w / 2, h / 2, innerRadius, w / 2, h / 2, outerRadius);
        grd.addColorStop(0, 'rgba(0,0,0,0)');
        grd.addColorStop(1, 'rgba(0,0,0,' + alpha + ')');

        context.fillStyle = grd;
        context.fill();

    };
}

module.exports = new CustomGraphics();