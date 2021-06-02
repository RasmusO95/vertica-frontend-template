import domMutation from './dom-mutation.service';
import { Ref, ref } from 'vue';

interface Viewport {
    width: Ref<number>;
    height: Ref<number>;
}

let ticking = false;
const viewport = {
    width: ref(getWindowWidth()),
    height: ref(window.innerHeight),
};

window.addEventListener('resize', requestTick, false);
window.addEventListener('orientationchange', requestTick, false);
domMutation.observe(document, requestTick);
requestTick();

function tick() {
    viewport.width.value = getWindowWidth();
    viewport.height.value = window.innerHeight;
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(tick);
        ticking = true;
    }
}

function getWindowWidth(): number {
    return Math.max(window.innerWidth, window.document.documentElement?.clientWidth);
}

function useViewportEvents(): Viewport {
    return viewport;
}

export type {
    Viewport,
};

export {
    useViewportEvents,
};
