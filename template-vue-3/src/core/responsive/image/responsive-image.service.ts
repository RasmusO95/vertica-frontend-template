const sizes: Array<number> = [];
let maxWidth: number | undefined;
let _baseUrl = '';

export function addSize(width: number): void {
    sizes.push(width);
}

export function setMaxWidth(width: number): void {
    maxWidth = width;
}

export function getMaxWidth(): number | undefined {
    return maxWidth;
}

export function setBaseUrl(baseUrl: string): void {
    _baseUrl = baseUrl;
}

function getBaseUrl(): string {
    return _baseUrl;
}

function getSizes(): number[] {
    return sizes.length ? sizes : [320, 640, 1024, 1600];
}

export default {
    getSizes,
    getBaseUrl,
    getMaxWidth,
};
