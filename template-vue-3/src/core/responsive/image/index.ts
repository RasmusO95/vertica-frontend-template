import onErrorDirective from './on-error.directive';
import { App } from 'vue';

export function configure(vue: App): void {
    vue.directive('onError', onErrorDirective);
}
