import log from '@/core/infrastructure/logging';
import router from '@/router';

export function hardReload() {
    log.info('Hard reload');
    window.location.reload();
}

export function softRedirect(url: string) {
    log.info(`Soft redirect. Url: ${url}`);
    router.replace(url);
}

export function hardRedirect(url: string) {
    log.debug(`Hard redirect. Url: ${url}`);
    window.location.href = url;
}
