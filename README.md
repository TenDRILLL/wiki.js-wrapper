# wiki.js-wrapper
![Tests](https://github.com/TenDRILLL/wiki.js-wrapper/workflows/Tests/badge.svg)
[![NPM Version](https://img.shields.io/npm/v/wiki.js-wrapper?color=37c6ff&style=plastic)](https://www.npmjs.com/package/wiki.js-wrapper)

A WIP wrapper for the Wiki.js API (GraphQL).

## Documentation
[Wiki.js-wrapper Documentation](https://tendrilll.github.io/wiki.js-wrapper-docs/)
### Example
```js
const {Client} = require("wiki.js-wrapper");
const options = {
    baseURL: "http://example.com/graphql",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOjEsImdycCI6MSwiaWF0IjoxNjQ5MjAzMjAwLCJleHAiOjE2ODA3MzkyMDAsImF1ZCI6InVybjp3aWtpLmpzIiwiaXNzIjoidXJuOndpa2kuanMiLCJ0eXBlIjoiZmFrZS1hc3MtdG9rZW4ifQ.FEWmrlsNrmbf9ESIgOhECNB_N9wRofUbM6UYLGpUrlw"
}
const client = new Client(options);

client.login().then((title)=>{
    console.log(`Connected to ${title}.`);
    client.pages.get(1).then(page => {
        console.log(page);
    }).catch(e => {
        console.log(e);
    });
}).catch(e => {
    console.log(e);
});
```