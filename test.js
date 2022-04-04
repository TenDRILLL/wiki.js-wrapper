const Client = require("./src/Client");
const options = require("./testconfig.json");
const client = new Client(options);

client.login().then((title)=>{
    console.log(`Connected to ${title}`);
    client.pages.get(1).then(page => {
        console.log(page);
    }).catch(e => {
        console.log(e);
    });
    client.pages.search("cmd").then(searchResult => {
        console.log(`Amount of pages matching your search: ${searchResult.totalHits}`);
    }).catch(e => {
        console.log(e);
    });
}).catch(e => {
    console.log(e);
});