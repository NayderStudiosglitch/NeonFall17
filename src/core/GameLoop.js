export class GameLoop {
    constructor(updateCallback, targetFPS = 60) {
        this.updateCallback = updateCallback;
        this.targetFPS = targetFPS;
        this.frameDuration = 1000 / targetFPS;

        this.running = false;
        this.lastTime = 0;
        this.frameCount = 0;
        this.fps = 0;
        this.fpsTimer = 0;
    }

    start() {
        if (this.running) return;

        this.running = true;
        this.lastTime = performance.now();

        console.log(`[GAME LOOP] STARTED - TARGET ${this.targetFPS} FPS`);

        this.loop();
    }

    stop() {
        this.running = false;
        console.log("[GAME LOOP] STOPPED");
    }

    loop() {
        if (!this.running) return;

        const currentTime = performance.now();
        const elapsed = currentTime - this.lastTime;

        if (elapsed < this.frameDuration) {
            setTimeout(() => this.loop(), 1);
            return;
        }

        this.lastTime = currentTime;

        const deltaTime = Math.min(elapsed / 1000, 0.1);

        this.frameCount++;
        this.fpsTimer += deltaTime;

        if (this.fpsTimer >= 1) {
            this.fps = this.frameCount;

            console.log(`[FPS] ${this.fps}`);

            this.frameCount = 0;
            this.fpsTimer = 0;
        }

        this.updateCallback(deltaTime);

        setImmediate(() => this.loop());
    }
}
