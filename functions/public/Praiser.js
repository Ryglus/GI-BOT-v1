const { createCanvas, loadImage } = require('canvas');
const { AttachmentBuilder } = require('discord.js');
var gifFrames = require('gif-frames');
const events = require(modules.Events)
const bucket = require(modules.Bucket)
const graphic = require(modules.CustomGraphics);
const GIFEncoder = require('gif-encoder-2')

class Praiser {
    constructor() {}
    async getWelcomeImage(id) {
        const canvas = createCanvas(683, 384)
        const ctx = canvas.getContext('2d')
    
        var bannerURL = await graphic.getUserBanner(id)
        if (bannerURL) {
            var encoder = new GIFEncoder(600, 300)
            encoder.start()
            let bannerGif = await gifFrames({ url: bannerURL, frames: 'all' })
            var totalIcon = await loadImage(resources + "/images/skills/Overall_icon.png")
            encoder.setDelay(5)
            encoder.setRepeat(0)
    
            for (let i = 0; i < bannerGif.length; i++) {
                console.log(i)
                ctx.save();
                ctx.fillStyle = graphic.prefColors(0, 0, canvas.width, canvas.height)
                ctx.strokeStyle = graphic.prefColors(0, 0, canvas.width, canvas.height)
                graphic.roundRect(ctx, 0, 0, canvas.width, canvas.height, 0, true, false)
    
                var bannerFrame = await loadImage(bannerGif[i].getImage()._obj);
                var scale = graphic.getImageScaling(bannerFrame, 500, 120, 70, 5, 0)
                graphic.roundImage(ctx, bannerFrame, scale.sx, scale.sy, scale.ex, scale.ey, 20)
    
                ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
    
                graphic.roundRect(ctx, 10, 70, canvas.width - 20, 120, 20, true, false)
                ctx.font = 'bold 20pt Poppins-bold'
                ctx.textAlign = 'left'
                ctx.textBaseline = 'middle'
                ctx.fillStyle = 'white'
                //ctx.fillText("Welcome", 10, 53);
    
    
                await graphic.headShot(ctx, id, 20, 80, 50, 3)
    
    
    
                ctx.font = 'bold 40pt Poppins-bold'
                ctx.fillStyle = 'white'
                ctx.fillText("M3rchM3now", 130, 127);
    
                var rsns = await bucket.getData("people")[id].RSN, avaibleSpace = ((canvas.width - 40) - (20 * rsns.length)) / rsns.length, whattodisplay = ["Total level: 2083", "Most killcount: 1183"];
    
                for (let r = 0; r < rsns.length; r++) {
                    ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
                    graphic.roundRect(ctx, 10 + (r * 10) + (r * avaibleSpace), 200, avaibleSpace, 90, 20, true, false)
                    ctx.font = 'bold 18pt Poppins'
                    ctx.fillStyle = 'white'
                    ctx.textAlign = 'center'
                    ctx.fillText(rsns[r], 10 + (r * 10) + (r * avaibleSpace) + (avaibleSpace / 2), 215);
                    for (let s = 0; s < 2; s++) {
                        ctx.font = 'bold 15pt Poppins'
                        ctx.textAlign = 'left'
                        ctx.fillText(whattodisplay[s], 45 + (r * 10) + (r * avaibleSpace), 242 + (s * 26));
                        ctx.drawImage(totalIcon, 15 + (r * 10) + (r * avaibleSpace), 230 + (s * 26), 25, 25)
                    }
                }
    
    
                encoder.addFrame(ctx)
                ctx.restore();
    
            }
    
            encoder.finish();
            return new AttachmentBuilder(encoder.out.getData(), { name: 'Discover.gif', extension: 'image/gif' });
        } else {
            var totalIcon = await loadImage(resources + "/images/skills/Overall_icon.png")
    
            ctx.save();
            ctx.fillStyle = graphic.prefColors(0, 0, canvas.width, canvas.height)
            ctx.strokeStyle = graphic.prefColors(0, 0, canvas.width, canvas.height)
            graphic.roundRect(ctx, 0, 0, canvas.width, canvas.height, 0, true, false)
    
            graphic.roundRect(ctx, 500, 120, 70, 5, 20)
    
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
    
            graphic.roundRect(ctx, 10, 70, canvas.width - 20, 120, 20, true, false)
            ctx.font = 'bold 20pt Poppins-bold'
            ctx.textAlign = 'left'
            ctx.textBaseline = 'middle'
            ctx.fillStyle = 'white'
            //ctx.fillText("Welcome", 10, 53);
    
    
            await graphic.headShot(ctx, id, 20, 80, 50, 3)
    
    
    
            ctx.font = 'bold 40pt Poppins-bold'
            ctx.fillStyle = 'white'
            ctx.fillText("M3rchM3now", 130, 127);
    
            var rsns = await bucket.getData("people")[id].RSN, avaibleSpace = ((canvas.width - 40) - (20 * rsns.length)) / rsns.length, whattodisplay = ["Total level: 2083", "Most killcount: 1183"];
    
            for (let r = 0; r < rsns.length; r++) {
                ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
                graphic.roundRect(ctx, 10 + (r * 10) + (r * avaibleSpace), 200, avaibleSpace, 90, 20, true, false)
                ctx.font = 'bold 18pt Poppins'
                ctx.fillStyle = 'white'
                ctx.textAlign = 'center'
                ctx.fillText(rsns[r], 10 + (r * 10) + (r * avaibleSpace) + (avaibleSpace / 2), 215);
                for (let s = 0; s < 2; s++) {
                    ctx.font = 'bold 15pt Poppins'
                    ctx.textAlign = 'left'
                    ctx.fillText(whattodisplay[s], 45 + (r * 10) + (r * avaibleSpace), 242 + (s * 26));
                    ctx.drawImage(totalIcon, 15 + (r * 10) + (r * avaibleSpace), 230 + (s * 26), 25, 25)
                }
            }
            ctx.restore();
            const canvasN = createCanvas(600, 300)
            const ctxN = canvasN.getContext('2d')
    
            ctxN.drawImage(await loadImage(canvas.toBuffer()),0,0)
    
            return new AttachmentBuilder(canvasN.toBuffer(), { name: 'Discover.png', extension: 'image/png' });
        }
    
    }
    async findClosestAnniversary() {
        var members = await bucket.getData("clanExport")
        const today = new Date();
        let closestMember = null;
        let closestAnniversaryDate = null;

        for (const member of members) {
            const joinedDate = new Date(member.joinedDate);
            const nextAnniversaryYear = today.getFullYear();
            joinedDate.setFullYear(nextAnniversaryYear);

            if (today > joinedDate) {
                joinedDate.setFullYear(nextAnniversaryYear + 1);
            }

            const timeDifference = joinedDate - today;

            if (!closestAnniversaryDate || timeDifference < closestAnniversaryDate) {
                closestAnniversaryDate = timeDifference;
                closestMember = member;
            }
        }

        const daysUntilAnniversary = Math.ceil(closestAnniversaryDate / (1000 * 60 * 60 * 24));

        return {
            closestMember,
            daysUntilAnniversary,
        };
    }
}


module.exports = new Praiser();
