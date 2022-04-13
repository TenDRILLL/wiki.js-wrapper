const nock = require("nock");

describe("Login to the API.", ()=>{
    const Client = require("./src/Client");
    let client;
    const testOptions = {
        baseURL: "https://example.com/graphql",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOjEsImdycCI6MSwiaWF0IjoxNjQ5MjAzMjAwLCJleHAiOjE2ODA3MzkyMDAsImF1ZCI6InVybjp3aWtpLmpzIiwiaXNzIjoidXJuOndpa2kuanMiLCJ0eXBlIjoiZmFrZS1hc3MtdG9rZW4ifQ.FEWmrlsNrmbf9ESIgOhECNB_N9wRofUbM6UYLGpUrlw"
    }

    it("Returns Wiki.js website title.", async ()=>{
        const login = nock("https://example.com")
            .get("/graphql?query={site{config{title}}}")
            .reply(200,{data: {site: {config: {title: "Example"}}}});
        client = new Client(testOptions);
        expect(await client.login()).toBe("Example");
    });

    it("Returns Wiki.js website title after HTTP redirect.", async ()=>{
        const login = nock("https://example.com")
            .get("/graphql?query={site{config{title}}}")
            .reply(200,{data: {site: {config: {title: "Example"}}}});
        const redirect = nock("http://example.com")
            .get("/graphql?query={site{config{title}}}")
            .reply(301,{},{location: "https://example.com/graphql?query={site{config{title}}}"});
        testOptions.baseURL = "http://example.com/graphql";
        client = new Client(testOptions);
        expect(await client.login()).toBe("Example");
    });

    it("Fail returning Wiki.js title if token is invalid.", async ()=>{
        const fail = nock("https://example.com")
            .get("/graphql?query={site{config{title}}}")
            .reply(200,{errors: [{message: "Forbidden"}]});
        testOptions.token = "ThisIsAFakeToken";
        testOptions.baseURL = "https://example.com/graphql";
        client = new Client(testOptions);
        await expect(client.login()).rejects.toEqual(Error("Forbidden"));
    });
});