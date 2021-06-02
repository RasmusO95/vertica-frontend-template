export class HttpServerError extends Error {
    constructor(public status: number) {
        super();
    }
}
