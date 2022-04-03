const Client = require("./src/Client");
const options = require("./testconfig.json");
const client = new Client(options);

client.login().then((title)=>{
    console.log(`Connected to ${title}`);
}).catch(e => {
    console.log(e);
});