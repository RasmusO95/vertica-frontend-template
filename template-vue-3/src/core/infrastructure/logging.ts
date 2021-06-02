import { isDevMode, isProdMode } from './environment';

const consoleLogsEnabled = location.search.includes('enable-console-logs=true') || isDevMode();
const serverLogsEnabled = location.search.includes('enable-server-logs=true') || isProdMode();

const serverLoggingService = {
    debug(obj: any) {
        console.error('Serverlogging not overridden... ', obj);
    },
    info(obj: any) {
        console.error('Serverlogging not overridden... ', obj);
    },
    warn(obj: any) {
        console.error('Serverlogging not overridden... ', obj);
    },
    error(obj: any) {
        console.error('Serverlogging not overridden... ', obj);
    },
    fatal(obj: any) {
        console.error('Serverlogging not overridden... ', obj);
    },
    fatalException(obj: any, ex: any) {
        console.error('Serverlogging not overridden... ', obj);
    },
};

class Logging {
    public debug(logObject: any): void {
        this.consoleLogging(() => console.log(logObject));
        this.serverLogging(() => serverLoggingService.debug(logObject));
    }

    public info(logObject: any) {
        this.consoleLogging(() => console.info(logObject));
        this.serverLogging(() => serverLoggingService.info(logObject));
    }

    public warn(logObject: any) {
        this.consoleLogging(() => console.warn(logObject));
        this.serverLogging(() => serverLoggingService.warn(logObject));
    }

    public error(logObject: any) {
        this.consoleLogging(() => console.error(logObject));
        this.serverLogging(() => serverLoggingService.error(logObject));
    }

    public fatal(logObject: any) {
        this.consoleLogging(() => console.error(logObject));
        this.serverLogging(() => serverLoggingService.fatal(logObject));
    }

    public exception(logObject: any, e: any) {
        this.consoleLogging(() => console.error(logObject, e));
        this.serverLogging(() => {
            try {
                serverLoggingService.fatalException(logObject, e);
            } catch {
                // It has been seen that an object (e.g. internal vue object cannot be serialized due to circular refs.)
                serverLoggingService.fatal(logObject);
            }
        });
    }

    private consoleLogging(func: () => void) {
        if (consoleLogsEnabled) {
            func();
        }
    }

    private serverLogging(func: () => void) {
        if (serverLogsEnabled) {
            func();
        }
    }
}

export default new Logging();
