import * as THREE from "../../node_modules/three/build/three.module.js";

export class Enemy {

    constructor(
        scene,
        player = null,
        x = 0,
        y = 0,
        z = -20
    ) {

        this.scene = scene;
        this.player = player;

        // ========================================
        // HEALTH
        // ========================================

        this.maxHealth = 100;
        this.health = this.maxHealth;

        this.isDead = false;

        // ========================================
        // AI SETTINGS
        // ========================================

        this.detectionRange = 15;
        this.attackRange = 2;

        this.moveSpeed = 2.5;

        this.attackDamage = 10;
        this.attackCooldown = 1.0;
        this.attackTimer = 0;

        this.state = "IDLE";

        // ========================================
        // ENEMY MESH
        // ========================================

        this.mesh =
            new THREE.Group();

        this.mesh.name =
            "Enemy";

        this.mesh.userData.isEnemy =
            true;

        this.mesh.userData.enemy =
            this;

        const bodyGeometry =
            new THREE.CapsuleGeometry(
                0.45,
                1.2,
                8,
                16
            );

        const bodyMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xff3030
            });

        this.body =
            new THREE.Mesh(
                bodyGeometry,
                bodyMaterial
            );

        this.body.position.y =
            1.1;

        this.body.castShadow =
            true;

        this.body.userData.isEnemy =
            true;

        this.body.userData.enemy =
            this;

        this.mesh.add(
            this.body
        );

        this.mesh.position.set(
            x,
            y,
            z
        );

        this.scene.add(
            this.mesh
        );

        console.log(
            `[ENEMY] Spawned at ${x}, ${y}, ${z}`
        );

        console.log(
            `[ENEMY] Health: ${this.health}/${this.maxHealth}`
        );

        console.log(
            "[ENEMY AI] IDLE"
        );
    }

    // ========================================
    // DAMAGE
    // ========================================

    takeDamage(amount) {

        if (
            this.isDead ||
            typeof amount !== "number" ||
            amount <= 0
        ) {
            return;
        }

        this.health =
            Math.max(
                0,
                this.health - amount
            );

        console.log(
            `[ENEMY] DAMAGE: ${amount} | HEALTH: ${this.health}/${this.maxHealth}`
        );

        if (
            this.health <= 0
        ) {

            this.die();
        }
    }

    // ========================================
    // DETECT PLAYER
    // ========================================

    detectPlayer() {

        if (
            !this.player ||
            !this.player.mesh
        ) {
            return false;
        }

        if (
            this.player.state &&
            !this.player.state.isAlive
        ) {
            return false;
        }

        const distance =
            this.mesh.position.distanceTo(
                this.player.mesh.position
            );

        return (
            distance <=
            this.detectionRange
        );
    }

    // ========================================
    // MOVE TO PLAYER
    // ========================================

    chasePlayer(deltaTime) {

        if (
            !this.player ||
            !this.player.mesh
        ) {
            return;
        }

        const direction =
            new THREE.Vector3()
                .subVectors(
                    this.player.mesh.position,
                    this.mesh.position
                );

        direction.y = 0;

        const distance =
            direction.length();

        if (distance <= 0.001) {
            return;
        }

        direction.normalize();

        this.mesh.position.x +=
            direction.x *
            this.moveSpeed *
            deltaTime;

        this.mesh.position.z +=
            direction.z *
            this.moveSpeed *
            deltaTime;

        this.mesh.lookAt(
            this.player.mesh.position.x,
            this.mesh.position.y,
            this.player.mesh.position.z
        );
    }

    // ========================================
    // ATTACK PLAYER
    // ========================================

    attack(deltaTime) {

        if (
            !this.player ||
            !this.player.state
        ) {
            return;
        }

        this.attackTimer -=
            deltaTime;

        if (
            this.attackTimer > 0
        ) {
            return;
        }

        this.player.state.takeDamage(
            this.attackDamage
        );

        this.attackTimer =
            this.attackCooldown;

        console.log(
            `[ENEMY AI] ATTACK | PLAYER HEALTH: ${this.player.state.health}/${this.player.state.maxHealth}`
        );
    }

    // ========================================
    // AI UPDATE
    // ========================================

    update(deltaTime) {

        if (
            this.isDead
        ) {
            return;
        }

        if (
            !this.player ||
            !this.player.mesh
        ) {
            this.state = "IDLE";
            return;
        }

        const distance =
            this.mesh.position.distanceTo(
                this.player.mesh.position
            );

        // ====================================
        // IDLE
        // ====================================

        if (
            distance >
            this.detectionRange
        ) {

            this.state = "IDLE";

            return;
        }

        // ====================================
        // ATTACK
        // ====================================

        if (
            distance <=
            this.attackRange
        ) {

            this.state = "ATTACK";

            this.attack(
                deltaTime
            );

            return;
        }

        // ====================================
        // CHASE
        // ====================================

        this.state = "CHASE";

        this.chasePlayer(
            deltaTime
        );
    }

    // ========================================
    // DEATH
    // ========================================

    die() {

        if (
            this.isDead
        ) {
            return;
        }

        this.isDead = true;

        this.health = 0;

        this.state = "DEAD";

        if (
            this.mesh
        ) {

            this.mesh.visible =
                false;
        }

        console.log(
            "[ENEMY] DEFEATED"
        );
    }

    // ========================================
    // DESTROY
    // ========================================

    destroy() {

        if (
            this.mesh
        ) {

            this.scene.remove(
                this.mesh
            );
        }

        this.mesh = null;

        this.player = null;

        console.log(
            "[ENEMY] Destroyed"
        );
    }
}

