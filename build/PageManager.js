"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Queries_1 = require("./Queries");
var PageManager = /** @class */ (function () {
    function PageManager(client) {
        this.client = client;
    }
    PageManager.prototype.get = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.client.isReady())
                reject(new Error("CLIENT_NOT_READY"));
            _this.client.APIRequest.req(Queries_1.default.SinglePageQuery(id))
                .then(function (data) {
                if ("single" in data.data.pages && data.data.pages.single.id) {
                    resolve(data.data.pages.single);
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
    PageManager.prototype.search = function (search) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a, _b, _c;
            if (!_this.client.isReady())
                reject(new Error("CLIENT_NOT_READY"));
            if (!search)
                reject(new Error("NO_SEARCHQUERY"));
            var searchQuery, path, locale;
            if (typeof search === "string") {
                searchQuery = search;
            }
            else if (typeof search === "object") {
                searchQuery = (_a = search.query) !== null && _a !== void 0 ? _a : undefined;
                path = (_b = search.path) !== null && _b !== void 0 ? _b : undefined;
                locale = (_c = search.locale) !== null && _c !== void 0 ? _c : undefined;
            }
            else {
                reject(new Error("INVALID_SEARCHQUERY"));
            }
            _this.client.APIRequest.req(Queries_1.default.SearchPageQuery(searchQuery, path, locale))
                .then(function (data) {
                if ("search" in data.data.pages) {
                    resolve(data.data.pages.search);
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
    return PageManager;
}());
exports.default = PageManager;
