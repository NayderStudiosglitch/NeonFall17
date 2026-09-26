import * as THREE from "../../node_modules/three/build/three.module.js";
import { BuildingGenerator } from "./BuildingGenerator.js";

export class PlayableMap {

    constructor(scene, collision = null) {

        this.scene = scene;
        this.collision = collision;

        this.objects = [];

        this.buildings = null;

        console.log(
            "[MAP] Playable map system created"
        );
    }

    // ========================================
    // INITIALIZE
    // ========================================

    initialize() {

        console.log(
            "[MAP] Building Neon Fall 17 playable world..."
        );

        this.createEnvironment();
        this.createTerrain();
        this.createRoads();
        this.createWater();
        this.createHarbor();
        this.createCity();
        this.createLighting();
        this.createFog();

        console.log(
            "[MAP] Terrain ready"
        );

        console.log(
            "[MAP] Roads ready"
        );

        console.log(
            "[MAP] Harbor ready"
        );

        console.log(
            "[MAP] City ready"
        );

        console.log(
            "[MAP] PLAYABLE MAP ONLINE"
        );
    }

    // ========================================
    // ENVIRONMENT
    // ========================================

    createEnvironment() {

        this.scene.background =
            new THREE.Color(
                0x2c3540
            );
    }

    // ========================================
    // TERRAIN
    // ========================================

    createTerrain() {

        // Terrain foundation comes from Terrain.js.
        // Keep this method for map compatibility.

        console.log(
            "[MAP] Using AAA terrain foundation"
        );
    }

    // ========================================
    // ROADS
    // ========================================

    createRoads() {

        const roadMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x25282b,
                roughness: 0.92,
                metalness: 0.02
            });

        // Main street
        const mainRoad =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    18,
                    0.08,
                    180
                ),
                roadMaterial
            );

        mainRoad.position.set(
            0,
            0.04,
            0
        );

        mainRoad.name =
            "MainStreet";

        mainRoad.receiveShadow =
            true;

        this.scene.add(
            mainRoad
        );

        this.objects.push(
            mainRoad
        );

        // Cross street
        const crossRoad =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    180,
                    0.08,
                    18
                ),
                roadMaterial
            );

        crossRoad.position.set(
            0,
            0.05,
            -20
        );

        crossRoad.name =
            "CrossStreet";

        crossRoad.receiveShadow =
            true;

        this.scene.add(
            crossRoad
        );

        this.objects.push(
            crossRoad
        );
    }

    // ========================================
    // WATER
    // ========================================

    createWater() {

        const waterMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x16404d,
                roughness: 0.25,
                metalness: 0.3
            });

        const water =
            new THREE.Mesh(
                new THREE.PlaneGeometry(
                    110,
                    220
                ),
                waterMaterial
            );

        water.rotation.x =
            -Math.PI / 2;

        water.position.set(
            55,
            0.02,
            0
        );

        water.name =
            "HarborWater";

        water.receiveShadow =
            true;

        this.scene.add(
            water
        );

        this.objects.push(
            water
        );
    }

    // ========================================
    // HARBOR
    // ========================================

    createHarbor() {

        const dockMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x4a4842,
                roughness: 0.88
            });

        const dock =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    10,
                    0.7,
                    100
                ),
                dockMaterial
            );

        dock.position.set(
            25,
            0.35,
            0
        );

        dock.name =
            "MainHarborDock";

        dock.castShadow =
            true;

        dock.receiveShadow =
            true;

        this.scene.add(
            dock
        );

        this.objects.push(
            dock
        );

        this.registerBoxCollider(
            "MainHarborDock",
            dock
        );

        // Containers
        for (
            let i = 0;
            i < 12;
            i++
        ) {

            const material =
                new THREE.MeshStandardMaterial({
                    color:
                        i % 2 === 0
                            ? 0x3d4548
                            : 0x51483e,
                    roughness: 0.82
                });

            const container =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        3,
                        2.5,
                        6
                    ),
                    material
                );

            container.position.set(
                18 +
                    (i % 3) *
                    4,

                1.25,

                -35 +
                    Math.floor(
                        i / 3
                    ) *
                    12
            );

            container.name =
                `HarborContainer_${i}`;

            container.castShadow =
                true;

            container.receiveShadow =
                true;

            this.scene.add(
                container
            );

            this.objects.push(
                container
            );

            this.registerBoxCollider(
                container.name,
                container
            );
        }
    }

    // ========================================
    // CITY
    // ========================================

    createCity() {

        this.buildings =
            new BuildingGenerator(
                this.scene,
                this.collision
            );

        const buildings = [

            [-30, -55, 16, 16, 8, 0],
            [-30, -25, 18, 16, 10, 1],
            [-30, 10, 16, 18, 7, 2],
            [-30, 45, 20, 16, 9, 3],

            [30000, -55555, 200,2999, 99, 499],
            [1000, +222225, 17838, 1988886, 9997, 995],
            [500, 10, 16, 18, 11, 6],
            [100, 45, 20, 16, 8, 7],

            [-55, -40, 20, 20, 11, 8],
            [-55, 5, 22, 20, 8, 9],
            [-55, 45, 20, 20, 12, 10]
        ];

        buildings.forEach(
            (
                data,
                index
            ) => {

                const [
                    x,
                    z,
                    width,
                    depth,
                    floors,
                    style
                ] = data;

                this.buildings.createBuilding({
                    id:
                        `CityBuilding_${index}`,

                    x,
                    z,

                    width,
                    depth,

                    floors,

                    style
                });
            }
        );

        console.log(
            `[MAP] Procedural AAA buildings created: ${buildings.length}`
        );
    }

    // ========================================
    // COLLISION
    // ========================================

    registerBoxCollider(
        id,
        mesh
    ) {

        if (!this.collision) {

            console.warn(
                `[MAP] No collision system for ${id}`
            );

            return;
        }

        mesh.updateMatrixWorld(
            true
        );

        const box =
            new THREE.Box3()
                .setFromObject(
                    mesh
                );

        this.collision.register(
            id,
            {
                min:
                    box.min.clone(),

                max:
                    box.max.clone()
            }
        );
    }

    // ========================================
    // LIGHTING
    // ========================================

    createLighting() {

        const sun =
            new THREE.DirectionalLight(
                0xdbe3ed,
                0.9
            );

        sun.position.set(
            50,
            100,
            50
        );

        sun.castShadow =
            true;

        sun.shadow.mapSize.width =
            1024;

        sun.shadow.mapSize.height =
            1024;

        sun.shadow.camera.near =
            0.5;

        sun.shadow.camera.far =
            250;

        const d = 120;

        sun.shadow.camera.left =
            -d;

        sun.shadow.camera.right =
            d;

        sun.shadow.camera.top =
            d;

        sun.shadow.camera.bottom =
            -d;

        sun.shadow.bias =
            -0.0005;

        this.scene.add(
            sun
        );

        const ambient =
            new THREE.HemisphereLight(
                0x8da9bb,
                0x202020,
                1.1
            );

        this.scene.add(
            ambient
        );
    }

    // ========================================
    // FOG
    // ========================================

    createFog() {

        this.scene.fog =
            new THREE.FogExp2(
                0x2c3540,
                0.008
            );
    }

    // ========================================
    // UPDATE
    // ========================================

    update(deltaTime) {

        // Future world/map events.
    }

    // ========================================
    // DESTROY
    // ========================================

    destroy() {

        if (
            this.collision
        ) {

            for (
                const object
                of this.objects
            ) {

                if (
                    object.name
                ) {

                    this.collision
                        .unregister(
                            object.name
                        );
                }
            }
        }

        for (
            const object
            of this.objects
        ) {

            this.scene.remove(
                object
            );

            if (
                object.geometry
            ) {

                object.geometry.dispose();
            }

            if (
                object.material
            ) {

                object.material.dispose();
            }
        }

        this.objects = [];

        console.log(
            "[MAP] Playable map destroyed"
        );
    }
}
