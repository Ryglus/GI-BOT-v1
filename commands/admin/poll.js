const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const Poll = require(modules.Poll);
const bucket = require(modules.Bucket)
module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Creates a poll in this channel with a particual question you wanna ask.')
        .addStringOption(option =>
            option.setName('question').setRequired(true)
                .setDescription('Write exacly what your question is, you will be presented with options for answers')),
    async execute(interaction) {
        let usagetag = "poll"
        let usage = bucket.getData("commandUsage")
        if (!usage.hasOwnProperty(usagetag)) usage[usagetag] = Number(0);
        usage[usagetag] += Number(1);
        bucket.setData(usage,"commandUsage")
        const modal = new ModalBuilder()
            .setCustomId('modal-poll-' + Poll.createPoll(interaction.options.get("question").value))
            .setTitle('Polled options');


        // Add components to modal
        var comp = [];
        for (let i = 0; i < 5; i++) {
            const option = new TextInputBuilder()
            option.setCustomId('option' + (i + 1))
            option.setStyle(TextInputStyle.Paragraph);
            if (i < 2) {
                option.setLabel("Option #" + (i + 1))
                option.setRequired(true)
            } else {
                option.setLabel("Option #" + (i + 1) + " - (Leave empty if not used)")
                option.setRequired(false)
            }
            comp[comp.length] = new ActionRowBuilder().addComponents(option);
        }

        modal.addComponents(comp);

        // Show the modal to the user
        await interaction.showModal(modal);
    },
};