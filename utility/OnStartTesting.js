const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { registerFont, createCanvas, loadImage, Image } = require('canvas');
const fs = require('fs'), path = require('path');
const osrs = require('osrs-json-api');
const graphic = require(modules.CustomGraphics);
const guides = require(modules.Guides);
const events = require(modules.Events)
const bucket = require(modules.Bucket)
const wlt = require(modules.Wallet)
const gamble = require(modules.Gamble)
const ci = require(modules.CheckIn)
const pyrsn = require(modules.PostYourRSN)
const vc = require(modules.VoiceChannels);
const MeleeDpsCalculator = require(modules.MeleeDpsCalculator);
const MageDpsCalculator = require(modules.MageDpsCalculator);
const RangedDpsCalculator = require(modules.RangedDpsCalculator);
class test {
    constructor() {
        const bingo = require(modules.Leagues);
    }
    async Test() {

        
        const sc = require(modules.Skill);
        const ge = require(modules.GrandExchange);
        //const users = require(modules.Users);
        const praiser = require(modules.Praiser);

        var to = await client.channels.cache.find(channel => channel.id === '1151566265140392008')
        //to.send({files:[await praiser.getWelcomeImage("292647346318082048")]})
        var that = await to.messages.fetch('1151568052173938758');
        //this.chatTesting()
    }
    random() {
        /*       
        var bct = bucket.getData("donations")
        bct['292647346318082048']={amount: 80000000, anonymous:false}
        //bucket.setData(bct,"donations")
        //console.log(await events.Event("i like coks"));
        var vorakth = guides.loadGuide("Vorkath");
        this.guideHeader(that);
        */
    }
    chatTesting() {
        const chat = require(modules.Chat);
        var messages = ["thRoadto99HP has completed the Easy Varrock diary.",
            "KingFishblob received a new collection log item: Robe bottom of darkness (533/1477)",
            "Y-Pr3datorrr received a drop: 7 x Dragon plateskirt (1,126,713 coins).",
            "Helldembez has reached Herblore level 85.",
            "Ze R Word has achieved a new Theatre of Blood: Hard mode (Team Size: 3) personal best: 21:13",
            "Y-Pr3datorrr has completed a quest: Desert Treasure II - The Fallen Empire",
            "HoneHectic has reached a total level of 1725.",
            "Potamski has been defeated by Amoy in The Wilderness and lost (785,081 coins) worth of loot....and now everyone knows.",
            "Ze R Word has reached 60,000,000 XP in Ranged.",
            "Ryglus: ImJ o n received special loot from a raid: Avernic defender hilt.",
            "ImJ o n received special loot from a raid: Avernic defender hilt.",
            "WhoTheFk received a drop: 82 x Grimy snapdragon (537,428 coins) from Venenatis.",
            "James H Iron has a funny feeling like he's being followed: Pet kraken at 1,700 killcount.",
            ":Ironman_chat_badge: iron of bars: Im back for the d pick hunt",
            "PleasureFlo received a drop: 87 x Onyx bolt tips (719,316 coins) from Venenatis.",
            "PleasureFlo received a drop: Abyssal whip (1,783,189 coins).",
            "Ryglu: :D im still a student :D",
            "Ryglu received a drop: Dharok's helm (900,780 coins)",
            "Ryglu received a drop: Dharok's platebody (900,780 coins)",
            "Ryglu received a drop: Dharok's platelegs (900,780 coins)",
            "Ryglu received a drop: Dharok's greataxe (900,780 coins)",
            "Doooooles: Some good drops today",
            "Hey J received a drop: Kraken tentacle (442,537 coins).",
            "ChaDoddd has a funny feeling like he would have been followed: Tumeken's guardian at 277 completions.",
            "redhook crit has a funny feeling like she's being followed: Beaver at 7,936,392 XP.",
            "Rzj has a funny feeling like he's being followed: Tumeken's guardian at 281 completions.",
            "cmen on face has a funny feeling like she's being followed: Pet zilyana at 547 killcount.",
            "NUT_TY has a funny feeling like he would have been followed: Nexling.",
            "WTF 50 ATT has a funny feeling like he would have been followed: Phoenix at 12,506,926 XP.",
            "W ez has defeated long daddy t and received (737,126 coins) worth of loot!",
            "W ez has been defeated by Nimerr in The Wilderness and lost (1,518,774 coins) worth of loot.",
            "Veti on has been defeated by Fortnite Dj and lost (10,000 coins) worth of loot.",
            "Hey B has left the clan.",
            "SirTeddy25 has been invited into the clan by Zhou Tail.",
            "M3rchm3now has expelled Leina Dragon from the clan.",
            "M3rchm3now has withdrawn 25,000,000 coins from the coffer.",
            "Ryglu has deposited 2,650,000 coins into the coffer."
        ]
        messages.forEach(m => {
            var asd = chat.parseAll(m);
            console.log(asd)
            if (asd.type == 'Unknown') {
                console.log(m)
            }
        })
    }
    dpsTesting() {
        // Example usage:
        const playerStats = {
            strengthLevel: 99,
            strengthBoost: 0,
            prayerBonus: 1.0,
            attackLevel: 99,
            attackBoost: 0,
            equipmentStrengthBonus: 120,
            equipmentAttackBonus: 128,
            voidGear: false,
            targetSpecificBonus: 1.0,
        };

        const monsterStats = {
            targetDefenceLevel: 62,
            targetStyleDefenceBonus: 0,
        };

        const attackStyle = "accurate";
        const attackSpeed = 2.4;

        const calculator = new MeleeDpsCalculator(playerStats, monsterStats, attackStyle);
        const dpss = calculator.calculateDPS(attackSpeed);
        console.log(`Melee DPS: ${dpss.toFixed(2)}`);

        const playerStatsm = {
            maxHit: 41,
            equipmentBonus: 179,
            magicLevel: 99,
            magicBoost: 0,
            prayerBonus: 1.0,
            usingVoidMagic: false,
            usingAccurateTrident: false,
            usingSalveAmulet: false, // Add this line
            onTask: false, // Add this line
        };

        const monsterStatsm = {
            npcMagicLevel: 210,
            npcMagicDefence: 160,
            isUndead: false,
        };

        const spellAttackSpeed = 2.4;

        const calculatorm = new MageDpsCalculator(playerStatsm, monsterStatsm, spellAttackSpeed);
        const dpsm = calculatorm.calculateDPS();
        console.log(`Mage DPS: ${dpsm.toFixed(2)}`);

        // Example usage:
        const playerStatsr = {
            rangedLevel: 99,
            boost: 0,
            prayerBonus: 1.0,
            equipmentRangedStrength: 99,
            equipmentRangedAttack: 215,
            voidModifier: 1.0,
            gearBonus: 1.0,
        };

        const monsterStatsr = {
            targetDefenceLevel: 100,
            targetRangedDefenceBonus: 0,
        };

        const attackStyler = "rapid";
        const isOnTaskr = false;
        const hasSalveAmuletr = false;
        const attackSpeedr = 3.6;

        const calculatorr = new RangedDpsCalculator(
            playerStatsr,
            monsterStatsr,
            attackStyler,
            isOnTaskr,
            hasSalveAmuletr
        );
        const dpsr = calculatorr.calculateDPS(attackSpeedr);
        console.log(`Ranged DPS: ${dpsr.toFixed(2)}`);
    }
    async guideHeader(that) {
        const canvas = createCanvas(1400, 620);
        const context = canvas.getContext('2d');
        context.fillStyle = graphic.prefColors(0, 0, canvas.width, canvas.height)

        //graphic.roundRect(context,0,0,1400,775,20,true)
        context.drawImage(await graphic.getHeader("guide to orange zulrah", 292647346318082048), 0, 200)

        const attachment = new AttachmentBuilder(canvas.toBuffer(), 'profile-image.png');
        //that.edit({ files: [attachment] })
    }
    
}
module.exports = new test();