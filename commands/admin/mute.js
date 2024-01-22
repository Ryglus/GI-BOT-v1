const { ContextMenuCommandBuilder, ApplicationCommandType, PermissionFlagsBits } = require('discord.js');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("MUTE")
        .setType(ApplicationCommandType.Message && ApplicationCommandType.User)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const { username } = interaction.targetUser;
        // Create the modal
        const modal = new ModalBuilder()
            .setCustomId('myModal')
            .setTitle('You are about to mute: ' + username);

        // Create the text input components
        const favoriteColorInput = new TextInputBuilder()
            .setCustomId('favoriteColorInput')
            // The label is the prompt the user sees for this input
            .setLabel("State your reason")
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short);
        const hobbiesInput = new TextInputBuilder()
            .setCustomId('hobbiesInput')
            .setLabel("Evidence (if you have images, provide links)")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph);
        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
        const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);
        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow);
        // Show the modal to the user
        await interaction.showModal(modal);
    }
}