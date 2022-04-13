import PageManager from "./PageManager";

export default class Client {
    constructor(params: {token: string, baseURL: string});
    pages: PageManager
    isReady(): boolean
    login(): string
} 