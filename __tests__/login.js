const nock = require("nock");
const Client = require("../build/Client");

const testOptions = {
    baseURL: "https://example.com/graphql",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOjEsImdycCI6MSwiaWF0IjoxNjQ5MjAzMjAwLCJleHAiOjE2ODA3MzkyMDAsImF1ZCI6InVybjp3aWtpLmpzIiwiaXNzIjoidXJuOndpa2kuanMiLCJ0eXBlIjoiZmFrZS1hc3MtdG9rZW4ifQ.FEWmrlsNrmbf9ESIgOhECNB_N9wRofUbM6UYLGpUrlw",
};

describe("Login to the API.", () => {
    it("Returns Wiki.js website title.", () => {
        nock("https://example.com")
            .get("/graphql?query={site{config{title}}}")
            .reply(200, { data: { site: { config: { title: "Example" } } } });
        new Client(testOptions).login().then((title) => {
            expect(title).toBe("Example");
        });
    });

    it("Returns Wiki.js website title after HTTP redirect.", () => {
        nock("https://example.com")
            .get("/graphql?query={site{config{title}}}")
            .reply(200, { data: { site: { config: { title: "Example" } } } });
        nock("http://example.com")
            .get("/graphql?query={site{config{title}}}")
            .reply(301, {}, { location: "https://example.com/graphql?query={site{config{title}}}" });
        testOptions.baseURL = "http://example.com/graphql";
        new Client(testOptions).login().then((title) => {
            expect(title).toBe("Example");
        });
    });

    it("Fail returning Wiki.js title if token is invalid.", () => {
        nock("https://example.com")
            .get("/graphql?query={site{config{title}}}")
            .reply(200, { errors: [{ message: "Forbidden" }] });
        testOptions.token = "ThisIsAFakeToken";
        testOptions.baseURL = "https://example.com/graphql";
        expect(new Client(testOptions).login()).rejects.toEqual(Error("Forbidden"));
    });
});
