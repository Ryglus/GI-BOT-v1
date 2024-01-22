const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deploy')
    .setDescription('Run deploy-commands.js')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  async execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      // Check if the user has administrator permissions (customize this permission check as needed)
      return interaction.reply({
        content: 'You do not have permission to run this command.',
        ephemeral: true, // Make the response only visible to the user who triggered the command
      });
    }

    try {
      // Execute the deploy-commands.js file using fs
      require('../../deploy-commands.js');
      console.log('deploy-commands.js has been executed.');

      interaction.reply('The deploy-commands.js file has been executed.');
    } catch (error) {
      console.error(error);
      interaction.reply('An error occurred while executing deploy-commands.js.');
    }
  },
};