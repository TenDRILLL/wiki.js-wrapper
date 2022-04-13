import PageManager from "./PageManager";

export default class Client {
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
     * @returns {String} The title of the wiki.js website.
     */

    login(): string;
}
