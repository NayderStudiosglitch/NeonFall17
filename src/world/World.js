import { Terrain } from "./Terrain.js";
import { ObjectManager } from "./ObjectManager.js";
import { LightManager } from "./LightManager.js";
import { CollisionManager } from "./CollisionManager.js";
import { BlenderAssetLoader } from "./BlenderAssetLoader.js";
import { Player } from "./Player.js";
import { PlayableMap } from "./PlayableMap.js";
import { EnemyManager } from "./EnemyManager.js";

export class World {

constructor(scene, camera = null) {

    this.scene = scene;
    this.camera = camera;

    // ========================================
    // WORLD SYSTEMS
    // ========================================

    this.terrain =
        new Terrain(scene);

    this.objects =
        new ObjectManager(scene);

    this.lights =
        new LightManager(scene);

    this.collision =
        new CollisionManager();

    this.assets =
        new BlenderAssetLoader(scene);

    // ========================================
    // PLAYABLE MAP
    // ========================================

    this.playableMap =
        new PlayableMap(
            scene,
            this.collision
        );

    // ========================================
    // PLAYER
    // ========================================

    this.player = null;

    // ========================================
    // ENEMY MANAGER
    // ========================================

    this.enemyManager = null;

    // ========================================
    // WORLD STATE
    // ========================================

    this.isReady = false;
}

// ========================================
// INITIALIZE WORLD
// ========================================

initialize() {

    console.log(
        "[WORLD] Initializing Neon Fall 17 World Engine..."
    );

    // ========================================
    // WORLD SYSTEMS
    // ========================================

    this.lights.initialize();

    this.terrain.initialize();

    // ========================================
    // PLAYABLE MAP
    // ========================================

    this.playableMap.initialize();

    // ========================================
    // PLAYER
    // ========================================

    if (this.camera) {

        this.player =
            new Player(
                this.scene,
                this.camera,
                this.collision
            );

        this.player.spawn(
            0,
            0,
            8
        );

        console.log(
            "[WORLD] Player entity ready"
        );

    } else {

        console.warn(
            "[WORLD] Camera not provided - Player not created"
        );
    }

    // ========================================
    // ENEMY MANAGER
    // ========================================

    if (this.player) {

        this.enemyManager =
            new EnemyManager(
                this.scene,
                this.player
            );

        this.enemyManager
            .spawnInitialEnemies();

        console.log(
            "[WORLD] Enemy manager ready"
        );
    }

    // ========================================
    // WORLD READY
    // ========================================

    this.isReady = true;

    console.log(
        "[WORLD] Scene ready"
    );

    console.log(
        "[WORLD] Terrain system ready"
    );

    console.log(
        "[WORLD] Object system ready"
    );

    console.log(
        "[WORLD] Lighting system ready"
    );

    console.log(
        "[WORLD] Collision system ready"
    );

    console.log(
        "[WORLD] Blender asset loader ready"
    );

    console.log(
        "[WORLD] Playable map ready"
    );

    if (this.enemyManager) {

        console.log(
            `[WORLD] Active enemies: ${
                this.enemyManager.getActiveCount()
            }`
        );
    }

    console.log(
        "[WORLD] ENGINE WORLD ONLINE"
    );
}

// ========================================
// UPDATE
// ========================================

update(deltaTime) {

    if (!this.isReady) {
        return;
    }

    // ========================================
    // PLAYABLE MAP
    // ========================================

    if (this.playableMap) {

        this.playableMap.update(
            deltaTime
        );
    }

    // ========================================
    // OBJECTS
    // ========================================

    if (this.objects) {

        this.objects.update(
            deltaTime
        );
    }

    // ========================================
    // PLAYER
    // ========================================

    if (this.player) {

        this.player.update(
            deltaTime
        );
    }

    // ========================================
    // ENEMY MANAGER
    // ========================================

    if (this.enemyManager) {

        this.enemyManager.update(
            deltaTime
        );
    }
}

// ========================================
// DESTROY
// ========================================

destroy() {

    // ========================================
    // ENEMY MANAGER
    // ========================================

    if (this.enemyManager) {

        this.enemyManager.destroy();

        this.enemyManager = null;
    }

    // ========================================
    // PLAYER
    // ========================================

    if (this.player) {

        this.player.destroy();

        this.player = null;
    }

    // ========================================
    // PLAYABLE MAP
    // ========================================

    if (this.playableMap) {

        this.playableMap.destroy();

        this.playableMap = null;
    }

    // ========================================
    // COLLISION
    // ========================================

    if (this.collision) {

        this.collision.clear();
    }

    this.isReady = false;

    console.log(
        "[WORLD] Destroyed"
    );
}

}

