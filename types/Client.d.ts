import PageManager from "./PageManager";
import { APIRequest } from "./Constants";

export default class Client {
    baseURL: string;
    token: string;
    APIRequest: APIRequest;

    constructor(params: {
        /**
         * Your wiki.js website API address, usually ends with /graphql
         */
        token: string;
        /**
         * Your wiki.js website API token, created in the administration section
         */
        baseURL: string;
    });

    /**
     * Used to access methods related to pages.
     */
    pages: PageManager;

    isReady(): boolean;

    /**
     * Used to verify your baseURL and token, so that they work on the API.
     * @returns {Promise<String>} The title of the wiki.js website.
     */

    login(): Promise<string>;
}
