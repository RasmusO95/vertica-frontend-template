import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import authService from '@/core/auth/auth.service';
import HttpStatus from 'http-status-codes';

enum CustomResponseHeaders {
    Token = 'x-eet-token',
    TokenInvalid = 'x-eet-token-invalid'
}

const responseHandler = async(response: AxiosResponse) => {
    const isTokenInvalid = response?.headers[CustomResponseHeaders.TokenInvalid] as boolean;
    if (isTokenInvalid) {
        authService.logOut();
        return response;
    }

    const token = response?.headers[CustomResponseHeaders.Token] as string;
    if (token) {
        authService.logIn(token);
    }

    if (response.status === HttpStatus.UNAUTHORIZED && token) {
        // We got a 401 but a new token has been provided, retry the rejected request
        const retryResponse = await axios.request(response.config);
        return retryResponse;
    }

    return response;
};

const requestHandler = (config: AxiosRequestConfig): AxiosRequestConfig => {
    if (authService.token) {
        config.headers.authorization = 'Bearer ' + authService.token;
    }
    return config;
};

export {
    requestHandler,
    responseHandler,
};
