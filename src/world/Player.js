import * as THREE from "../../node_modules/three/build/three.module.js";
import { PlayerState } from "./PlayerState.js";
import { WeaponManager } from "./WeaponManager.js";

export class Player {

    constructor(scene, camera = null, collision = null) {

        this.scene = scene;
        this.camera = camera;
        this.collision = collision;

        // ========================================
        // PLAYER STATE
        // ========================================

        this.state = new PlayerState();

        // ========================================
        // RESPAWN SYSTEM
        // ========================================

        this.respawnDelay = 3;
        this.respawnTimer = 0;

        // ========================================
        // MOVEMENT
        // ========================================

        this.walkSpeed = 5;
        this.sprintSpeed = 10;

        this.jumpForce = 8;
        this.gravity = 22;

        this.velocity =
            new THREE.Vector3();

        this.isGrounded = true;
        this.isSprinting = false;

        // ========================================
        // FPS CAMERA
        // ========================================

        this.eyeHeight = 1.6;

        this.mouseSensitivity = 0.0025;

        this.yaw = 0;
        this.pitch = 0;

        this.pitchLimit =
            THREE.MathUtils.degToRad(89);

        this.mouseLocked = false;

        // ========================================
        // INPUT
        // ========================================

        this.keys = {

            forward: false,
            backward: false,
            left: false,
            right: false,

            sprint: false,
            jump: false
        };

        // ========================================
        // PLAYER OBJECT
        // ========================================

        this.mesh =
            new THREE.Group();

        this.mesh.name =
            "PlayerEntity";

        this.mesh.userData.isPlayer =
            true;

        // ========================================
        // PLAYER BODY
        // ========================================

        const bodyGeometry =
            new THREE.CapsuleGeometry(
                0.45,
                1.2,
                8,
                16
            );

        const bodyMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x00ffff
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

        this.body.userData.isPlayer =
            true;

        this.mesh.add(
            this.body
        );

        this.scene.add(
            this.mesh
        );

        // ========================================
        // WEAPON MANAGER
        // ========================================

        this.weaponManager = null;

        if (this.camera) {

            this.weaponManager =
                new WeaponManager(
                    this
                );

            this.weaponManager
                .createDefaultWeapon();

            this.weaponManager.equip(
                "CustomWeapon"
            );

            const weapon =
                this.weaponManager
                    .getCurrentWeapon();

            if (
                weapon &&
                weapon.mesh
            ) {

                if (
                    weapon.mesh.parent
                ) {

                    weapon.mesh.parent.remove(
                        weapon.mesh
                    );
                }

                this.camera.add(
                    weapon.mesh
                );

                weapon.mesh.position.set(
                    0.35,
                    -0.30,
                    -0.70
                );

                weapon.mesh.rotation.set(
                    0,
                    0,
                    0
                );

                console.log(
                    "[WEAPON] FPS weapon attached to camera"
                );
            }
        }

        // ========================================
        // EVENTS
        // ========================================

        this.bindKeyboard();

        this.bindMouse();

        console.log(
            "[PLAYER] Entity created"
        );

        console.log(
            "[FPS] Camera system ready"
        );

        console.log(
            "[FPS] Mouse look ready"
        );

        console.log(
            "[WEAPON] Weapon system ready"
        );

        console.log(
            "[COLLISION] Player collision ready"
        );
    }

    // ========================================
    // KEYBOARD
    // ========================================

    bindKeyboard() {

        this.handleKeyDown =
            (event) => {

                if (
                    this.state.isDead
                ) {
                    return;
                }

                switch (event.code) {

                    case "KeyW":
                        this.keys.forward = true;
                        break;

                    case "KeyS":
                        this.keys.backward = true;
                        break;

                    case "KeyA":
                        this.keys.left = true;
                        break;

                    case "KeyD":
                        this.keys.right = true;
                        break;

                    case "ShiftLeft":
                    case "ShiftRight":
                        this.keys.sprint = true;
                        break;

                    case "Space":

                        event.preventDefault();

                        this.keys.jump = true;

                        break;

                    case "KeyR":

                        if (
                            this.weaponManager
                        ) {

                            this.weaponManager
                                .reload();
                        }

                        break;

                    case "Escape":

                        this.unlockMouse();

                        break;
                }
            };

        this.handleKeyUp =
            (event) => {

                switch (event.code) {

                    case "KeyW":
                        this.keys.forward = false;
                        break;

                    case "KeyS":
                        this.keys.backward = false;
                        break;

                    case "KeyA":
                        this.keys.left = false;
                        break;

                    case "KeyD":
                        this.keys.right = false;
                        break;

                    case "ShiftLeft":
                    case "ShiftRight":
                        this.keys.sprint = false;
                        break;

                    case "Space":
                        this.keys.jump = false;
                        break;
                }
            };

        window.addEventListener(
            "keydown",
            this.handleKeyDown
        );

        window.addEventListener(
            "keyup",
            this.handleKeyUp
        );
    }

    // ========================================
    // MOUSE
    // ========================================

    bindMouse() {

        this.handleMouseDown =
            (event) => {

                if (
                    this.state.isDead
                ) {
                    return;
                }

                if (event.button === 0) {

                    if (!this.mouseLocked) {

                        this.lockMouse();

                        return;
                    }

                    if (
                        this.weaponManager
                    ) {

                        this.weaponManager
                            .fire();
                    }
                }

                if (event.button === 2) {

                    if (
                        this.weaponManager
                    ) {

                        this.weaponManager
                            .aim(true);
                    }
                }
            };

        this.handleMouseUp =
            (event) => {

                if (
                    event.button === 2 &&
                    this.weaponManager
                ) {

                    this.weaponManager
                        .aim(false);
                }
            };

        this.handleMouseMove =
            (event) => {

                if (
                    !this.mouseLocked ||
                    this.state.isDead
                ) {
                    return;
                }

                this.yaw -=
                    event.movementX *
                    this.mouseSensitivity;

                this.pitch -=
                    event.movementY *
                    this.mouseSensitivity;

                this.pitch =
                    THREE.MathUtils.clamp(
                        this.pitch,
                        -this.pitchLimit,
                        this.pitchLimit
                    );

                this.updateCameraRotation();
            };

        this.handlePointerLockChange =
            () => {

                this.mouseLocked =
                    document.pointerLockElement ===
                    document.body;

                console.log(
                    `[FPS] Mouse lock: ${
                        this.mouseLocked
                            ? "ON"
                            : "OFF"
                    }`
                );
            };

        this.handleContextMenu =
            (event) => {

                event.preventDefault();
            };

        window.addEventListener(
            "mousedown",
            this.handleMouseDown
        );

        window.addEventListener(
            "mouseup",
            this.handleMouseUp
        );

        window.addEventListener(
            "mousemove",
            this.handleMouseMove
        );

        document.addEventListener(
            "pointerlockchange",
            this.handlePointerLockChange
        );

        window.addEventListener(
            "contextmenu",
            this.handleContextMenu
        );
    }

    // ========================================
    // LOCK MOUSE
    // ========================================

    lockMouse() {

        if (
            document.pointerLockElement !==
            document.body
        ) {

            document.body.requestPointerLock();
        }
    }

    // ========================================
    // UNLOCK MOUSE
    // ========================================

    unlockMouse() {

        if (
            document.pointerLockElement
        ) {

            document.exitPointerLock();
        }
    }

    // ========================================
    // CAMERA ROTATION
    // ========================================

    updateCameraRotation() {

        if (!this.camera) {
            return;
        }

        this.camera.rotation.order =
            "YXZ";

        this.camera.rotation.y =
            this.yaw;

        this.camera.rotation.x =
            this.pitch;
    }

    // ========================================
    // CAMERA POSITION
    // ========================================

    updateCamera() {

        if (!this.camera) {
            return;
        }

        this.camera.position.set(
            this.mesh.position.x,
            this.mesh.position.y +
                this.eyeHeight,
            this.mesh.position.z
        );

        this.updateCameraRotation();
    }

    // ========================================
    // MOVEMENT
    // ========================================

    updateMovement(deltaTime) {

        if (
            this.state.isDead
        ) {
            return;
        }

        const direction =
            new THREE.Vector3();

        if (
            this.keys.forward
        ) {
            direction.z -= 1;
        }

        if (
            this.keys.backward
        ) {
            direction.z += 1;
        }

        if (
            this.keys.left
        ) {
            direction.x -= 1;
        }

        if (
            this.keys.right
        ) {
            direction.x += 1;
        }

        if (
            direction.lengthSq() > 0
        ) {
            direction.normalize();
        }

        const movement =
            new THREE.Vector3(
                direction.x,
                0,
                direction.z
            );

        movement.applyAxisAngle(
            new THREE.Vector3(
                0,
                1,
                0
            ),
            this.yaw
        );

        this.isSprinting =
            this.keys.sprint &&
            movement.lengthSq() > 0;

        const speed =
            this.isSprinting
                ? this.sprintSpeed
                : this.walkSpeed;

        this.velocity.x =
            movement.x *
            speed;

        this.velocity.z =
            movement.z *
            speed;

        if (
            this.keys.jump &&
            this.isGrounded
        ) {

            this.velocity.y =
                this.jumpForce;

            this.isGrounded =
                false;

            this.keys.jump =
                false;
        }

        if (
            !this.isGrounded
        ) {

            this.velocity.y -=
                this.gravity *
                deltaTime;
        }

        this.mesh.position.x +=
            this.velocity.x *
            deltaTime;

        this.mesh.position.y +=
            this.velocity.y *
            deltaTime;

        this.mesh.position.z +=
            this.velocity.z *
            deltaTime;
    }

    // ========================================
    // COLLISION
    // ========================================

    updateCollision() {

        if (
            this.state.isDead
        ) {
            return;
        }

        if (!this.collision) {

            if (
                this.mesh.position.y < 0
            ) {

                this.mesh.position.y = 0;

                this.velocity.y = 0;

                this.isGrounded = true;
            }

            return;
        }

        const radius =
            0.45;

        this.collision
            .resolvePlayerPosition(
                this.mesh.position,
                radius
            );

        if (
            this.mesh.position.y <= 0
        ) {

            this.mesh.position.y = 0;

            this.velocity.y = 0;

            this.isGrounded = true;

        } else {

            this.isGrounded = false;
        }
    }

    // ========================================
    // DEATH / RESPAWN
    // ========================================

    updateRespawn(deltaTime) {

        if (
            !this.state.isDead
        ) {
            return;
        }

        this.velocity.set(
            0,
            0,
            0
        );

        this.keys.forward = false;
        this.keys.backward = false;
        this.keys.left = false;
        this.keys.right = false;
        this.keys.sprint = false;
        this.keys.jump = false;

        if (
            this.mouseLocked
        ) {
            this.unlockMouse();
        }

        this.respawnTimer -=
            deltaTime;

        if (
            this.respawnTimer > 0
        ) {
            return;
        }

        const spawn =
            this.state.spawnPoint;

        this.state.respawn();

        this.mesh.position.set(
            spawn.x,
            spawn.y,
            spawn.z
        );

        this.velocity.set(
            0,
            0,
            0
        );

        this.isGrounded = true;

        this.updateCamera();

        console.log(
            "[PLAYER] RESPAWN COMPLETE"
        );
    }

    checkDeath() {

        if (
            this.state.isDead &&
            this.respawnTimer <= 0
        ) {

            this.respawnTimer =
                this.respawnDelay;

            console.log(
                `[PLAYER] RESPawn in ${this.respawnDelay} seconds`
            );
        }
    }

    // ========================================
    // MAIN UPDATE
    // ========================================

    update(deltaTime) {

        if (
            this.state.isDead
        ) {

            this.checkDeath();

            this.updateRespawn(
                deltaTime
            );

            this.updateCamera();

            return;
        }

        this.updateMovement(
            deltaTime
        );

        this.updateCollision();

        this.updateCamera();

        if (
            this.weaponManager
        ) {

            this.weaponManager.update(
                deltaTime
            );
        }

        if (
            this.state.isDead
        ) {

            this.checkDeath();
        }
    }

    // ========================================
    // SPAWN
    // ========================================

    spawn(
        x = 0,
        y = 0,
        z = 70
    ) {

        this.state.setSpawnPoint(
            x,
            y,
            z
        );

        this.mesh.position.set(
            x,
            y,
            z
        );

        this.velocity.set(
            0,
            0,
            0
        );

        this.isGrounded = true;

        this.respawnTimer = 0;

        this.updateCamera();

        console.log(
            `[PLAYER] Spawned at ${x}, ${y}, ${z}`
        );
    }

    // ========================================
    // DESTROY
    // ========================================

    destroy() {

        window.removeEventListener(
            "keydown",
            this.handleKeyDown
        );

        window.removeEventListener(
            "keyup",
            this.handleKeyUp
        );

        window.removeEventListener(
            "mousedown",
            this.handleMouseDown
        );

        window.removeEventListener(
            "mouseup",
            this.handleMouseUp
        );

        window.removeEventListener(
            "mousemove",
            this.handleMouseMove
        );

        document.removeEventListener(
            "pointerlockchange",
            this.handlePointerLockChange
        );

        window.removeEventListener(
            "contextmenu",
            this.handleContextMenu
        );

        if (
            this.weaponManager
        ) {

            this.weaponManager.destroy();

            this.weaponManager = null;
        }

        if (
            this.mesh
        ) {

            this.scene.remove(
                this.mesh
            );
        }

        console.log(
            "[PLAYER] Destroyed"
        );
    }
}

