import pageManager from "./PageManager";
import APIRequest from "./APIRequest";

class Client {
    constructor(params) {
        this._validateParameters(params);
        this.ready = false;
        this.pages = new pageManager(this);
        this.APIRequest = new APIRequest(this);
    }

    _validateParameters(params = {}) {
        if (!params.token || typeof params.token !== "string") throw new Error("INVALID_TOKEN");
        this.token = params.token;
        if (!params.baseURL || typeof params.baseURL !== "string") throw new Error("INVALID_BASEURL");
        if (!params.baseURL.match(/^(http:\/\/|https:\/\/)/gi)) throw new Error("INVALID_BASEURL_PROTOCOL");
        this.baseURL = params.baseURL;
    }

    isReady() {
        return this.ready;
    }

    login() {
        return new Promise((resolve, reject) => {
            this.APIRequest.req("?query={site{config{title}}}")
                .then((data) => {
                    if (data.data.site.config.title) {
                        this._ready();
                        resolve(data.data.site.config.title);
                    } else {
                        reject(new Error("INVALID_RESPONSE"));
                    }
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

    _ready() {
        this.ready = true;
    }
}

module.exports = Client;
