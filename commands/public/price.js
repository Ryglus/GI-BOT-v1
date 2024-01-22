const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const ge = require(modules.GrandExchange)
const util = require(modules.Util)
const net = require(modules.Networking)
const bucket = require(modules.Bucket)
module.exports = {
    data: new SlashCommandBuilder()
        .setName('price')
        .setDescription('Displays item information')
        .addStringOption(option =>
            option.setName('item').setRequired(true)
                .setDescription('Item name or id you wanna check')),
    async execute(interaction) {
        let usagetag = "price"
        let usage = bucket.getData("commandUsage")
        if (!usage.hasOwnProperty(usagetag)) usage[usagetag] = Number(0);
        usage[usagetag] += Number(1);
        bucket.setData(usage,"commandUsage")
        try {
            const itemEmbed = new EmbedBuilder()
            let me = interaction.client.users.cache.find(user => user.id == "292647346318082048")
            itemEmbed.setFooter({ text: 'Powered by Ryglus', iconURL: me.displayAvatarURL() });


            const searchedItem = interaction.options.get("item").value
            const itemInfo = await ge.getItemFullInfo(searchedItem)
            itemEmbed.setTitle(itemInfo.name)
            itemEmbed.setURL("https://prices.runescape.wiki/osrs/item/" + itemInfo.id)
            itemEmbed.setThumbnail('https://oldschool.runescape.wiki/images/' + net.hypertextify(itemInfo.icon));
            var info = {
                "Info": ["members", "limit", "value"], "GE": ["high", "low"]
            }
            Object.keys(info).forEach(i => {
                var text = "";
                info[i].forEach(v => {
                    text += "**" + util.capitalizeFirstLetter(v) + "**: " + util.abbreviateNumber(itemInfo[v]) + "\n"
                })

                itemEmbed.addFields({ name: i, value: text, inline: true })
            })
            interaction.reply({ embeds: [itemEmbed], ephemeral: true });
        } catch (error) { interaction.reply("Error ocured: " + error) };

    },
};