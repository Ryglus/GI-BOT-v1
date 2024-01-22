const osrs = require('osrs-json-api');
const bucket = require(modules.Bucket)
const net = require(modules.Networking)
class AdvancedHiscores {
  constructor() {

  }
  async fetchPlayer(playerName, mode = "main") {
    try {
      const playerData = await osrs.hiscores.getPlayer(playerName, mode);
      return playerData;
    } catch (error) {
      console.error(`Error fetching data for ${playerName}:`, error);
      throw error; // Optionally rethrow the error if needed.
    }
  }

  async fetchPlayers(playerNames) {
    const players = {};
    const errors = {};

    for (const playerName of playerNames) {
      try {
        const playerData = await this.fetchPlayer(playerName);
        players[playerName] = playerData;
      } catch (error) {
        errors[playerName] = error; // Store the error
      }
    }

    return { data: players, errors }; // Return both data and errors
  }
  async leaguesFetchLeaderboard() {
    let ppl = bucket.getData("people")
    const players = {};
    const errors = {};
    for (const playerName in ppl) {
      if (ppl[playerName].rank >= 2) {
        for (const rsn of ppl[playerName].RSN) {
          try {
            let playerData = await net.signedRequest("https://services.runescape.com/m=hiscore_oldschool_seasonal/index_lite.ws?player=" + rsn)

            players[rsn] = { total: playerData.split("\n")[0].split(",")[1], points: playerData.split("\n")[24].split(",")[1] };
          } catch (error) {
            errors[rsn] = error; // Store the error
          }
        }
      }
    }
    return { data: players, errors }; // Return both data and errors
  }
  async massFetch(mode) {
    let ppl = bucket.getData("people")
    const players = {};
    const errors = {};
    for (const playerName in ppl) {
      if (ppl[playerName].rank >= 2) {
        for (const rsn of ppl[playerName].RSN) {
          try {
            const playerData = await this.fetchPlayer(rsn, mode);
            players[rsn] = playerData;
          } catch (error) {
            errors[rsn] = error; // Store the error
          }
        }
      }
    }
    return { data: players, errors }; // Return both data and errors
  }



  async hofGra(name) {
    var hof = {}
    for (id in data) {
      for (let i = 0; i < data[id].RSN.length; i++) {
        await osrs.hiscores.getPlayer(data[id].RSN[i]).then(res => {
          hof[data[id].RSN[i]] = res
          hof[data[id].RSN[i]].discord = { "id": id }
        }).catch(console.error);
      }
    }
  }
  async hofGrab() {
    //var data = JSON.parse(fs.readFileSync("./activity-tracker/data.json"));
    var hof = {}
    for (id in data) {
      for (let i = 0; i < data[id].RSN.length; i++) {
        await osrs.hiscores.getPlayer(data[id].RSN[i]).then(res => {
          hof[data[id].RSN[i]] = res
          hof[data[id].RSN[i]].discord = { "id": id }
        }).catch(console.error);
      }
    }
    return await hofDisplayCalc(hof)
  }

}


module.exports = new AdvancedHiscores();













