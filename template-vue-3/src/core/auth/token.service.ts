import { localStorageService } from '@/core/storage/storage.service';

const LOCAL_STORAGE_KEY = 'auth-token';
const LOCAL_STORAGE_KEY_FOR_PREVIOUS = 'auth-token-previous';

export interface UserData {
    name: string;
    email: string;
}

class TokenService {
    public parseJwt(token: string | null): UserData | null {
        if (!token) return null;

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            // eslint-disable-next-line
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const parsedToken = JSON.parse(jsonPayload);
            const userData = {};
            Object.keys(parsedToken).forEach(key => {
                const pascalCasedKey = key.charAt(0).toLowerCase() + key.slice(1);
                userData[pascalCasedKey] = parsedToken[key];
            });
            return userData as UserData;
        } catch {
            this.removeToken(true);
            return null;
        }
    }

    public getToken(): string | null {
        return localStorageService.getItem(LOCAL_STORAGE_KEY);
    }

    public setToken(token: string): void {
        localStorageService.setItem(LOCAL_STORAGE_KEY, token);
        localStorageService.setItem(LOCAL_STORAGE_KEY_FOR_PREVIOUS, token);
    }

    public removeToken(previous = false) {
        localStorageService.removeItem(LOCAL_STORAGE_KEY);

        if (previous) {
            localStorageService.removeItem(LOCAL_STORAGE_KEY_FOR_PREVIOUS);
        }
    }
}

export default new TokenService();
