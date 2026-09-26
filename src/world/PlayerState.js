export class PlayerState {
    constructor() {
        // ========================================
        // HEALTH
        // ========================================

        this.maxHealth = 100;
        this.health = this.maxHealth;

        // ========================================
        // PLAYER STATE
        // ========================================

        this.isAlive = true;
        this.isDead = false;

        // ========================================
        // RESPAWN
        // ========================================

        this.spawnPoint = {
            x: 0,
            y: 0,
            z: 8
        };

        console.log("[PLAYER STATE] System created");
        console.log(
            `[PLAYER STATE] Health: ${this.health}/${this.maxHealth}`
        );
    }

    // ========================================
    // DAMAGE
    // ========================================

    takeDamage(amount) {
        if (!this.isAlive) {
            return;
        }

        if (amount <= 0) {
            return;
        }

        this.health -= amount;

        if (this.health < 0) {
            this.health = 0;
        }

        console.log(
            `[PLAYER STATE] Damage: ${amount}`
        );

        console.log(
            `[PLAYER STATE] Health: ${this.health}/${this.maxHealth}`
        );

        if (this.health <= 0) {
            this.die();
        }
    }

    // ========================================
    // HEAL
    // ========================================

    heal(amount) {
        if (!this.isAlive) {
            return;
        }

        if (amount <= 0) {
            return;
        }

        this.health += amount;

        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }

        console.log(
            `[PLAYER STATE] Healed: ${amount}`
        );

        console.log(
            `[PLAYER STATE] Health: ${this.health}/${this.maxHealth}`
        );
    }

    // ========================================
    // DIE
    // ========================================

    die() {
        if (this.isDead) {
            return;
        }

        this.health = 0;
        this.isAlive = false;
        this.isDead = true;

        console.log("[PLAYER STATE] PLAYER DEAD");
    }

    // ========================================
    // RESPAWN
    // ========================================

    respawn() {
        this.health = this.maxHealth;

        this.isAlive = true;
        this.isDead = false;

        console.log("[PLAYER STATE] PLAYER RESPAWNED");

        console.log(
            `[PLAYER STATE] Health: ${this.health}/${this.maxHealth}`
        );
    }

    // ========================================
    // SET SPAWN POINT
    // ========================================

    setSpawnPoint(x, y, z) {
        this.spawnPoint.x = x;
        this.spawnPoint.y = y;
        this.spawnPoint.z = z;

        console.log(
            `[PLAYER STATE] Spawn point: ${x}, ${y}, ${z}`
        );
    }

    // ========================================
    // GET STATE
    // ========================================

    getState() {
        return {
            health: this.health,
            maxHealth: this.maxHealth,
            isAlive: this.isAlive,
            isDead: this.isDead,
            spawnPoint: {
                x: this.spawnPoint.x,
                y: this.spawnPoint.y,
                z: this.spawnPoint.z
            }
        };
    }
}

