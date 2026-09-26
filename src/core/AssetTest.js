import { AssetManager } from "./AssetManager.js";

const assets = new AssetManager();

console.log("=== NEON FALL 17 ASSET MANAGER TEST ===");

assets.register(
    "DesertGhostCity",
    "assets/maps/DesertGhostCity.glb",
    "map"
);

assets.register(
    "PlayerCharacter",
    "assets/characters/Player.glb",
    "character"
);

assets.register(
    "CustomWeapon",
    "assets/weapons/CustomWeapon.glb",
    "weapon"
);

assets.register(
    "Zombie",
    "assets/characters/Zombie.glb",
    "character"
);

console.log("Stats:", assets.getStats());

await assets.load("DesertGhostCity");
await assets.load("PlayerCharacter");
await assets.load("CustomWeapon");
await assets.load("Zombie");

console.log("Loaded DesertGhostCity:", assets.get("DesertGhostCity"));
console.log("Loaded PlayerCharacter:", assets.get("PlayerCharacter"));
console.log("Loaded CustomWeapon:", assets.get("CustomWeapon"));
console.log("Loaded Zombie:", assets.get("Zombie"));

console.log("Final Stats:", assets.getStats());

assets.unload("Zombie");

console.log("After Zombie unload:", assets.getStats());

console.log("=== ASSET MANAGER READY ===");
