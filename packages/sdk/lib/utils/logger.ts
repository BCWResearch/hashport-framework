export class Logger {
    private debug: boolean;
    constructor(debug: boolean) {
        this.debug = debug;
    }
    info(...data: unknown[]) {
        if (this.debug) {
            console.log('[hashport]: ', ...data);
        }
    }
    error(e: unknown) {
        if (this.debug) {
            console.error('[hashport]: ', e);
        }
    }
}
