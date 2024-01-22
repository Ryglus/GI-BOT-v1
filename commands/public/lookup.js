const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const osrs = require('osrs-json-api');
const Net = require(modules.Networking)
const bucket = require(modules.Bucket)
module.exports = {
    data: new SlashCommandBuilder()
        .setName('lookup')
        .setDescription('Displays osrs stats of a person')
        .addStringOption(option =>
            option.setName('name').setRequired(true)
                .setDescription('Osrs rsn')),
    async execute(interaction) {
        let usagetag = "lookup"
        let usage = bucket.getData("commandUsage")
        if (!usage.hasOwnProperty(usagetag)) usage[usagetag] = Number(0);
        usage[usagetag] += Number(1);
        bucket.setData(usage,"commandUsage")
        var tot = 0, filds = 0;
        var person = interaction.options.get("name").value
        await osrs.hiscores.getPlayer(person).then(async res => {
            const lookup = new EmbedBuilder()
            let me = interaction.client.users.cache.find(user => user.id == "292647346318082048")
            lookup.setFooter({ text: 'Powered by Ryglus', iconURL: me.displayAvatarURL() });
            //lookup.setColor("#3498DB");
            lookup.setTitle(person)
            for (var section in res) {
                var sectiondump = "```";
                if (res[section].hasOwnProperty("score")) {
                    if (res[section].score != -1 && res[section].rank != -1) {
                        sectiondump += "score: " + res[section].score + "\n";
                        sectiondump += "rank: " + res[section].rank + "\n";
                    }
                } /*else if (section=="skills") {
          keys.forEach(key => {
            
            if (keys.indexOf(key)%3==0) {
              sectiondump += "\n"
            }
            if (res[section][key].level >= -1) {
              sectiondump += (key + ": " + res[section][key].level).padEnd(17);
            }
          });
          
        } */ else {
                    for (var info in res[section]) {
                        if (section == "bosses" && res[section][info].score != -1) {
                            tot += parseInt(res[section][info].score);
                        }
                        if (res[section][info].hasOwnProperty("score")) {
                            if (res[section][info].score != -1) {
                                sectiondump += info + ": " + res[section][info].score + "\n";
                            }
                        } else if (res[section][info].hasOwnProperty("level")) {
                            if (res[section][info].level >= -1) {
                                sectiondump += info + ": " + res[section][info].level + "\n";
                            }
                        }
                    }
                }
                if (sectiondump != "```") {
                    /*
                    if (section == "bosses") {
                      sectiondump += "**Total: " + tot + "**"
                    }
                    */

                    if (filds <= 1) lookup.addFields({ name: section, value: sectiondump + "```", inline: false });
                    else lookup.addFields({ name: section, value: sectiondump + "```", inline: true });
                    filds++;
                }
            }
            var rw;
            var oversteps = "";
            try {
                rw = await Net.signedRequest("https://runewatch.com/api/v2/rsn/" + person)
                rw = JSON.parse(rw)[0]
            } catch (error) {

            }
            if (rw) {
                oversteps += "```🔴 Runewatch: " + rw.type;
            } else {
                oversteps += "```🟢 Runewatch";
            }
            try {
                var wdr = JSON.parse(await Net.signedRequest("https://wdrdev.github.io/banlistrw.json"));
                var report;
                wdr.forEach(accused => {
                    if (accused['accused_rsn'] == person) {
                        report = accused;
                    }
                });
                if (report) {
                    oversteps += "\n🔴 WDR: " + report.reason + "```";
                } else {
                    oversteps += "\n🟢 WDR```"
                }
            } catch (error) {

            }
            lookup.addFields({ name: "Reports", value: oversteps, inline: false });
            interaction.reply({ embeds: [lookup], ephemeral: true });

        }).catch(error => { interaction.reply("Error ocured: " + error) });

    },
};