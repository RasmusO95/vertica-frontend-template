import { App } from 'vue';
import autofocusDirective from '@/core/dom/autofocus.directive';

export default function config(app: App): void {
    app.directive('autofocus', autofocusDirective);
}
