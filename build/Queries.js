"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Queries = /** @class */ (function () {
    function Queries() {
    }
    Queries.SinglePageQuery = function (id) {
        return "?query={pages{single(id:".concat(id, "){id,path,hash,title,description,isPrivate,isPublished,privateNS,publishStartDate,publishEndDate,tags{id,tag,title,createdAt,updatedAt},content,render,contentType,createdAt,updatedAt,editor,locale,scriptCss,scriptJs,authorId,authorName,authorEmail,creatorId,creatorName,creatorEmail}}}");
    };
    Queries.SearchPageQuery = function (searchQuery, path, locale) {
        return "?query={pages{search(query:\"".concat(searchQuery, "\"").concat(path ? ",path:\"".concat(path, "\"") : "").concat(locale ? ",locale:\"".concat(locale, "\"") : "", "){results{id,title,description,path,locale},suggestions,totalHits}}}");
    };
    return Queries;
}());
exports.default = Queries;
