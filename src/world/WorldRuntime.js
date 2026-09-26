export class WorldRuntime {

    constructor(world) {
        this.world = world;

        this.running = false;
        this.elapsedTime = 0;

        console.log("[WORLD RUNTIME] Created");
    }

    start() {

        if (this.running) {
            return;
        }

        this.running = true;

        console.log(
            "[WORLD RUNTIME] STARTED"
        );
    }

    update(deltaTime) {

        if (!this.running) {
            return;
        }

        this.elapsedTime += deltaTime;

        this.world.update(deltaTime);
    }

    stop() {

        if (!this.running) {
            return;
        }

        this.running = false;

        console.log(
            "[WORLD RUNTIME] STOPPED"
        );
    }

    getState() {

        return {
            running: this.running,
            elapsedTime: this.elapsedTime,
            worldReady: this.world.isReady
        };
    }
}
