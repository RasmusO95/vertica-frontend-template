import { reactive } from 'vue';
import tokenService from './token.service';

export interface UserData {
    name: string;
    email: string;
}

class AuthService {
    private state: {
        token: string | null,
        userData: UserData | null
    } = reactive({ token: null, userData: null })

    constructor() {
        const token = tokenService.getToken();
        if (token) {
            this.logIn(token);
        }
    }

    public logIn(token: string) {
        this.state.token = token;
        this.state.userData = tokenService.parseJwt<UserData>(token);
        tokenService.setToken(token);
    }

    public logOut() {
        this.state.token = null;
        this.state.userData = null;
        tokenService.removeToken();
    }

    public get token(): string | null {
        return this.state.token;
    }

    public get userData(): UserData | null {
        return this.state.userData;
    }

    public get isLoggedIn(): boolean {
        return !!this.state.token;
    }
}

export default new AuthService();
