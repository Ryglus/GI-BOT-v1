const { Events } = require('discord.js');
const event = require(modules.Events)

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.type != 3) return;
		await event.Event(interaction)
	},
};
