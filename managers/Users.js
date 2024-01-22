
const bucket = require(modules.Bucket)
const modMail = require(modules.ModMail)
const net = require(modules.Networking)
const graphic = require(modules.CustomGraphics);
const emoji = require(modules.Emojis)
const util = require(modules.Util)

class Users {
    constructor() {
        //this.parseOldCheckin()
        this.additionalRankUpCheck()
        //this.syncOsrsDiscordRanks()
        //this.Testing()
        //var to = await client.channels.cache.find(channel => channel.id === interaction.message.channelId)
        //this.setRankNamesAndIcons();
    }
    Testing() {
        console.log(this.getUserByRSN("Ryglu"))
        console.log(this.getRsnInfo("Ryglu"))
        console.log(this.getUsersByRank("colonel"))
        console.log(this.getAllRankNames())
    }
    async checkForRole(roleName) {
        const guild = await client.guilds.fetch(config.mainGuild);
        const members = guild.members.cache;
        const membersWithRole = [];

        members.forEach((member) => {
            if (member.roles.cache.some((role) => role.name === roleName)) {
                membersWithRole.push(member.user.id);
            }
        });

        return membersWithRole;
    }
    async parseOldCheckin() {
        let ppl = bucket.getData("people")

        for (let p in ppl) {
            if (ppl[p].hasOwnProperty("vcname")) delete ppl[p].vcname
            if (ppl[p].hasOwnProperty("checks")) ppl[p].checks.forEach(c => {
                if (!ppl[p].hasOwnProperty("checkin")) ppl[p].checkin = {}
                if (ppl[p]["checkin"].hasOwnProperty(c.split("-")[1])) ppl[p]["checkin"][c.split("-")[1]][ppl[p]["checkin"][c.split("-")[1]].length] = Number(c.split("-")[0])
                else ppl[p]["checkin"][c.split("-")[1]] = [Number(c.split("-")[0])]
            })
            delete ppl[p].checks
            if (ppl[p].hasOwnProperty("gotRankup")) delete ppl[p].gotRankup
        }
        bucket.setData(ppl, "people")
    }
    async syncOsrsDiscordRanks() {
        let ppl = bucket.getData("people")
        let rankName = Object.keys(bucket.getData("clanIcons"));
        let ce = bucket.getData("clanExport")

        const matchingPpl = [];

        ce.forEach(async (entry) => {
            for (const userId in ppl) {
                const user = ppl[userId];
                if (user.RSN.includes(entry.rsn)) {
                    const guild = await client.guilds.fetch(config.mainGuild);
                    const member = guild.members.cache.get(userId);
                    if (member) {
                        //ppl[userId].rank == Number(rankName.indexOf(entry.rank.toLowerCase())) - 1
                        const role = guild.roles.cache.find((r) => r.name === util.capitalizeFirstLetter(rankName[ppl[userId].rank + 1]));
                        //await member.roles.add(role);
                    }
                    if (ppl[userId].rank < rankName.indexOf(entry.rank.toLowerCase()) - 1) {
                        ppl[userId].rank = Number(rankName.indexOf(entry.rank.toLowerCase()) - 1)
                        bucket.setData(ppl, "people")
                    }
                    matchingPpl.push({ entry, user, "rankindex": rankName.indexOf(entry.rank.toLowerCase()) });
                    break; // Stop searching once a match is found
                }
            }
        });

        //console.log(matchingPpl);
    }
    async additionalRankUpCheck() {
        let ppl = bucket.getData("people")
        let wallet = bucket.getData("wallet");
        let rankName = Object.keys(bucket.getData("clanIcons"));
        const guild = await client.guilds.fetch(config.mainGuild);
        const maxedRole = guild.roles.cache.find((r) => r.name === util.capitalizeFirstLetter(rankName[8]));
        for (let person in ppl) {
            if (wallet.hasOwnProperty(person)) {
                if (ppl[person].rank == 7 && wallet[person].donated >= 25000000) {

                    const member = guild.members.cache.get(person);
                    if (member) {
                        const role = guild.roles.cache.find((r) => r.name === util.capitalizeFirstLetter(rankName[10]));
                        await member.roles.add(role);
                        await member.roles.remove(maxedRole)
                        ppl[person].rank = 9
                        bucket.setData(ppl, "people")
                        let checkInEmoji = await emoji.createOrGetEmoji(rankName[10])
                        modMail.createModAction("RANK UP", "**" + ppl[person].RSN.join(', ') + "** to " + checkInEmoji + " " + rankName[10], person)
                    }

                } else if (ppl[person].rank == 7 && wallet[person].donated >= 5000000) {
                    const guild = await client.guilds.fetch(config.mainGuild);
                    const member = guild.members.cache.get(person);
                    if (member) {
                        const role = guild.roles.cache.find((r) => r.name === util.capitalizeFirstLetter(rankName[9]));
                        await member.roles.add(role);
                        await member.roles.remove(maxedRole)
                        ppl[person].rank = 8
                        bucket.setData(ppl, "people")
                        let checkInEmoji = await emoji.createOrGetEmoji(rankName[9])
                        modMail.createModAction("RANK UP", "**" + ppl[person].RSN.join(', ') + "** to " + checkInEmoji + " " + rankName[9], person)
                    }
                }
            }
        }


    }
    async rankUpUserById(id) {
        let user = this.getUserById(id)
        if (!user) user = this.createUser(id);

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth()
        if (!user.hasOwnProperty('checkin')) user.checkin = {};

        if (!user.checkin.hasOwnProperty(currentYear)) user.checkin[currentYear] = [];

        if (!user.checkin[currentYear].includes(currentMonth)) {
            user.checkin[currentYear][user.checkin[currentYear].length] = currentMonth;
            console.log(this.getAllRankNames())
            if (!user.hasOwnProperty('rank')) user.rank = Number(1);
            if (user.rank < 7) {
                user.rank += Number(1);
                let rankName = this.getAllRankNames()[user.rank];
                
                let checkInEmoji = await emoji.createOrGetEmoji(rankName)
                modMail.createModAction("RANK UP", "**" + user.RSN.join(', ') + "** to " + checkInEmoji + " " + rankName, id)
                let ppl = bucket.getData("people")
                ppl[id] = user;
                bucket.setData(ppl, "people")
                
                this.rankUpInDiscord(id)
                return "Thank you for checking in, you can expect your rank up in game soon."
            }
            
            let ppl = bucket.getData("people")
            ppl[id] = user;
            bucket.setData(ppl, "people")
            this.rankUpInDiscord(id)
            return "Thank you for checking in."

        } else {
            return "You have allready checked in this month."
        }


    }
    verifyUser(id) {
        let user = this.getUserById(id)
        if (!user) user = this.createUser(id);
        if (!user.hasOwnProperty("rank")) {
            this.rankUpUserById(id)
        } else if (user.rank == 1) {
            this.rankUpUserById(id)
        }
    }
    async rankUpInDiscord(id) {
        let ppl = bucket.getData("people")
        const guild = await client.guilds.fetch(config.mainGuild);
        const member = guild.members.cache.get(id);
        let rankName = this.getAllRankNames();
        if (member) {
            const rolea = guild.roles.cache.find((r) => r.name === util.capitalizeFirstLetter(rankName[ppl[id].rank]));
            await member.roles.add(rolea);
            const roleb = guild.roles.cache.find((r) => r.name === util.capitalizeFirstLetter(rankName[ppl[id].rank-1]));
            await member.roles.remove(roleb);
        }
    }
    createUser(id) {
        let ppl = bucket.getData("people")
        ppl[id] = {}
        bucket.setData(ppl, "people")
        return ppl[id];
    }



    getUserById(id) {
        let ppl = bucket.getData("people")
        if (ppl.hasOwnProperty(id)) {
            return ppl[id]
        }
        return;
    }
    getUserByRSN(rsn) {
        var peopleData = bucket.getData("people")

        for (const userId in peopleData) {
            const user = peopleData[userId];
            if (user.RSN.includes(rsn)) {
                return user;
            }
        }
        return;
    }



    getRsnInfo(rsn) {
        var people = bucket.getData("clanExport");

        const foundUser = people.find(user => user.rsn.toLowerCase() === rsn.toLowerCase());

        if (foundUser) {
            return foundUser;
        } else {
            return; // Return null or handle the case when the user is not found.
        }
    }
    getUsersByRank(rank) {
        var people = bucket.getData("clanExport");

        const matchingUsers = people.filter(user => user.rank.toLowerCase() === rank.toLowerCase());

        if (matchingUsers.length > 0) {
            return matchingUsers;
        } else {
            return; // Return null or handle the case when no users with the specified rank are found.
        }
    }
    getAllRankNames() {
        var ranks = bucket.getData("clanIcons");
        return Object.keys(ranks);
    }
    async setRankNamesAndIcons() {
        const guild = await client.guilds.fetch('681891725786087603');
        const rankIcons = {}; // Declare rankIcons here
        const rolesArray = guild.roles.cache.map((role) => role);
        rolesArray.sort((a, b) => a.rawPosition - b.rawPosition);

        const promises = rolesArray.map(async (role) => {
            const requestedIcon = await net.requestBase64ImageFromWiki(role.name.toLowerCase());

            if (requestedIcon) {
                graphic.resizeBase64(requestedIcon, 64, 64)
                    .then((resizedBase64) => {
                        role.setIcon(resizedBase64)
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                return { [role.name.toLowerCase()]: { base64: requestedIcon } };
            }

        });

        Promise.all(promises)
            .then((iconsArray) => {
                Object.assign(rankIcons, ...iconsArray); // Merge icons into the existing rankIcons
                bucket.setData(rankIcons, "clanIcons");
            })
            .catch((error) => {
                console.error(error);
            });
    }
}


module.exports = new Users();