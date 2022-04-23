"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var https = require("https");
var consumers_1 = require("stream/consumers");
var APIRequest = /** @class */ (function () {
    function APIRequest(client) {
        this.client = client;
    }
    APIRequest.prototype.req = function (query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var controller = new AbortController();
            var options = _this.getOptions(query, controller.signal);
            var request = _this.httpModule.get(options, function (res) {
                clearTimeout(timeout);
                if (res.statusCode > 300 && res.statusCode < 400) {
                    if (res.headers.location) {
                        _this.client.baseURL = res.headers.location;
                        return resolve(_this.req(query));
                    }
                    else {
                        reject(new Error("INVALID_BASEURL"));
                    }
                }
                (0, consumers_1.json)(res)
                    .then(function (data) {
                    var _a;
                    if (((_a = data.errors) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                        clearTimeout(timeout);
                        reject(new Error(data.errors[0].message));
                    }
                    if (data.data) {
                        resolve(data);
                    }
                    else {
                        reject(new Error("INVALID_RESPONSE"));
                    }
                })
                    .catch(function () {
                    reject(new Error("DATA_NOT_JSON"));
                });
            });
            request.end();
            var timeout = setTimeout(function () {
                controller.abort();
                reject(new Error("TIMEOUT_EXCEEDED"));
            }, 20000);
        });
    };
    APIRequest.prototype.getOptions = function (query, signal) {
        var url = this.client.baseURL.split("://");
        var port = url.shift() === "https" ? 443 : 80;
        this.httpModule = port === 443 ? https : http;
        url = url.join("").split("/");
        var host = url[0];
        var path = "/".concat(url[1]).concat(query !== null && query !== void 0 ? query : "");
        return {
            host: host,
            port: port,
            path: path,
            method: "GET",
            headers: {
                Authorization: "Bearer ".concat(this.client.token),
                "Content-Type": "application/json",
            },
            signal: signal,
        };
    };
    return APIRequest;
}());
exports.default = APIRequest;
