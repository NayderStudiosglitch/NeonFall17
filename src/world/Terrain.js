import * as THREE from "../../node_modules/three/build/three.module.js";

export class Terrain {

    constructor(scene) {

        this.scene = scene;
        this.mesh = null;
        this.loadedTerrain = null;

        console.log(
            "[TERRAIN] AAA terrain system created"
        );
    }

    initialize() {

        // ========================================
        // HIGH DETAIL TERRAIN
        // ========================================

        const size = 300;
        const segments = 80;

        const geometry =
            new THREE.PlaneGeometry(
                size,
                size,
                segments,
                segments
            );

        // ========================================
        // VERTEX COLORS
        // ========================================

        const colors = [];

        const baseGrass =
            new THREE.Color(0x394238);

        const darkGrass =
            new THREE.Color(0x252c27);

        const lightGrass =
            new THREE.Color(0x56604a);

        const dirt =
            new THREE.Color(0x51493c);

        const color =
            new THREE.Color();

        const position =
            geometry.attributes.position;

        for (
            let i = 0;
            i < position.count;
            i++
        ) {

            const x =
                position.getX(i);

            const z =
                position.getY(i);

            // Deterministic terrain variation
            const noise =
                (
                    Math.sin(x * 0.075) +
                    Math.cos(z * 0.061) +
                    Math.sin(
                        (x + z) * 0.035
                    )
                ) / 3;

            if (noise > 0.35) {

                color.copy(
                    lightGrass
                );

            } else if (noise < -0.35) {

                color.copy(
                    darkGrass
                );

            } else if (
                Math.abs(noise) < 0.08
            ) {

                color.copy(
                    dirt
                );

            } else {

                color.copy(
                    baseGrass
                );
            }

            colors.push(
                color.r,
                color.g,
                color.b
            );
        }

        geometry.setAttribute(
            "color",
            new THREE.Float32BufferAttribute(
                colors,
                3
            )
        );

        // ========================================
        // MATERIAL
        // ========================================

        const material =
    new THREE.MeshStandardMaterial({
        color: 0x3f4a3a,
        roughness: 0.95,
        metalness: 0,
        side: THREE.DoubleSide
    });

        // ========================================
        // TERRAIN MESH
        // ========================================

        this.mesh =
            new THREE.Mesh(
                geometry,
                material
            );

        this.mesh.rotation.x =
            -Math.PI / 2;

        this.mesh.position.y = 0;

        this.mesh.receiveShadow =
            true;

        this.mesh.name =
            "NeonFall17_Terrain";

        this.scene.add(
            this.mesh
        );

        console.log(
            "[TERRAIN] AAA visual terrain ready"
        );
    }

    // ========================================
    // EXTERNAL BLENDER TERRAIN
    // ========================================

    setTerrain(model) {

        if (
            this.loadedTerrain
        ) {

            this.scene.remove(
                this.loadedTerrain
            );
        }

        this.loadedTerrain =
            model;

        this.scene.add(
            model
        );

        console.log(
            "[TERRAIN] Blender terrain loaded into world"
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

            if (
                this.mesh.geometry
            ) {

                this.mesh.geometry.dispose();
            }

            if (
                this.mesh.material
            ) {

                this.mesh.material.dispose();
            }

            this.mesh = null;
        }

        if (
            this.loadedTerrain
        ) {

            this.scene.remove(
                this.loadedTerrain
            );

            this.loadedTerrain = null;
        }

        console.log(
            "[TERRAIN] Destroyed"
        );
    }
}


