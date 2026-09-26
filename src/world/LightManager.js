import * as THREE from "../../node_modules/three/build/three.module.js";

export class LightManager {
    constructor(scene) {
        this.scene = scene;
        this.lights = {};
    }

    initialize() {
        this.lights.ambient = new THREE.AmbientLight(
            0xffffff,
            0.35
        );

        this.lights.sun = new THREE.DirectionalLight(
            0xffffff,
            1.2
        );

        this.lights.sun.position.set(30, 50, 20);
        this.lights.sun.castShadow = true;

        this.scene.add(this.lights.ambient);
        this.scene.add(this.lights.sun);

        console.log("[LIGHTS] World lighting initialized");
    }

    setDay() {
        this.lights.ambient.intensity = 0.6;
        this.lights.sun.intensity = 1.5;

        console.log("[LIGHTS] Day mode");
    }

    setNight() {
        this.lights.ambient.intensity = 0.08;
        this.lights.sun.intensity = 0.15;

        console.log("[LIGHTS] Night mode");
    }
}
