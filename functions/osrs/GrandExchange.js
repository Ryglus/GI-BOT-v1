
const imageToBase64 = require('image-to-base64');
const net = require(modules.Networking);
const bucket = require(modules.Bucket)
const graphic = require(modules.CustomGraphics)

class GrandExchange {
    constructor() {
        //this.test()
    }
    async test() {
        //await this.updateDB();
        //await this.getItemImage(4968)
        //await this.requestItemImage("cokcring")
        //console.log(await this.getItemCurrentPrice(20011));
        //console.log(await this.getItemGraphPrice(20011));
        //console.log(await this.getItemFullInfo("scythe"))
    }
    async updateDB() {
        console.log("running GE UPDATE");
        try {
            const response = await net.signedRequest('https://prices.runescape.wiki/api/v1/osrs/mapping');
            const newPrices = JSON.parse(response);
            const existingData = await bucket.getData("ItemMap");

            // Filter out items with names starting with "corrupted"
            const uniqueNewItems = newPrices.filter(newItem => {
                return !existingData.some(existingItem => existingItem.id === newItem.id) &&
                    !newItem.name.toLowerCase().startsWith("corrupted");
            });

            if (uniqueNewItems.length > 0) {
                console.log(`Found ${uniqueNewItems.length} new items.`);
                existingData.push(...uniqueNewItems);
                bucket.setData(existingData, "ItemMap");
                console.log("Database updated successfully.");
            } else {
                console.log("No new items found.");
            }
        } catch (error) {
            console.error('Error fetching data from the API:', error.message);
        }
    }
    async getItemCurrentPrice(id) {
        let prices = JSON.parse(await net.signedRequest('https://prices.runescape.wiki/api/v1/osrs/latest?id=' + id)).data
        return prices[id];

    }
    async getItemsCurrentPrice(array,what="low") {
        let prices = JSON.parse(await net.signedRequest('https://prices.runescape.wiki/api/v1/osrs/latest')).data;
        let retrn = {};
        array.forEach(id=>{
            retrn[id] = prices[id][what]
        });
        return retrn;

    }
    //TODO: FINISH
    async getItemGraphPrice(id, timespan) {
        "5m" || "1h" || "6h" || "24h"
        var prices = JSON.parse(await net.signedRequest('https://prices.runescape.wiki/api/v1/osrs/timeseries?timestep=5m&id=' + id)).data
        console.log(prices)
    }
    async getItemFullInfo(nameOrId) {
        const itemMap = bucket.getData("ItemMap");
        const searchTerm = nameOrId.toLowerCase();

        // Exact item ID search
        const idMatch = itemMap.find(item => item.id === searchTerm);
        if (idMatch) {
            const prices = await this.getItemCurrentPrice(idMatch.id);
            if (prices) {
                Object.keys(prices).forEach(k => {
                    idMatch[k] = prices[k];
                });
            }
            return idMatch;
        }

        // Exact or partial item name search
        const nameMatch = itemMap.find(item => item.name.toLowerCase().includes(searchTerm));
        if (nameMatch) {
            const prices = await this.getItemCurrentPrice(nameMatch.id);
            if (prices) {
                Object.keys(prices).forEach(k => {
                    nameMatch[k] = prices[k];
                });
            }
            return nameMatch;
        }

        return "Item not found: " + nameOrId;
    }
    async getItemImage(name) {
        var itemMap = bucket.getData("ItemMap");
        const foundItem = itemMap.find(item => item.id === name) || itemMap.find(item => item.name === name);
        if (foundItem) {
            if (!foundItem.hasOwnProperty("base64")) {
                itemMap[itemMap.indexOf(foundItem)].base64 = await this.requestItemImage(foundItem)
                bucket.setData(itemMap, "ItemMap");
                return await graphic.loadImageFromBase64(itemMap[itemMap.indexOf(foundItem)].base64);
            } else {
                return await graphic.loadImageFromBase64(foundItem.base64);
            }
        } else {
            console.log("item not found: " + name)
        }

    }
    async requestItemImage(item) {
        try {
            const response = await imageToBase64('https://oldschool.runescape.wiki/images/' + net.hypertextify(item.icon));
            if (response !== "c3RvcmFnZTogb2JqZWN0IGRvZXNuJ3QgZXhpc3QK") {
                return 'data:image/png;base64,' + response;
            } else {
                console.log("Could not find item: " + item.name); // Use item.name for better error reporting
            }
        } catch (error) {
            console.error("Error fetching item image:", error);
        }
    }
}


module.exports = new GrandExchange();