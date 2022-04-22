import Client from "./Client";

interface PageManagerSearchOptions {
    query: string;
    path?: string;
    locale?: string;
}
export interface PageObject {
    id: number;
    path: string;
    hash: string;
    title: string;
    description: string;
    isPrivate: boolean;
    isPublished: boolean;
    privateNS: string;
    publishStartDate: string;
    publishEndDate: string;
    tags: PageTag;
    content: string;
    render: string;
    contentType: string;
    createdAt: string;
    updatedAt: string;
    editor: string;
    locale: string;
    scriptCss: string;
    scriptJs: string;
    authorId: number;
    authorName: string;
    authorEmail: string;
    creatorID: number;
    creatorName: string;
    creatorEmail: string;
}
interface PageTag {
    id: number;
    tag: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}
export interface PageSearchResponse {
    results: Array<PageSearchResult>;
    suggestions: Array<string>;
    totalHits: number;
}
interface PageSearchResult {
    id: string;
    title: string;
    description: string;
    path: string;
    locale: string;
}
/**
 * Contains page-related methods.
 */
export default class PageManager {
    constructor(client: Client);

    /**
     * Used to get a page by ID from the wiki.
     * @param id
     */
    get(id: number): Promise<PageObject>;

    /**
     * Search for a page.
     * @param query
     */
    search(query: string): Promise<PageSearchResponse>;
    search(options: PageManagerSearchOptions): Promise<PageSearchResponse>;
}
