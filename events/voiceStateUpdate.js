const { Events, ChannelType } = require('discord.js');
const bucket = require(modules.Bucket)

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    let sr = bucket.getData("savedRefs")
    if (newState.channelId === sr.mainvoice.channelId) {
      try {
        // Fetch the parent category of the voice channel
        const parentCategory = await newState.channel.parent.fetch();
        let settings = bucket.getData("voiceChannels")[newState.id];
        const member = await newState.guild.members.fetch(newState.id);
        let userAllow = [], userDeny = []
        if (settings) {
          Object.keys(settings.settings).forEach(o => {
            if (settings.settings[o]) {
              userAllow.push(o);
            } else {
              userDeny.push(o);
            }
          });
        }

        const options = {
          type: 2,
          parent: parentCategory.id,
          permissionOverwrites: parentCategory.permissionOverwrites.cache.map(o => ({
            id: o.id,
            type: o.type,
            allow: [...o.allow.toArray(), ...userAllow],
            deny: [...o.deny.toArray(), ...userDeny],
          })),
          bitrate: (parentCategory.bitrate || 64000),
          userLimit: (settings?.userLimit || parentCategory?.userLimit || 0),
          name: (settings?.vcname || member.nickname + "'s channel"),
        };
        //console.log(options)
        // Create a new voice channel
        const channel = await newState.guild.channels.create(options);
        // Move the member to the new channel
        await member.voice.setChannel(channel);
      } catch (error) {
        console.error(error);
      }
    }
    if (oldState.channelId && oldState.channelId !== sr.mainvoice.channelId) {
      var vc = oldState.guild.channels.cache.find(channel => channel.id === oldState.channelId);
      if (vc.members.size == 0) {
        vc.delete();
      }
    }
  },
};
