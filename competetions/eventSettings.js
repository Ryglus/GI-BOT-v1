const { GuildScheduledEventManager, GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType } = require('discord.js');
const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { createCanvas, loadImage, Image } = require('canvas');
const fs = require('fs');


const graphic = require(modules.CustomGraphics);
const events = require(modules.Events)
const bucket = require(modules.Bucket)


let eventables = []


class eventSettings {
    constructor() {
        events.addEvent(this)
        this.loadDashboards();
    }
    getEvents() {
        return eventables;
    }
    async onEventUpdate(interaction) {
        if (interaction.author != config.clientId)
        switch (interaction.type) {
            case 3:
                switch (interaction.customId.split("-")[1]) {
                    case "delall":
                        const elementIdToDelete = interaction.customId.split("-")[0];
                        this.deleteChannelsInCategory(elementIdToDelete)
                        let event = bucket.getData("eventManifest");                 
                        for (const topLevelKey in event) {
                            if (event.hasOwnProperty(topLevelKey)) {
                              const topLevelObject = event[topLevelKey];
                              if (topLevelObject.hasOwnProperty(elementIdToDelete)) {
                                delete topLevelObject[elementIdToDelete];
                                bucket.setData(event,"eventManifest")
                                console.log(`Element with ID ${elementIdToDelete} deleted.`);
                              } else {
                                console.log(`Element with ID ${elementIdToDelete} not found.`);
                              }
                            }
                          }
                        break;
                    case "pg":
                        console.log(interaction.type)
                        break;
                    default:
                        break;
                }
                break;
            case 0:
                const elementIdToDelete = interaction.channel.id
                let event = bucket.getData("eventManifest");                 
                for (const topLevelKey in event) {
                    if (event.hasOwnProperty(topLevelKey)) {
                      const topLevelObject = event[topLevelKey];
                      if (topLevelObject.hasOwnProperty(elementIdToDelete)) {
                        //this.setupScheduledEvent(interaction,topLevelObject[elementIdToDelete], "Runecraft")
                      } else {
                        console.log(`Element with ID ${elementIdToDelete} not found.`);
                      }
                    }
                  }
                break;
            default:
                break;
        }
    }
    async loadDashboards() {
        let event = bucket.getData("eventManifest");
        for (let e in event) {
            Object.keys(event[e]).forEach(ch => {
                eventables.push({ "channelId": ch })
            })
        }
    }

    async createNew(interaction, what) {
        try {
            // Create a text channel in the current guild
            const category = await interaction.guild.channels.create({
                type: 4, // You can change this to 'GUILD_VOICE' for a voice channel, or 'GUILD_CATEGORY' for a category
                name: what + " Event",
            });
            await category.permissionOverwrites.create(category.guild.roles.everyone, { ViewChannel: false });
            const channel = await interaction.guild.channels.create({
                type: 0, // You can change this to 'GUILD_VOICE' for a voice channel, or 'GUILD_CATEGORY' for a category
                parent: category.id,
                name: 'Dashboard',
                permissionOverwrites: category.permissionOverwrites.cache.map(o => ({
                    id: o.id,
                    type: o.type,
                    allow: o.allow.toArray(),
                    deny: o.deny.toArray(),
                })),
            });
            eventables.push({ "channelId": channel.id })
            //var channel = {id:"943214755387146310"}
            interaction.reply({ content: "Please follow in your continiation in <#" + channel.id + ">", ephemeral: true })

            let event = bucket.getData("eventManifest");
            if (!event.hasOwnProperty(interaction.member.user.id)) event[interaction.member.user.id] = { [channel.id]: { type: what, progress: 0, info: {} } };
            else event[interaction.member.user.id][channel.id] = { type: what, progress: 0, info: {} };
            bucket.setData(event, "eventManifest");


            const choice = require(modules[what])
            choice.setup(channel);










            const embed = new EmbedBuilder()
                .setTitle('Event creation tool')
                .setDescription('This thing works like a questionaire, you just answer my questions and at the end confirm if you are happy with the settings. \n you can cancel this setup at any time by pressing the button in this message.')
                .setColor(graphic.prefEmbedColor()); // You can change the color to your preference


            const button = new ButtonBuilder()
                .setCustomId(channel.id + "-delall")
                .setLabel('DELETE ALL')
                .setStyle(ButtonStyle.Danger);

            const actionRows = new ActionRowBuilder().addComponents(button);
            // Send the message with the embed and buttons
            channel.send({ embeds: [embed], components: [actionRows] }).then(e => {
                //evenables.push({ "type": 3,"channelId": e.id })
            });

        } catch (error) {
            console.error('Error creating channel:', error);
            interaction.reply({ content: 'Error creating channel: ' + error, ephemeral: true })
        }
    }
    async inputMultiselect(array) {
        const embed = new EmbedBuilder()
            .setTitle('Close Channel')
            .setDescription('u sur?')
            .setColor('#0099ff'); // You can change the color to your preference

        const button = new ButtonBuilder()
            .setCustomId('acceptButton')
            .setLabel('Accept')
            .setStyle(ButtonStyle.Success);
        const button2 = new ButtonBuilder()
            .setCustomId('denyButton')
            .setLabel('Accept')
            .setStyle(ButtonStyle.Danger);

        const actionRows = new ActionRowBuilder().addComponents(button);
        // Send the message with the embed and buttons
        channel.send({ embeds: [embed], components: [actionRows] }).then(e => {
            //evenables.push({ "type": 3,"channelId": e.id })
        });
    }
    async setupScheduledEvent(interaction, loc,what) {
        const guild = client.guilds.cache.get(config.mainGuild);
        if (!guild) return console.log('Guild not found');
        
        const choice = require(modules[loc.type])
        const event_manager = new GuildScheduledEventManager(guild);
        await event_manager.create({
            name: 'Skill Competetion: Runecraft',
            
            scheduledStartTime: new Date(1701468000000),
            scheduledEndTime: new Date(1702072800000),
            privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
            entityType: GuildScheduledEventEntityType.External,
            //entityMetadata: { location: "<#" + "1177604696735748097" + ">" },
            entityMetadata: { location: "Gielinor" },
            description: 'There will be 2 categories, category 1, levels 1-74, category 2, 75-99. Prizes will be awarded as usual, 1.5m winner of each category, runners up 750k and third place 250k.',
            image: await choice.createInviteGraphic("MissionShag","457886178440511501", "Runecraft"),
            reason: 'Testing with creating a Scheduled Event',
        })
    }
    async deleteChannelsInCategory(id) {
        // Find the category
        const chan = client.channels.cache.find(channel => channel.id === id);

        const chans = client.channels.cache.filter(parent => parent.parentId === chan.parent.id);
        const category = client.channels.cache.find(channel => channel.id === chan.parent.id);
       
        if (!category) {
            console.log("Category 'BINGO' not found.");
            return;
        }
        
        chans.forEach(async channel => {
            try {
                await channel.delete();
                console.log(`Deleted channel '${channel.name}' (${channel.id})`);
            } catch (error) {
                console.error(`Failed to delete channel '${channel.name}' (${channel.id}): ${error}`);
            }
        });
        category.delete()
    }
}
module.exports = new eventSettings();