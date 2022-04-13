const nock = require("nock");

const login = nock("https://example.com", {
        reqheaders: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOjEsImdycCI6MSwiaWF0IjoxNjQ5MjAzMjAwLCJleHAiOjE2ODA3MzkyMDAsImF1ZCI6InVybjp3aWtpLmpzIiwiaXNzIjoidXJuOndpa2kuanMiLCJ0eXBlIjoiZmFrZS1hc3MtdG9rZW4ifQ.FEWmrlsNrmbf9ESIgOhECNB_N9wRofUbM6UYLGpUrlw"
        }
    })
    .get("/graphql?query={site{config{title}}}")
    .reply(200,{data: {site: {config: {title: "Example"}}}})
    .persist();

const redirect = nock("http://example.com")
    .get("/graphql?query={site{config{title}}}")
    .reply(301,{},{location: "https://example.com/graphql?query={site{config{title}}}"});

describe("Login to the API.", ()=>{
    const Client = require("./src/Client");
    let client;
    const testOptions = {
        baseURL: "https://example.com/graphql",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOjEsImdycCI6MSwiaWF0IjoxNjQ5MjAzMjAwLCJleHAiOjE2ODA3MzkyMDAsImF1ZCI6InVybjp3aWtpLmpzIiwiaXNzIjoidXJuOndpa2kuanMiLCJ0eXBlIjoiZmFrZS1hc3MtdG9rZW4ifQ.FEWmrlsNrmbf9ESIgOhECNB_N9wRofUbM6UYLGpUrlw"
    }

    it("Returns Wiki.js website title.", async ()=>{
        client = new Client(testOptions);
        expect(await client.login()).toBe("Example");
    });

    it("Returns Wiki.js website title after HTTP redirect.", async ()=>{
        testOptions.baseURL = "http://example.com/graphql";
        client = new Client(testOptions);
        expect(await client.login()).toBe("Example");
    });

    //TODO: FIX: ERR_NOCK_NO_MATCH, if reqheaders are invalid nock doesn't return at all.
    it("Fail returning Wiki.js title if token is invalid.", async ()=>{
        testOptions.token = "ThisIsAFakeToken";
        testOptions.baseURL = "https://example.com/graphql";
        client = new Client(testOptions);
        expect(await client.login()).toThrowError("Error: Forbidden");
    });
});