const { createCanvas, loadImage, Image } = require('canvas');
const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, UserSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs');

const events = require(modules.Events)
const bucket = require(modules.Bucket)
const graphic = require(modules.CustomGraphics);

const imageObjects = [
    {
        pathToImage: 'shield-lock-fill.svg',
        title: 'PRIVACY',
        text: 'Sets the voice channel as private, making it hidden from everyone exept trusted users.',
        process: async function (interaction) {
            const userIsInVoiceChannel = !!interaction.member.voice.channel;
            if (userIsInVoiceChannel) {
                const voiceChannel = interaction.member.voice.channel;

                try {
                    const newChannelName = `🔒 | ${voiceChannel.name}`;
                    voiceChannel.setName(newChannelName);

                    interaction.reply({ content: 'You have locked/unlocked your voice channel', ephemeral: true })
                } catch (error) {
                    console.error(`Error renaming the channel: ${error.message}`);
                    interaction.reply({ content: 'An error occurred while renaming the channel.', ephemeral: true });
                }

            } else {
                interaction.reply({ content: 'You are not inside your voice channel', ephemeral: true })
            }
        },
        onEvent: function (interaction) {
            interaction.reply({ content: "asd", ephemeral: true })
        }
    },
    {
        pathToImage: 'pencil-square.svg',
        title: 'RENAME',
        text: 'Renames the voice channel with the name you choose.',
        process: function (interaction) {
            const modal = new ModalBuilder()
                .setCustomId('vcsettings-modal-rename')
                .setTitle('RENAME');

            const option = new TextInputBuilder()
            option.setCustomId('vcsettings-modal-' + this.title)
            option.setStyle(TextInputStyle.Short);
            option.setLabel("Enter your voice channel name:")

            modal.addComponents(new ActionRowBuilder().addComponents(option));

            // Show the modal to the user
            interaction.showModal(modal);
        },
        onEvent: async function (interaction) {
            const userIsInVoiceChannel = !!interaction.member.voice.channel;
            let vcname = interaction.fields.fields.first().value
            /*
            let banned= ["🔒"]
            if (vcname.includes(banned)) {
                console.log("REEE")
            } */
            if (userIsInVoiceChannel) {
                const voiceChannel = interaction.member.voice.channel;
                voiceChannel.setName(vcname);
            }
            let vcs = bucket.getData("voiceChannels")
            let uuid = interaction.user.id;
            if (!vcs.hasOwnProperty(uuid)) vcs[uuid] = {settings:{}}
            vcs[uuid].vcname = interaction.fields.fields.first().value
            bucket.setData(vcs, "voiceChannels")
            interaction.reply({ content: 'Attepted to change your VoiceChannel name, if the name haven\'t changed it means you hit a rename limit. In that case your vc name is saved for next VoiceChannel you make', ephemeral: true })

        }
    },
    {
        pathToImage: 'music-note-list.svg',
        title: 'SOUNDBOARD',
        text: 'Disables/enables use of soundboard in your voice channel.',
        process: function (interaction) {
            let vcs = bucket.getData("voiceChannels")
            let uuid = interaction.user.id;
            if (!vcs.hasOwnProperty(uuid)) vcs[uuid] = {settings:{}}
            vcs[uuid].settings['UseSoundboard'] = !vcs[uuid].settings['UseSoundboard'];
            bucket.setData(vcs, "voiceChannels")
            interaction.reply({ content: "The sounboard is in your channel enabled: " + vcs[uuid].settings['UseSoundboard'], ephemeral: true })
        },
        onEvent: function (interaction) {
            interaction.reply({ content: "asd", ephemeral: true })
        }
    },
    {
        pathToImage: 'person-fill-slash.svg',
        title: 'BLOCK',
        text: 'Blocks a person from seeing and joining your voice channel.',
        process: function (interaction) {
            const userSelect = new UserSelectMenuBuilder()
                .setCustomId('vcsettings-set-' + this.title)
                .setPlaceholder('Select user.')
                .setMinValues(1)
                .setMaxValues(1);

            const row1 = new ActionRowBuilder()
                .addComponents(userSelect);
            interaction.reply({ content: 'Select users:', components: [row1], ephemeral: true })
        },
        onEvent: function (interaction) {
            interaction.reply({ content: interaction.values.toString(), ephemeral: true })
        }
    },
    {
        pathToImage: 'person-fill-up.svg',
        title: 'TRUST',
        text: 'Trusts a person to be able to see your voice channel even in privacy mode.',
        process: function (interaction) {
            const userSelect = new UserSelectMenuBuilder()
                .setCustomId('vcsettings-set-' + this.title)
                .setPlaceholder('Select user.')
                .setMinValues(1)
                .setMaxValues(1);

            const row1 = new ActionRowBuilder()
                .addComponents(userSelect);
            interaction.reply({ content: 'Select users:', components: [row1], ephemeral: true })
        },
        onEvent: function (interaction) {
            interaction.reply({ content: interaction.values.toString(), ephemeral: true })
        }
    },
    {
        pathToImage: 'person-fill-x.svg',
        title: 'LIMIT',
        text: 'Limits the amount of users in your voice channel.',
        process: function (interaction) {
            interaction.reply({ content: "todo", ephemeral: true })
        },
        onEvent: function (interaction) {
            interaction.reply({ content: interaction.values.toString(), ephemeral: true })
        }
    },
    {
        pathToImage: 'person-fill-check.svg',
        title: 'UNBLOCK',
        text: 'Unblock a user.',
        process: function (interaction) {
            const userSelect = new UserSelectMenuBuilder()
                .setCustomId('vcsettings-set-' + this.title)
                .setPlaceholder('Select user.')
                .setMinValues(1)
                .setMaxValues(1);

            const row1 = new ActionRowBuilder()
                .addComponents(userSelect);
            interaction.reply({ content: 'Select users:', components: [row1], ephemeral: true })
        },
        onEvent: function (interaction) {
            interaction.reply({ content: interaction.values.toString(), ephemeral: true })
        }
    },
    {
        pathToImage: 'person-fill-down.svg',
        title: 'UNTRUST',
        text: 'Untrusts a user.',
        process: function (interaction) {
            const userSelect = new UserSelectMenuBuilder()
                .setCustomId('vcsettings-set-' + this.title)
                .setPlaceholder('Select user.')
                .setMinValues(1)
                .setMaxValues(1);

            const row1 = new ActionRowBuilder()
                .addComponents(userSelect);
            interaction.reply({ content: 'Select users:', components: [row1], ephemeral: true })
        },
        onEvent: function (interaction) {
            interaction.reply({ content: interaction.values.toString(), ephemeral: true })
        }
    },
    {
        pathToImage: 'person-fill-dash.svg',
        title: 'KICK',
        text: 'Kick a user from your voice channel.',
        process: function (interaction) {
            const userSelect = new UserSelectMenuBuilder()
                .setCustomId('vcsettings-set-' + this.title)
                .setPlaceholder('Select user.')
                .setMinValues(1)
                .setMaxValues(1);

            const row1 = new ActionRowBuilder()
                .addComponents(userSelect);
            interaction.reply({ content: 'Select users:', components: [row1], ephemeral: true })
        },
        onEvent: function (interaction) {
            interaction.reply({ content: interaction.values.toString(), ephemeral: true })
        }
    }
];
class VoiceChannels {
    constructor() {
        events.addEvent(this)
        this.initiate();
    }
    async initiate() {
        let what = "voiceSettings"
        let ref = bucket.getData("savedRefs")
        if (!ref.hasOwnProperty(what)) {
            ref[what] = {};
            bucket.setData(ref, "savedRefs")
        } else if (!ref[what].hasOwnProperty("messageId")) {
            let to = await client.channels.cache.find(channel => channel.id === ref[what].channelId);
            to.send(await this.getMainImage(imageObjects)).then(e => {
                ref[what].messageId = e.id;
                bucket.setData(ref, "savedRefs")
            });
        } else if (ref[what].hasOwnProperty("messageId")) {
            let to = await client.channels.cache.find(channel => channel.id === ref[what].channelId);
            let that = await to.messages.fetch(ref[what].messageId);
            that.edit(await this.getMainImage(imageObjects));
        }
    }
    getEvents() {
        return [{ "type": 3 }, { "type": 5 }]
    }
    onEventUpdate(interaction) {
        if (interaction.customId.includes("vcsettings-")) {
            switch (interaction.type) {
                case 3:
                    if (interaction.customId.includes("vcsettings-button-")) {
                        imageObjects.find(obj => obj.title == interaction.customId.replace("vcsettings-button-", "")).process(interaction);
                    } else {
                        imageObjects.find(obj => obj.title == interaction.customId.replace("vcsettings-set-", "").toUpperCase()).onEvent(interaction);
                    }
                    break;
                case 5:
                    imageObjects.find(obj => obj.title == interaction.customId.replace("vcsettings-modal-", "").toUpperCase()).onEvent(interaction);
                    break;
                default:
                    break;
            }

        }
    }
    async getMainImage(imageObjects) {
        const canvas = createCanvas(1400, 400);
        const context = canvas.getContext('2d');


        const numRows = 3;
        const numCols = 3; // You can adjust the number of columns as needed
        const gapX = 10; // Adjust horizontal gap as needed
        const gapY = 10; // Adjust vertical gap as needed
        const topgap = 70;

        const cellWidth = (canvas.width - (numCols - 1) * gapX) / numCols;
        const cellHeight = (canvas.height - topgap - (numRows - 1) * gapY) / numRows;
        const buttons = [];
        const guild = await client.guilds.fetch('943213858468802611');



        context.drawImage(await graphic.producerTag(50, false), 5, 5)
        context.textBaseline = 'middle'
        context.fillStyle = "white"
        context.textAlign = 'center'
        context.font = 'bold 44pt Poppins-bold'
        context.fillText("VOICECHAT SETTINGS", canvas.width / 2, 30);
        context.font = 'bold 32pt Poppins'
        context.textAlign = 'left'

        for (let row = 0; row < numRows; row++) {
            const buttonrow = [];
            for (let col = 0; col < numCols; col++) {
                const index = row * numCols + col;

                if (index >= imageObjects.length) {
                    break;
                }

                const imageObject = imageObjects[index];
                const x = col * (cellWidth + gapX);
                const y = row * (cellHeight + gapY) + topgap;
                context.fillStyle = graphic.prefColors(0, y, canvas.width, cellHeight)
                graphic.roundRect(context, x, y, cellWidth, cellHeight, 20, true)
                var icon = await (graphic.getIconImage(imageObject.pathToImage, "white", 200, 200))

                var scale = graphic.getImageScaling(icon, 90, cellHeight, x + 5, y, 20)
                context.drawImage(icon, scale.sx, scale.sy, scale.ex, scale.ey);

                context.fillStyle = "white"
                context.fillText(imageObject.title, x + 100, y + (cellHeight / 2));
                let emoji = await guild.emojis.cache.find(emoji => emoji.name == imageObject.title.toLowerCase())
                const button = new ButtonBuilder()
                    .setCustomId("vcsettings-button-" + imageObject.title)
                    .setEmoji("<:" + imageObject.title.toLowerCase() + ":" + emoji.id + ">")
                    .setStyle(ButtonStyle.Secondary);

                buttonrow.push(button);
            }
            buttons.push(buttonrow);

        }
        const actionRows = buttons.map((buttonrow) => new ActionRowBuilder().addComponents(buttonrow));

        return { files: [new AttachmentBuilder(canvas.toBuffer(), 'VoiceSettings.png')], components: actionRows }
    }
    updateUserSettings() {

    }
}
module.exports = new VoiceChannels();