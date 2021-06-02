import { App } from 'vue';
import dictionaryService from './dictionary.service';

/**
 * Usage: <p>{{ $filters.translate(value) }}</p>
 * Documentation: https://v3.vuejs.org/guide/migration/filters.html#global-filters
 */
export function translate(value: string, ...args: string[]): string {
    return value ? dictionaryService.get(value, args) : '';
}

export default function config(app: App): void {
    app.config.globalProperties.$filters = {
        translate(value: string, ...args: string[]) {
            return translate(value, ...args);
        },
    };
}
