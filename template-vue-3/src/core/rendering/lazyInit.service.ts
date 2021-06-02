export type LazyInitRootMargins = 0 | 200 | 400 | 600 | 800 | 1000;

class LazyInitService {
    private defaultOptions = {
        root: null,
        rootMargin: '800px',
        threshold: 0,
    };

    private observers = new Map<number, IntersectionObserver>();
    private defaultRootMargin: LazyInitRootMargins = 800;

    private static intersectionCallback(entries): void {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.$$lazyCallback(entry);
            } else if (!entry.isIntersecting && entry.target.$$lazyCallbackNotIntersecting) {
                entry.target.$$lazyCallbackNotIntersecting(entry);
            }
        });
    }

    public initObserver(rootMargin?: LazyInitRootMargins): IntersectionObserver {
        const options = { ...this.defaultOptions, rootMargin: `${rootMargin}px` };
        const observer = new IntersectionObserver(LazyInitService.intersectionCallback, options);
        this.observers.set(<LazyInitRootMargins>rootMargin, observer);

        return observer;
    }

    public observe(
        el: Element,
        rootMargin: LazyInitRootMargins = this.defaultRootMargin,
        isIntersectingCallback: (entry: any) => void,
        notIntersectingCallback?: ((entry: any) => void) | null,
    ): void {
        (el as any).$$lazyCallback = isIntersectingCallback;

        if (notIntersectingCallback) {
            (el as any).$$lazyCallbackNotIntersecting = notIntersectingCallback;
        }

        const observer = this.observers.get(rootMargin) || this.initObserver(rootMargin);
        observer.observe(el);
    }

    public unObserve(el): void {
        this.observers.forEach((value, key) => {
            this.observers.get(key)?.unobserve(el);
        });
    }

    public disconnect(): void {
        this.observers.forEach((value, key) => {
            this.observers.get(key)?.disconnect();
        });
    }
}

export default new LazyInitService();
