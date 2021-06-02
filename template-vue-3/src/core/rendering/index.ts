import { App } from 'vue';
import LazyInit from './LazyInit.vue';

export default function config(app: App): void {
    app.component(LazyInit.name, LazyInit);
}
