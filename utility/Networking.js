const request = require('request');
const imageToBase64 = require('image-to-base64');
const util = require(modules.Util)

class Net {
  constructor() {

  }
  async signedRequest(url) {
    return new Promise(function (resolve, reject) {
      var headers = {
        'User-Agent': "Ryglu's discord bot - @ryglus",
        'From': 'ryglusjesmurf@seznam.cz'
      }
      request({ headers, uri: url, method: 'GET' }, function (error, res, body) {
        if (!error && res.statusCode == 200) {
          resolve(body);
        } else {
          reject(error);
        }
      })
    });
  }
  async signedDiscordRequest(url) {
    const headers = {
      'Authorization': `Bot ${client.token}`,
    };
    return new Promise(function (resolve, reject) {
      request({ headers, uri: url, method: 'GET' }, function (error, res, body) {
        if (!error && res.statusCode == 200) {
          resolve(body);
        } else {
          reject(error);
        }
      });
    });
  }
  async requestBase64ImageFromWiki(name) {
    try {
      const response = await imageToBase64('https://oldschool.runescape.wiki/images/' + this.hypertextify("Clan_icon_-_" + util.capitalizeFirstLetter(name)) + ".png");
      if (response !== "c3RvcmFnZTogb2JqZWN0IGRvZXNuJ3QgZXhpc3QK") {
        return 'data:image/png;base64,' + response;
      } else {
        const response = await imageToBase64('https://oldschool.runescape.wiki/images/' + this.hypertextify(util.capitalizeFirstLetter(name) + "_-_Clan_icon") + "png");
        if (response !== "c3RvcmFnZTogb2JqZWN0IGRvZXNuJ3QgZXhpc3QK") {
          return 'data:image/png;base64,' + response;
        } //else console.log("Could not find image: " + name); // Use item.name for better error reporting
      }
    } catch (error) {
      console.error("Error fetching item image:", error);
    }

  }
  hypertextify(string) {
    return string.replaceAll(" ", "_").split("(").join("%28").split(")").join("%29").split("'").join("%27");
  }
}

module.exports = new Net();