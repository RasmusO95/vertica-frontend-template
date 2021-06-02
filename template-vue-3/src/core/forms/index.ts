import './vee-validate.config';
import { App } from 'vue';
import prohibitZoomDirective from './prohibit-zoom.directive';

export default function config(app: App): void {
    app.directive('prohibit-zoom', prohibitZoomDirective);
}
