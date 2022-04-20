import Queries from "./Queries";

class PageManager {
    constructor(client) {
        this.client = client;
    }

    get(id) {
        return new Promise((resolve, reject) => {
            if (!this.client.isReady()) reject(new Error("CLIENT_NOT_READY"));
            this.client.APIRequest.req(Queries.SinglePageQuery(id))
                .then((data) => {
                    if (data.data.pages.single.id) {
                        resolve(data.data.pages.single);
                    } else {
                        reject(new Error("INVALID_RESPONSE"));
                    }
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

    search(search) {
        return new Promise((resolve, reject) => {
            if (!this.client.isReady()) reject(new Error("CLIENT_NOT_READY"));
            if (!search) reject(new Error("NO_SEARCHQUERY"));
            let searchQuery, path, locale;
            if (typeof search === "string") {
                searchQuery = search;
            } else if (typeof search === "object") {
                searchQuery = search.query ?? undefined;
                path = search.path ?? undefined;
                locale = search.locale ?? undefined;
            } else {
                reject(new Error("INVALID_SEARCHQUERY"));
            }
            this.client.APIRequest.req(Queries.SearchPageQuery(searchQuery, path, locale))
                .then((data) => {
                    if (data.data.pages.search) {
                        resolve(data.data.pages.search);
                    } else {
                        reject(new Error("INVALID_RESPONSE"));
                    }
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }
}

module.exports = PageManager;
