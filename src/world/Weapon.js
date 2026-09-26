import * as THREE from "../../node_modules/three/build/three.module.js";

export class Weapon {

    constructor(name = "CustomWeapon") {

        this.name = name;

        // ========================================
        // WEAPON SETTINGS
        // ========================================

        this.damage = 25;

        this.fireRate = 8;

        this.magazineSize = 30;

        this.ammo = this.magazineSize;

        this.reserveAmmo = 90;

        this.range = 500;

        // ========================================
        // STATE
        // ========================================

        this.isEquipped = false;

        this.isAiming = false;

        this.isReloading = false;

        this.lastFireTime = 0;

        // ========================================
        // PLACEHOLDER WEAPON
        // ========================================

        this.mesh = new THREE.Group();

        this.mesh.name = this.name;

        const bodyGeometry =
            new THREE.BoxGeometry(
                0.18,
                0.18,
                0.8
            );

        const bodyMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x222222
            });

        const body =
            new THREE.Mesh(
                bodyGeometry,
                bodyMaterial
            );

        body.position.z = -0.4;

        this.mesh.add(body);

        console.log(
            `[WEAPON] ${this.name} created`
        );
    }

    // ========================================
    // EQUIP
    // ========================================

    equip(parent) {

        if (this.isEquipped) {
            return;
        }

        parent.add(this.mesh);

        this.mesh.position.set(
            0.35,
            -0.3,
            -0.7
        );

        this.mesh.rotation.set(
            0,
            0,
            0
        );

        this.isEquipped = true;

        console.log(
            `[WEAPON] ${this.name} equipped`
        );
    }

    // ========================================
    // AIM
    // ========================================

    aim(enabled) {

        if (!this.isEquipped) {
            return;
        }

        this.isAiming = enabled;

        console.log(
            `[WEAPON] AIM: ${
                enabled ? "ON" : "OFF"
            }`
        );
    }

    // ========================================
    // FIRE
    // ========================================

    fire(currentTime = performance.now()) {

        if (!this.isEquipped) {
            return false;
        }

        if (this.isReloading) {
            return false;
        }

        if (this.ammo <= 0) {

            console.log(
                "[WEAPON] MAGAZINE EMPTY"
            );

            return false;
        }

        const fireInterval =
            1000 / this.fireRate;

        if (
            currentTime -
            this.lastFireTime <
            fireInterval
        ) {
            return false;
        }

        this.lastFireTime =
            currentTime;

        this.ammo--;

        console.log(
            `[WEAPON] FIRE | Ammo: ${this.ammo}/${this.reserveAmmo}`
        );

        return true;
    }

    // ========================================
    // RELOAD
    // ========================================

    reload() {

        if (this.isReloading) {
            return;
        }

        if (
            this.ammo >=
            this.magazineSize
        ) {
            return;
        }

        if (this.reserveAmmo <= 0) {

            console.log(
                "[WEAPON] NO RESERVE AMMO"
            );

            return;
        }

        this.isReloading = true;

        const needed =
            this.magazineSize -
            this.ammo;

        const amount =
            Math.min(
                needed,
                this.reserveAmmo
            );

        this.ammo += amount;

        this.reserveAmmo -= amount;

        this.isReloading = false;

        console.log(
            `[WEAPON] RELOADED | Ammo: ${this.ammo}/${this.reserveAmmo}`
        );
    }

    // ========================================
    // UNEQUIP
    // ========================================

    unequip() {

        if (!this.isEquipped) {
            return;
        }

        if (this.mesh.parent) {
            this.mesh.parent.remove(
                this.mesh
            );
        }

        this.isEquipped = false;

        this.isAiming = false;

        console.log(
            `[WEAPON] ${this.name} unequipped`
        );
    }

    // ========================================
    // STATS
    // ========================================

    getStats() {

        return {
            name: this.name,
            damage: this.damage,
            fireRate: this.fireRate,
            magazineSize: this.magazineSize,
            ammo: this.ammo,
            reserveAmmo: this.reserveAmmo,
            range: this.range,
            isEquipped: this.isEquipped,
            isAiming: this.isAiming,
            isReloading: this.isReloading
        };
    }

    // ========================================
    // DESTROY
    // ========================================

    destroy() {

        if (this.mesh.parent) {
            this.mesh.parent.remove(
                this.mesh
            );
        }

        this.mesh = null;

        console.log(
            `[WEAPON] ${this.name} destroyed`
        );
    }
}

