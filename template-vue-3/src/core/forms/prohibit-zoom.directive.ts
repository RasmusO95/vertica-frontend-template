import domService from '../dom/dom.service';
const timeout = 1000;

const prohibitZoomDirective = {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    beforeMount(el: HTMLElement) {
        let touchTimer;
        let blurTimer;
        const standardMeta = domService.getMetaViewport();
        const unscalableMeta = standardMeta + ', maximum-scale=1.0, user-scalable=0';

        el.ontouchstart = touchstartHandler;
        el.onfocus = focusHandler;
        el.onblur = blurHandler;

        function touchstartHandler() {
            clearTimeout(touchTimer);
            domService.setMetaViewport(unscalableMeta);
            touchTimer = setTimeout(() => {
                domService.setMetaViewport(standardMeta);
            }, timeout);
        }

        function focusHandler() {
            clearTimeout(touchTimer);
            domService.setMetaViewport(unscalableMeta);
        }

        function blurHandler() {
            clearTimeout(blurTimer);
            domService.setMetaViewport(unscalableMeta);
            blurTimer = setTimeout(() => {
                domService.setMetaViewport(standardMeta);
            }, timeout);
        }
    },
};

export default prohibitZoomDirective;
