export class Logger {
    static info(message) {
        console.log(`[INFO] ${message}`);
    }

    static warning(message) {
        console.warn(`[WARNING] ${message}`);
    }

    static error(message) {
        console.error(`[ERROR] ${message}`);
    }
}
