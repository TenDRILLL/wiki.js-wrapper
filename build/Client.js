"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PageManager_1 = require("./PageManager");
var APIRequest_1 = require("./APIRequest");
var Client = /** @class */ (function () {
    function Client(params) {
        this._validateParameters(params);
        this.ready = false;
        this.pages = new PageManager_1.default(this);
        this.APIRequest = new APIRequest_1.default(this);
    }
    Client.prototype._validateParameters = function (params) {
        if (params === void 0) { params = { token: "", baseURL: "" }; }
        if (!params.token || typeof params.token !== "string")
            throw new Error("INVALID_TOKEN");
        this.token = params.token;
        if (!params.baseURL || typeof params.baseURL !== "string")
            throw new Error("INVALID_BASEURL");
        if (!params.baseURL.match(/^(http:\/\/|https:\/\/)/gi))
            throw new Error("INVALID_BASEURL_PROTOCOL");
        this.baseURL = params.baseURL;
    };
    Client.prototype.isReady = function () {
        return this.ready;
    };
    Client.prototype.login = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.APIRequest.req("?query={site{config{title}}}")
                .then(function (data) {
                if (data.data.site.config.title) {
                    _this._ready();
                    resolve(data.data.site.config.title);
                }
                else {
                    reject(new Error("INVALID_RESPONSE"));
                }
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    Client.prototype._ready = function () {
        this.ready = true;
    };
    return Client;
}());
module.exports = Client;
