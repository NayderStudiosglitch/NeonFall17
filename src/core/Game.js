import { CONFIG } from "./Config.js";
import { Logger } from "./Logger.js";
import { EventSystem } from "./EventSystem.js";
import { GameLoop } from "./GameLoop.js";

export class Game {
    constructor() {
        this.name = CONFIG.gameName;
        this.version = CONFIG.version;
        this.running = false;
        this.events = new EventSystem();

        this.gameLoop = new GameLoop((deltaTime) => {
            this.update(deltaTime);
        });
    }

    initialize() {
        Logger.info(`${this.name} ${this.version}`);
        Logger.info("Initializing game foundation...");

        this.running = true;

        this.events.emit("gameInitialized");

        Logger.info("GAME SYSTEM: ONLINE");

        this.gameLoop.start();
    }

    update(deltaTime) {
        // Future systems will update here:
        // Player
        // Weapons
        // AI
        // Vehicles
        // World
        // Multiplayer
    }

    shutdown() {
        this.running = false;

        this.gameLoop.stop();

        this.events.emit("gameShutdown");

        Logger.info("GAME SYSTEM: OFFLINE");
    }
}
