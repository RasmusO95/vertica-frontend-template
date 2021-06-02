import { App } from 'vue';
import responsiveConfig from './responsive';
import renderingConfig from './rendering';
import layoutConfig from './layout';
import formsConfig from './forms';
import domConfig from './dom';
import translationFilterConfig from './dictionary/translate.filter';
import { VueSvgIconPlugin } from '@yzfe/vue3-svgicon';

export default function config(app: App): void {
    responsiveConfig(app);
    formsConfig(app);
    domConfig(app);
    layoutConfig(app);
    renderingConfig(app);
    translationFilterConfig(app);

    // 3rd party
    app.use(VueSvgIconPlugin, { tagName: 'vue-svgicon' });
}
