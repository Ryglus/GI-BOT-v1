const { Events } = require('discord.js');
const messageBucket = require(modules.Bucket);
const event = require(modules.Events)

module.exports = {
        name: Events.InteractionCreate,
        async execute(interaction) {
                if (!interaction.isModalSubmit()) return;
		await event.Event(interaction)
        },
};
