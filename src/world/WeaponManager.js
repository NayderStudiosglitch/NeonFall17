import { Weapon } from "./Weapon.js";
import { ShootingSystem } from "./ShootingSystem.js";

export class WeaponManager {

    constructor(player) {

        this.player = player;

        this.weapons = new Map();
        this.currentWeapon = null;

        // ========================================
        // SHOOTING SYSTEM
        // ========================================

        this.shooting = new ShootingSystem(
            player.camera,
            player.scene
        );

        console.log("[WEAPON MANAGER] System created");
    }

    // ========================================
    // REGISTER WEAPON
    // ========================================

    registerWeapon(name, weapon) {

        if (!weapon) {
            console.warn(
                `[WEAPON MANAGER] Cannot register empty weapon: ${name}`
            );

            return;
        }

        this.weapons.set(name, weapon);

        console.log(
            `[WEAPON MANAGER] Registered: ${name}`
        );
    }

    // ========================================
    // CREATE DEFAULT WEAPON
    // ========================================

    createDefaultWeapon() {

        const weapon =
            new Weapon("CustomWeapon");

        this.registerWeapon(
            "CustomWeapon",
            weapon
        );

        return weapon;
    }

    // ========================================
    // EQUIP WEAPON
    // ========================================

    equip(name) {

        const weapon =
            this.weapons.get(name);

        if (!weapon) {

            console.warn(
                `[WEAPON MANAGER] Weapon not found: ${name}`
            );

            return false;
        }

        // Unequip previous weapon
        if (this.currentWeapon) {

            this.currentWeapon.unequip();
        }

        this.currentWeapon = weapon;

        // Attach weapon to player
        this.currentWeapon.equip(
            this.player.body
        );

        console.log(
            `[WEAPON MANAGER] Equipped: ${name}`
        );

        return true;
    }

    // ========================================
    // FIRE
    // ========================================

    fire() {

        if (!this.currentWeapon) {

            console.warn(
                "[WEAPON MANAGER] No weapon equipped"
            );

            return false;
        }

        const fired =
            this.currentWeapon.fire();

        if (!fired) {
            return false;
        }

        // Raycast shooting
        this.shooting.fire();

        return true;
    }

    // ========================================
    // AIM
    // ========================================

    aim(enabled) {

        if (!this.currentWeapon) {
            return;
        }

        this.currentWeapon.aim(enabled);
    }

    // ========================================
    // RELOAD
    // ========================================

    reload() {

        if (!this.currentWeapon) {
            return;
        }

        this.currentWeapon.reload();
    }

    // ========================================
    // UPDATE
    // ========================================

    update(deltaTime) {

        if (!this.currentWeapon) {
            return;
        }

        this.currentWeapon.update?.(
            deltaTime
        );
    }

    // ========================================
    // GET CURRENT WEAPON
    // ========================================

    getCurrentWeapon() {

        return this.currentWeapon;
    }

    // ========================================
    // GET WEAPON STATS
    // ========================================

    getCurrentWeaponStats() {

        if (!this.currentWeapon) {
            return null;
        }

        return this.currentWeapon.getStats();
    }

    // ========================================
    // DESTROY
    // ========================================

    destroy() {

        for (const weapon of this.weapons.values()) {

            weapon.destroy();
        }

        this.weapons.clear();

        this.currentWeapon = null;

        console.log(
            "[WEAPON MANAGER] Destroyed"
        );
    }
}

