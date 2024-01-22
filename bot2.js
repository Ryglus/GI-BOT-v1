global.config = require("./config.json")
const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');
global.client = new Client({
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences], partials: [
			Partials.User,
			Partials.Channel,
			Partials.GuildMember,
			Partials.Message,
			Partials.Reaction,
			Partials.GuildScheduledEvent,
			Partials.ThreadMember,]
});
global.modules = {};

const fs = require('fs'), path = require('path');

client.commands = new Collection();

// Function to load commands from directories (including subdirectories)
const loadCommands = (dir) => {
	const files = fs.readdirSync(dir, { withFileTypes: true });

	for (const file of files) {
		if (file.isDirectory()) {
			loadCommands(path.join(dir, file.name));
		} else if (file.name.endsWith('.js')) {
			const command = require(path.join(dir, file.name));
			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
			} else {
				console.log(`[WARNING] The command at ${path.join(dir, file.name)} is missing a required "data" or "execute" property.`);
			}
		}
	}
};

// Function to load events from directories (including subdirectories)
const loadEvents = (dir) => {
	const files = fs.readdirSync(dir, { withFileTypes: true });

	for (const file of files) {
		if (file.isDirectory()) {
			loadEvents(path.join(dir, file.name));
		} else if (file.name.endsWith('.js')) {
			const event = require(path.join(dir, file.name));
			if (event.once) {
				client.once(event.name, (...args) => event.execute(...args));
			} else {
				client.on(event.name, (...args) => event.execute(...args));
			}
		}
	}
};

// Function to load fonts from directories (including subdirectories)
const loadFonts = (dir) => {
	const files = fs.readdirSync(dir, { withFileTypes: true });
	const { registerFont } = require('canvas');
	for (const file of files) {
		if (file.isDirectory()) {
			loadFonts(path.join(dir, file.name));
		} else if (file.name.endsWith('.ttf')) {
			registerFont(path.join(dir, file.name), { family: file.name.replace('.ttf', '') })
		}
	}
};

// Function to load modules from directories (including subdirectories)
const loadModules = (dir) => {
	const files = fs.readdirSync(dir, { withFileTypes: true });

	for (const file of files) {
		if (file.isDirectory()) {
			loadModules(path.join(dir, file.name));
		} else if (file.name.endsWith('.js')) {
			modules[file.name.replace(".js", "")] = path.join(dir, file.name);
		}
	}
};
global.resources = path.join(__dirname, 'src/resources/');
const commandsDir = path.join(__dirname, 'commands');
const eventsDir = path.join(__dirname, 'events');
const fontsDir = path.join(__dirname, 'src/resources/fonts');
const modulesDir = path.join(__dirname, 'src');


client.login(config.token);

loadModules(modulesDir)
loadCommands(commandsDir);
loadEvents(eventsDir);
loadFonts(fontsDir);





module.exports.client = client;

