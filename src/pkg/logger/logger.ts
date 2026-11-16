

type LogLevel = 'error' | 'debug' | 'info';

class Logger {
    // constructor() {
    //     if(!Logger.instance){
    //         Logger.instance = new Logger();
    //     }
    //     return Logger.instance;
    // }

    log(level: LogLevel, message: string, metaData: Record<string, unknown> = {}){
        let messageObj = {
            level: level,
            message: message,
            timestamp: Date.now(), ...metaData
        }
        console.log(JSON.stringify(messageObj));
    }

    error(message: string, metaData: Record<string, unknown> = {}){
        this.log('error', message,metaData);
    }

    debug(message: string, metaData: Record<string, unknown> = {}) {
    this.log('debug', message,metaData);
    }

    info(message: string, metaData: Record<string, unknown> = {}) {
        this.log('info', message,metaData);
    }
}

export const logger = new Logger();
