const nock = require("nock");

describe("Search the API for a page.", ()=>{
    nock("https://example.com")
        .get("/graphql?query={site{config{title}}}")
        .reply(200,{data: {site: {config: {title: "Example"}}}});
    const Client = require("../src/Client");
    const testOptions = {
        baseURL: "https://example.com/graphql",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOjEsImdycCI6MSwiaWF0IjoxNjQ5MjAzMjAwLCJleHAiOjE2ODA3MzkyMDAsImF1ZCI6InVybjp3aWtpLmpzIiwiaXNzIjoidXJuOndpa2kuanMiLCJ0eXBlIjoiZmFrZS1hc3MtdG9rZW4ifQ.FEWmrlsNrmbf9ESIgOhECNB_N9wRofUbM6UYLGpUrlw"
    }
    const client = new Client(testOptions);
    it("Return PageSearchResult with query.", ()=>{
        nock("https://example.com")
            .get("/graphql?query={pages{search(query:\"example\"){results{id,title,description,path,locale},suggestions,totalHits}}}")
            .reply(200,{data: {pages: {search: {results: [{id: "1"}], suggestions: [], totalHits: 1}}}});
        client.login().then(()=>{
            client.pages.search("example").then(res => {
                expect(res.totalHits).toBe(res.results.length);
            });
        });
    });

    it("Return PageSearchResult for non-existing locale with query and locale.", ()=>{
        nock("https://example.com")
            .get("/graphql?query={pages{search(query:\"example\",locale:\"es\"){results{id,title,description,path,locale},suggestions,totalHits}}}")
            .reply(200,{data: {pages: {search: {results: [], suggestions: [], totalHits: 0}}}});
        client.login().then(()=>{
            client.pages.search({query: "example", locale: "es"}).then(res => {
                expect(res.totalHits).toBe(res.results.length);
            });
        });
    });
});