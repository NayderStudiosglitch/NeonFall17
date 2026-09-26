export class EventSystem {
    constructor() {
        this.events = new Map();
    }

    on(eventName, callback) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }

        this.events.get(eventName).push(callback);
    }

    emit(eventName, data = null) {
        const listeners = this.events.get(eventName) || [];

        for (const callback of listeners) {
            callback(data);
        }
    }
}
