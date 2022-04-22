import { Client } from "../types";
import * as http from "http";
import * as https from "https";
import { json } from "stream/consumers";
import { APIRequestResult } from "../types/Constants";

class APIRequest {
    private client: Client;
    private httpModule: typeof http | typeof https;

    constructor(client) {
        this.client = client;
    }

    req(query) {
        return new Promise((resolve, reject) => {
            const controller = new AbortController();
            const options = this.getOptions(query, controller.signal);
            const request = this.httpModule.get(options, (res) => {
                clearTimeout(timeout);
                if (res.statusCode > 300 && res.statusCode < 400) {
                    if (res.headers.location) {
                        this.client.baseURL = res.headers.location;
                        return resolve(this.req(query));
                    } else {
                        reject(new Error("INVALID_BASEURL"));
                    }
                }
                json(res)
                    .then((data: APIRequestResult) => {
                        if (data.errors?.length > 0) {
                            clearTimeout(timeout);
                            reject(new Error(data.errors[0].message));
                        }
                        if (data.data) {
                            resolve(data);
                        } else {
                            reject(new Error("INVALID_RESPONSE"));
                        }
                    })
                    .catch(() => {
                        reject(new Error("DATA_NOT_JSON"));
                    });
            });
            request.end();
            const timeout = setTimeout(() => {
                controller.abort();
                reject(new Error("TIMEOUT_EXCEEDED"));
            }, 20000);
        });
    }

    getOptions(query, signal) {
        let url = this.client.baseURL;
        url = url.split("://");
        const port = url.shift() === "https" ? 443 : 80;
        this.httpModule = port === 443 ? https : http;
        url = url.join("").split("/");
        const host = url[0];
        const path = `/${url[1]}${query ?? ""}`;
        return {
            host,
            port,
            path,
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.client.token}`,
                "Content-Type": "application/json",
            },
            signal,
        };
    }
}

export default APIRequest;
