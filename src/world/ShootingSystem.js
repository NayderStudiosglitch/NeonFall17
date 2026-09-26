import * as THREE from "../../node_modules/three/build/three.module.js";

export class ShootingSystem {

    constructor(camera, scene) {

        this.camera = camera;
        this.scene = scene;

        this.raycaster =
            new THREE.Raycaster();

        this.range = 500;

        console.log(
            "[SHOOTING] Raycast system created"
        );
    }

    // ========================================
    // FIND ENEMY FROM HIT
    // ========================================

    findEnemy(object) {

        let current =
            object;

        while (current) {

            if (
                current.userData &&
                current.userData.enemy
            ) {

                return current.userData.enemy;
            }

            current =
                current.parent;
        }

        return null;
    }

    // ========================================
    // FIRE RAYCAST
    // ========================================

    fire(damage = 25) {

        if (!this.camera) {

            console.warn(
                "[SHOOTING] Camera not available"
            );

            return null;
        }

        if (!this.scene) {

            console.warn(
                "[SHOOTING] Scene not available"
            );

            return null;
        }

        const screenCenter =
            new THREE.Vector2(0, 0);

        this.raycaster.setFromCamera(
            screenCenter,
            this.camera
        );

        const hits =
            this.raycaster.intersectObjects(
                this.scene.children,
                true
            );

        const validHit =
            hits.find(
                hit => {

                    if (!hit.object) {
                        return false;
                    }

                    if (
                        !hit.object.visible
                    ) {
                        return false;
                    }

                    if (
                        hit.distance >
                        this.range
                    ) {
                        return false;
                    }

                    if (
                        hit.object.userData &&
                        hit.object.userData.isPlayer
                    ) {
                        return false;
                    }

                    return true;
                }
            );

        // ========================================
        // HIT
        // ========================================

        if (validHit) {

            console.log(
                `[SHOOTING] HIT: ${
                    validHit.object.name ||
                    "Unnamed Object"
                }`
            );

            console.log(
                `[SHOOTING] Distance: ${
                    validHit.distance.toFixed(2)
                }`
            );

            const enemy =
                this.findEnemy(
                    validHit.object
                );

            if (enemy) {

                console.log(
                    "[SHOOTING] ENEMY TARGET"
                );

                enemy.takeDamage(
                    damage
                );
            }

            return validHit;
        }

        // ========================================
        // MISS
        // ========================================

        console.log(
            "[SHOOTING] MISS"
        );

        return null;
    }

    // ========================================
    // RANGE
    // ========================================

    setRange(range) {

        if (
            typeof range !== "number" ||
            range <= 0
        ) {

            console.warn(
                "[SHOOTING] Invalid range"
            );

            return;
        }

        this.range =
            range;

        console.log(
            `[SHOOTING] Range: ${range}`
        );
    }

    // ========================================
    // DESTROY
    // ========================================

    destroy() {

        this.raycaster = null;
        this.camera = null;
        this.scene = null;

        console.log(
            "[SHOOTING] Raycast system destroyed"
        );
    }
}

