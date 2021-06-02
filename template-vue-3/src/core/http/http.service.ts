import axios, { AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';
import applicationVersionInterceptor from './interceptors/applicationVersion.interceptor';
import redirectInterceptor from './interceptors/redirect.interceptor';
import { RedirectError } from './HttpRedirectError';
import validationErrorsInterceptor from './interceptors/error.interceptor';
import {
    requestHandler as oAuthRequestInterceptor,
    responseHandler as oAuthResponseInterceptor,
} from './interceptors/OAuth.interceptor';
import * as querystring from 'querystring';
import { forEach, isArray } from 'lodash';
import HttpStatus from 'http-status-codes';
import { HttpCancelError } from '@/core/http/HttpCancelError';

// Those status'es that should cause "then" to be executed (so we can have interceptors)
const handledErrorStatusCodes = [
    HttpStatus.BAD_REQUEST,
    HttpStatus.NOT_FOUND,
    HttpStatus.INTERNAL_SERVER_ERROR,
    HttpStatus.BAD_GATEWAY,
    HttpStatus.UNAUTHORIZED,
];

// theFileYouDeclaredTheCustomConfigIn.ts
declare module 'axios' {
    export interface AxiosRequestConfig {
        messagesId?: string;
    }
}

export class HttpService {
    private outstandingRequests = 0;

    private responseInterceptors: Array<
        (value: AxiosResponse<any>) => AxiosResponse<any> | Promise<AxiosResponse<any>>
        > = [applicationVersionInterceptor, redirectInterceptor, validationErrorsInterceptor, oAuthResponseInterceptor];

    private requestInterceptors: Array<
        (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>
        > = [oAuthRequestInterceptor];

    private get defaultGetHeaders() : any {
        return ({
            'Content-Type': 'application/json', // must use this casing for the authentication service to work
        });
    }

    constructor() {
        this.registerInterceptors();

        axios.defaults.validateStatus = status => (status >= 200 && status < 300) || handledErrorStatusCodes.includes(status);
        axios.defaults.paramsSerializer = params => {
            const sortedParams = this.getParams(params);
            return querystring.stringify(sortedParams);
        };
    }

    private cancellableRequestDictionary: { [key: string]: CancelTokenSource | null } = {};

    private requestSucceded(res: AxiosResponse, contextKey?: string) {
        if (contextKey) {
            const cancellableContextKey = `${res.config.url}-${contextKey}`;
            this.cancellableRequestDictionary[cancellableContextKey] = null;
            delete this.cancellableRequestDictionary[cancellableContextKey];
        }
        return res;
    }

    private ensureCancellationToken(url: string, contextKey: string) {
        const cancellableContextKey = `${url}-${contextKey}`;
        let cancelTokenSrc = this.cancellableRequestDictionary[cancellableContextKey];
        if (cancelTokenSrc) {
            cancelTokenSrc.cancel();
        }

        cancelTokenSrc = axios.CancelToken.source();
        this.cancellableRequestDictionary[cancellableContextKey] = cancelTokenSrc;

        return cancelTokenSrc;
    }

    /** Returns true if cancelled, false if no oustanding request found. */
    public cancelRequest(cancelKey: string): boolean {
        for (const key in this.cancellableRequestDictionary) {
            if (key.endsWith(cancelKey)) {
                const cancelTokenSrc = this.cancellableRequestDictionary[key];
                if (cancelTokenSrc) {
                    cancelTokenSrc.cancel();
                    this.cancellableRequestDictionary[key] = null;
                    delete this.cancellableRequestDictionary[key];
                    return true;
                }
            }
        }

        return false;
    }

    private handlePotentialErrorResponse<T>(res: AxiosResponse<T>): T {
        if (handledErrorStatusCodes.includes(res.status)) {
            // Validatestatus above is set to include these ones so it will trigger 'then'.
            // Reason is that interceptors will then be run automatically on this as well.
            if ([HttpStatus.BAD_GATEWAY, HttpStatus.INTERNAL_SERVER_ERROR].includes(res.status)) {
                // handle error codes
            }
            throw res;
        }

        return res.data;
    }

    private unwrapResponse(data: any) {
        return data.model;
    }

    private handleErrorResponse(error: any): void {
        if (error) {
            if (axios.isCancel(error)) {
                throw new HttpCancelError();
            }
            if (error instanceof RedirectError) {
                return;
            }
        }

        throw error;
    }

    private registerInterceptors() {
        this.responseInterceptors.forEach(i => axios.interceptors.response.use(i));
        this.requestInterceptors.forEach(i => axios.interceptors.request.use(i));
    }

    private getParams(params: any): any {
        const keys: string[] = [];

        forEach(params, (value, key: string) => {
            keys.push(key);
        });

        const sortedParams = {};

        keys.forEach(value => {
            const searchValue = params[value];
            const sortedValues = isArray(searchValue) ? searchValue.sort() : searchValue;
            sortedParams[value] = sortedValues;
        });

        return sortedParams;
    }

    public getContentDispositionFilename(response: AxiosResponse): string {
        const contentDisposition = response.headers['content-disposition'];
        const match = contentDisposition.match(/filename\*?=((['"])[\s\S]*?\2|[^;\n]*)/i);
        const fileName = match[1];
        return fileName;
    }

    public async get<T>(url: string, params?: any, cancellationContextKey?: string, config?: AxiosRequestConfig): Promise<T> {
        config = config || {};
        config = {
            ...config,
            ...{
                headers: this.defaultGetHeaders,
                data: {}, // Axios kills application/json if no data object is provided https://github.com/axios/axios/issues/86#issuecomment-139638284
                params,
            },
        };

        const cancelTokenSrc = cancellationContextKey ? this.ensureCancellationToken(url, cancellationContextKey) : undefined;

        return axios
            .get(url, { ...config, cancelToken: cancelTokenSrc?.token })
            .then(res => this.requestSucceded(res, cancellationContextKey))
            .then(res => this.handlePotentialErrorResponse(res))
            .then(res => this.unwrapResponse(res))
            .catch(err => this.handleErrorResponse(err));
    }

    public async post<T>(url: string, payload?: any, messagesId?: string, cancellationContextKey?: string, config?: AxiosRequestConfig, rawResult = false): Promise<T> {
        config = {
            ...config,
            ...{
                messagesId,
                headers: this.defaultGetHeaders,
            },
        };

        const cancelTokenSrc = cancellationContextKey ? this.ensureCancellationToken(url, cancellationContextKey) : undefined;

        return axios
            .post(url, payload, { ...config, cancelToken: cancelTokenSrc?.token })
            .then(res => this.requestSucceded(res, cancellationContextKey))
            .then(res => rawResult ? res : this.handlePotentialErrorResponse(res))
            .then(res => rawResult ? res : this.unwrapResponse(res))
            .catch(err => this.handleErrorResponse(err));
    }

    public async delete<T>(url: string, params?: any, config?: AxiosRequestConfig, messagesId?: string): Promise<T> {
        config = config || {};
        config = {
            ...config,
            ...{
                headers: this.defaultGetHeaders,
                messagesId,
                data: {}, // Axios kills application/json if no data object is provided https://github.com/axios/axios/issues/86#issuecomment-139638284
                params,
            },
        };

        return axios
            .delete(url, config)
            .then(res => this.handlePotentialErrorResponse(res))
            .then(res => this.unwrapResponse(res))
            .catch(err => this.handleErrorResponse(err));
    }
}

export default new HttpService();
