import { Game } from "./core/Game.js";

const game = new Game();

game.events.on("gameInitialized", () => {
    console.log("NEON FALL 17 FOUNDATION READY");
});

game.initialize();
