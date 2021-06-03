import log from '../infrastructure/logging';

declare global {
    interface Window {
        dictionary?: {[key: string]: string}
    }
}

class DictionaryService {
    private dictionaryMap;

    constructor() {
        if (!window.dictionary) {
            console.error('window.dictionary should exist');
            this.dictionaryMap = new Map<string, string>();
            return;
        }
        this.dictionaryMap = new Map<string, string>(Object.entries(window.dictionary));
        delete window.dictionary;
    }

    public get(key: string, args: string[] = []) {
        const lowercaseKey = key ? key.toLowerCase() : key;

        const translated = this.dictionaryMap.get(lowercaseKey);
        if (translated === undefined) {
            log.error(`### Key '${key}' not found in dictionary ###`);
            return `##${key}`;
        }
        return this.format(translated, args);
    }

    public exists(key: string): boolean {
        return !!this.dictionaryMap.get(key);
    }

    public format(input: string, args: string[] = []): string {
        return args.reduce((result, arg, ix) => {
            return result.split(`{${ix}}`).join(arg);
        }, input);
    }
}

const dictionaryService = new DictionaryService();
export default dictionaryService;
