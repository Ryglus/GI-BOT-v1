const fs = require('fs');
const path = require('path');

let instance = null; 
var data = {},dataPaths={};

class Bucket {
  constructor() {
    if (!instance) {
      // Create the instance only if it doesn't exist
      instance = this;
      loadJSONS(path.join(resources, '/info/'))
    }

    return instance;
  }

  getData(destination) {
    return data[destination];
  }

  setData(value,destination) {
    data[destination] = value;
    saveData(data[destination],destination)
  }
}


const loadJSONS = async (dir) => {
	const files = fs.readdirSync(dir, { withFileTypes: true });
	for (const file of files) {
		if (file.isDirectory()) {
			loadJSONS(path.join(dir, file.name));
		} else if (file.name.endsWith('.json')) {
      dataPaths[file.name.replace(".json","")]=path.join(dir, file.name);
      data[file.name.replace(".json","")] = JSON.parse(fs.readFileSync(path.join(dir, file.name)));
      
		}
	}
};
async function saveData(data, destination) {
  fs.writeFileSync(dataPaths[destination], JSON.stringify(data, null, 2))
}
module.exports = new Bucket(); // Export a single shared instance
