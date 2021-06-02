import { App } from 'vue';
import onErrorDirective from './image/on-error.directive';
import ResponsiveImage from './image/ResponsiveImage.vue';

export default function config(app: App): void {
    app.directive('onError', onErrorDirective);
    app.component(ResponsiveImage.name, ResponsiveImage);
}
