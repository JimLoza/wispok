export class HttpResponse<T> {
    constructor(
        public status: number,
        public body: T
    ) { }
}