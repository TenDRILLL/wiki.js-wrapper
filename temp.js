const Client = require("./src/Client");
const client2 = new Client(require("./testconfig.json"));
client2.login().then(c => console.log(c));