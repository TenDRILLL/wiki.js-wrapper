export interface APIRequestResult {
    data: object;
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
