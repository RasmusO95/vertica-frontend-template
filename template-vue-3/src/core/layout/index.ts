import { App } from 'vue';
import CIcon from './CIcon.vue';

export default function config(app: App): void {
    app.component(CIcon.name, CIcon);
}
