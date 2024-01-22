const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');


const enventsettings = require(modules.eventSettings)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event')
        .setDescription('Command to create an event hosted by our bot, it will take you thru whole settup')
        .addStringOption(option => option
            .setName('type')
            .setDescription('Type of competetion you wanna hold')
            .setRequired(true).addChoices(
                { name: 'Skill', value: 'Skill' },
                { name: 'Bingo', value: 'Skill' },
            )),
    async execute(interaction) {

        const questionValue = interaction.options._hoistedOptions.find(option => option.name === 'type')?.value;

        try {
            enventsettings.createNew(interaction,questionValue)
        } catch (error) {
            console.error('Error creating channel:', error);
            interaction.reply({ content: 'Error creating channel: '+error, ephemeral: true })
        }
    },
};