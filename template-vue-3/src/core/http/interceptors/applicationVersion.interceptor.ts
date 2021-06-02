import log from '@/core/infrastructure/logging';
import { AxiosResponse } from 'axios';

let previousVersion;

export default (response: AxiosResponse) => {
    const currentVersion = response.headers['VERSION-HEADER'];
    if (!currentVersion) return response;

    if (!previousVersion) {
        // First time
        previousVersion = currentVersion;
        return response;
    }

    if (currentVersion !== previousVersion) {
        log.info(`Hard-reloading due to version mismatch. Previous: ${previousVersion}, Current: ${currentVersion}`);
        window.location.reload();
    }
    return response;
};
