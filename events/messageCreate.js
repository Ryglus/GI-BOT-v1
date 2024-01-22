const { Events } = require('discord.js');
const messageBucket = require(modules.Bucket);
const event = require(modules.Events)

module.exports = {
	name: Events.MessageCreate,
	async execute(interaction) {
        if (interaction.type != 0) return; // 0 = plain message
		await event.Event(interaction)
		try {
            //console.log(await messageBucket.GetData());
		} catch (error) {
			console.error(error);
		}
	},
};
