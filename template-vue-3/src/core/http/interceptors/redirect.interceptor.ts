import { hardRedirect, hardReload, softRedirect } from '@/core/dom/redirect.service';
import { RedirectError } from '@/core/http/HttpRedirectError';

export default response => {
    const shouldRedirect = (response.data && response.headers.clientredirect === 'True') || response.headers.authredirect;
    if (shouldRedirect) {
        const redirectUrl = response.data.clientRedirectUrl || response.headers.authredirect;
        if (response.headers.authredirect) {
            // TODO: set cookie / localstorage with login attempt. Then when app reloads, log if user is logged in or not (login success or login failed)
        }
        if (redirectUrl) {
            response.headers.authredirect || response.data.reloadFromServer ? hardRedirect(redirectUrl) : softRedirect(redirectUrl);
        } else if (response.data.reloadCurrentPage) {
            hardReload();
        }
        // Payload should not be used. This will be treated special
        throw new RedirectError();
    }
    return response;
};
