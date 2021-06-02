declare const window: any;

export interface IStorage {
    isImplemented(): boolean;

    getItem(key: string): string | null;

    getItemAs<T>(key: string): T | null;

    setItem(key: string, value: any): boolean;

    setItemAs<T>(key: string, data: T): void;

    removeItem(key: string): void;

    clear(): boolean;

    key(index: number): string | null;
}

class BaseStorage implements IStorage {
    constructor(private store: any) {}

    public isImplemented(): boolean {
        return true;
    }

    public getItemAs<T>(key: string): T | null {
        const item = this.store.getItem(key);
        try {
            return item !== null ? (JSON.parse(item) as T) : null;
        } catch (err) {
            return null;
        }
    }

    public setItemAs<T>(key: string, data: T): void {
        this.setItem(key, JSON.stringify(data));
    }

    public getItem(key: string): string | null {
        return this.store.getItem(key);
    }

    public setItem(key: string, value: any): boolean {
        try {
            this.store.setItem(key, value);
            return true;
        } catch (ex) {
            return false;
        }
    }

    public removeItem(key: string): void {
        return this.store.removeItem(key);
    }

    public clear() {
        return this.store.clear();
    }

    public key(index: number): string | null {
        return this.store.key(index);
    }
}

class FakeStorage implements IStorage {
    public isImplemented(): boolean {
        return false;
    }

    public getItem(key: string): string | null {
        return null;
    }

    public setItem(key: string, value: any): boolean {
        return false;
    }

    public getItemAs<T>(key: string): T | null {
        return null;
    }

    public setItemAs<T>(key: string, data: T): void {
        return undefined;
    }

    public removeItem(key: string): void {
        return undefined;
    }

    public clear(): boolean {
        return true;
    }

    public key(index: number): string | null {
        return null;
    }
}

const hasStorage = ($window: any, name: string) => {
    const hasStorageSupport = name in $window;
    if (!hasStorageSupport) {
        return false;
    }
    const testKey = 'storageTest';
    try {
        // this check has to be wrapped within a try/catch because of
        // a SecurityError: Dom Exception 18 on iOS
        if ($window[name] !== null) {
            $window[name].setItem(testKey, 'foo');
            $window[name].removeItem(testKey);
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
};

export const localStorageService: IStorage = hasStorage(window, 'localStorage')
    ? new BaseStorage(window.localStorage)
    : new FakeStorage();

export const sessionStorageService: IStorage = hasStorage(window, 'sessionStorage')
    ? new BaseStorage(window.sessionStorage)
    : new FakeStorage();
