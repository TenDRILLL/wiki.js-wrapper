import { PageObject, PageSearchResponse } from "./PageManager";

export interface APIRequestResult {
    data: {
        pages: {
            single: PageObject;
            search: PageSearchResponse;
        };
    };
    errors: APIError[];
}

export interface APIError {
    message: string;
    locations: ErrorLocation[];
    path: string[];
    extensions: ErrorExtensions;
}

interface ErrorLocation {
    line: number;
    column: number;
}

interface ErrorExtensions {
    code: string;
    exception: ErrorExtensionsException;
}

interface ErrorExtensionsException {
    stacktrace: string[];
}

export interface LoginResult {
    data: {
        site: {
            config: {
                title: string;
            };
        };
    };
}

export interface APIRequest {
    req: (query: string) => Promise<APIRequestResult>;
}
