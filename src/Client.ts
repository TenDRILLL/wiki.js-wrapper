import PageManager from "./PageManager";
import APIRequest from "./APIRequest";
import { LoginResult } from "../types/Constants";
import Queries from "./Queries";

class Client {
    private ready: boolean;
    private pages: PageManager;
    private APIRequest: APIRequest;
    private token: string;
    private baseURL: string;

    constructor(params) {
        this._validateParameters(params);
        this.ready = false;
        this.pages = new PageManager(this);
        this.APIRequest = new APIRequest(this);
    }

    _validateParameters(params = { token: "", baseURL: "" }) {
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
            this.APIRequest.req(Queries.LoginQuery())
                .then((data: LoginResult) => {
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
