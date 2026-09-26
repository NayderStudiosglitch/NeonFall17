import { Enemy } from "./Enemy.js";

export class EnemyManager {

    constructor(scene, player) {

        this.scene = scene;
        this.player = player;

        this.enemies = [];

        // ========================================
        // WAVE SYSTEM
        // ========================================

        this.currentWave = 0;

        this.waveEnemyCount = 3;

        this.waveIncrease = 2;

        this.maxActiveEnemies = 8;

        this.waveDelay = 3;

        this.waveTimer = 0;

        this.isWaitingForNextWave = false;

        console.log(
            "[ENEMY MANAGER] System created"
        );
    }

    // ========================================
    // START
    // ========================================

    start() {

        if (this.currentWave > 0) {
            return;
        }

        this.startNextWave();
    }

    // ========================================
    // COMPATIBILITY START
    // ========================================

    spawnInitialEnemies() {

        this.start();
    }

    // ========================================
    // START NEXT WAVE
    // ========================================

    startNextWave() {

        this.currentWave++;

        this.waveEnemyCount =
            3 +
            (
                (this.currentWave - 1) *
                this.waveIncrease
            );

        console.log(
            `[ENEMY WAVE] WAVE ${this.currentWave}`
        );

        console.log(
            `[ENEMY WAVE] Enemies: ${this.waveEnemyCount}`
        );

        this.spawnWave(
            this.waveEnemyCount
        );
    }

    // ========================================
    // SPAWN WAVE
    // ========================================

    spawnWave(count) {

        const spawnPoints = [

            { x: 0, y: 0, z: -20 },
            { x: -8, y: 0, z: -24 },
            { x: 8, y: 0, z: -24 },
            { x: -5, y: 0, z: -32 },
            { x: 5, y: 0, z: -32 },
            { x: -10, y: 0, z: -36 },
            { x: 10, y: 0, z: -36 },
            { x: 0, y: 0, z: -42 },
            { x: -14, y: 0, z: -30 },
            { x: 14, y: 0, z: -30 }
        ];

        for (
            let i = 0;
            i < count;
            i++
        ) {

            if (
                this.enemies.length >=
                this.maxActiveEnemies
            ) {
                break;
            }

            const point =
                spawnPoints[
                    i % spawnPoints.length
                ];

            this.spawnEnemy(
                point.x,
                point.y,
                point.z
            );
        }

        console.log(
            `[ENEMY WAVE] Active enemies: ${this.enemies.length}`
        );

        this.isWaitingForNextWave = false;
    }

    // ========================================
    // SPAWN SINGLE ENEMY
    // ========================================

    spawnEnemy(
        x = 0,
        y = 0,
        z = -20
    ) {

        if (!this.player) {

            console.warn(
                "[ENEMY MANAGER] Player not available"
            );

            return null;
        }

        if (
            this.enemies.length >=
            this.maxActiveEnemies
        ) {

            console.warn(
                "[ENEMY MANAGER] Maximum active enemies reached"
            );

            return null;
        }

        const enemy =
            new Enemy(
                this.scene,
                this.player,
                x,
                y,
                z
            );

        this.enemies.push(
            enemy
        );

        console.log(
            `[ENEMY MANAGER] Enemy #${this.enemies.length} spawned`
        );

        return enemy;
    }

    // ========================================
    // UPDATE
    // ========================================

    update(deltaTime) {

        for (
            const enemy
            of this.enemies
        ) {

            if (!enemy) {
                continue;
            }

            enemy.update(
                deltaTime
            );
        }

        this.removeDefeatedEnemies();

        // ====================================
        // START NEXT WAVE TIMER
        // ====================================

        if (
            this.enemies.length === 0 &&
            this.currentWave > 0 &&
            !this.isWaitingForNextWave
        ) {

            this.isWaitingForNextWave = true;

            this.waveTimer =
                this.waveDelay;

            console.log(
                `[ENEMY WAVE] WAVE ${this.currentWave} CLEARED`
            );

            console.log(
                `[ENEMY WAVE] Next wave in ${this.waveDelay}s`
            );
        }

        // ====================================
        // COUNTDOWN
        // ====================================

        if (
            this.isWaitingForNextWave
        ) {

            this.waveTimer -=
                deltaTime;

            if (
                this.waveTimer <= 0
            ) {

                this.startNextWave();
            }
        }
    }

    // ========================================
    // REMOVE DEFEATED ENEMIES
    // ========================================

    removeDefeatedEnemies() {

        for (
            let i =
                this.enemies.length - 1;
            i >= 0;
            i--
        ) {

            const enemy =
                this.enemies[i];

            if (
                !enemy ||
                enemy.isDead
            ) {

                if (enemy) {

                    enemy.destroy();
                }

                this.enemies.splice(
                    i,
                    1
                );

                console.log(
                    "[ENEMY MANAGER] Defeated enemy removed"
                );
            }
        }
    }

    // ========================================
    // GET ACTIVE COUNT
    // ========================================

    getActiveCount() {

        return this.enemies.length;
    }

    // ========================================
    // GET CURRENT WAVE
    // ========================================

    getCurrentWave() {

        return this.currentWave;
    }

    // ========================================
    // GET WAVE TIMER
    // ========================================

    getWaveTimer() {

        return Math.max(
            0,
            this.waveTimer
        );
    }

    // ========================================
    // GET STATE
    // ========================================

    getState() {

        return {
            wave:
                this.currentWave,

            activeEnemies:
                this.enemies.length,

            waiting:
                this.isWaitingForNextWave,

            nextWaveIn:
                this.getWaveTimer()
        };
    }

    // ========================================
    // GET ENEMIES
    // ========================================

    getEnemies() {

        return this.enemies;
    }

    // ========================================
    // DESTROY
    // ========================================

    destroy() {

        for (
            const enemy
            of this.enemies
        ) {

            if (enemy) {

                enemy.destroy();
            }
        }

        this.enemies = [];

        console.log(
            "[ENEMY MANAGER] Destroyed"
        );
    }
}

