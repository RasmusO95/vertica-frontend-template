import { App } from 'vue';
import './config';
import contentConfig from './content';
import formsConfig from './forms';

export default function config(app: App<Element>): void {
    formsConfig(app);
    contentConfig(app);
}
