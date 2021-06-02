declare global {
    interface Window {
        appData: {
        }
    }
}

export function isDevMode(): boolean {
    return !isProdMode();
}

export function isProdMode(): boolean {
    // return process.env.NODE_ENV === 'production';
    return import.meta.env.PROD;
}
