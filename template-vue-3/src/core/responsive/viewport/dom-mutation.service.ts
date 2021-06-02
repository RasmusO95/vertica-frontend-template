class DomMutationService {
    public MutationObserver;
    public eventListenerSupported = false;

    constructor() {
        this.MutationObserver = (window as any).MutationObserver || (window as any).WebKitMutationObserver;
        this.eventListenerSupported = !!window.addEventListener;
    }

    public observe(obj: any, callback: () => void) {
        if (this.MutationObserver) {
            const obs = new this.MutationObserver((mutations: any, observer: any) => {
                if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
                    callback();
                }
            });
            obs.observe(obj, { childList: true, subtree: true });
        } else if (this.eventListenerSupported) {
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    }
}

export default new DomMutationService();
