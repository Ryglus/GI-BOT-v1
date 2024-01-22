const { SlashCommandBuilder,PermissionFlagsBits } = require('discord.js');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Test for modal view')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {
		interaction.reply({ content: "rara", ephemeral: true })

	},
};