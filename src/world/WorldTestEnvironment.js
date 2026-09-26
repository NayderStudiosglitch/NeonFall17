import * as THREE from "../../node_modules/three/build/three.module.js";

export class WorldTestEnvironment {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;

        this.environment = new THREE.Group();
        this.environment.name = "NeonFall17_WorldTestEnvironment";

        this.objects = [];
    }

    initialize() {
        console.log("[WORLD TEST] Building test environment...");

        this.createTerrain();
        this.createBuildings();
        this.createTrees();
        this.createRocks();
        this.createLights();

        this.scene.add(this.environment);

        console.log("[WORLD TEST] Terrain: ONLINE");
        console.log("[WORLD TEST] Buildings: ONLINE");
        console.log("[WORLD TEST] Trees: ONLINE");
        console.log("[WORLD TEST] Rocks: ONLINE");
        console.log("[WORLD TEST] Dynamic Lights: ONLINE");
        console.log("[WORLD TEST] Collision objects: READY");
        console.log("[WORLD TEST] ENVIRONMENT ONLINE");
    }

    createTerrain() {
        const geometry = new THREE.PlaneGeometry(200, 200, 32, 32);

        const material = new THREE.MeshStandardMaterial({
            color: 0x252b2f,
            roughness: 1.0
        });

        const terrain = new THREE.Mesh(geometry, material);

        terrain.rotation.x = -Math.PI / 2;
        terrain.position.y = -1;
        terrain.receiveShadow = true;
        terrain.name = "TEST_TERRAIN";

        this.environment.add(terrain);
        this.objects.push(terrain);
    }

    createBuildings() {
        const positions = [
            [-25, 5, -20],
            [20, 7, -25],
            [35, 4, 10],
            [-35, 6, 20]
        ];

        for (let i = 0; i < positions.length; i++) {
            const geometry = new THREE.BoxGeometry(
                12,
                positions[i][1] * 2,
                10
            );

            const material = new THREE.MeshStandardMaterial({
                color: 0x3b4145,
                roughness: 0.85,
                metalness: 0.1
            });

            const building = new THREE.Mesh(geometry, material);

            building.position.set(
                positions[i][0],
                positions[i][1] - 1,
                positions[i][2]
            );

            building.castShadow = true;
            building.receiveShadow = true;
            building.name = `TEST_BUILDING_${i + 1}`;

            this.environment.add(building);
            this.objects.push(building);

            this.world.collision.add(
                building.name,
                building
            );
        }
    }

    createTrees() {
        const treePositions = [
            [-10, 0, -35],
            [0, 0, -42],
            [12, 0, -38],
            [45, 0, -15],
            [-45, 0, -10],
            [42, 0, 25],
            [-42, 0, 35],
            [5, 0, 35]
        ];

        for (let i = 0; i < treePositions.length; i++) {
            const tree = new THREE.Group();
            tree.name = `TEST_TREE_${i + 1}`;

            const trunkGeometry = new THREE.CylinderGeometry(
                0.7,
                1.0,
                6,
                8
            );

            const trunkMaterial = new THREE.MeshStandardMaterial({
                color: 0x3a2920
            });

            const trunk = new THREE.Mesh(
                trunkGeometry,
                trunkMaterial
            );

            trunk.position.y = 2;

            const leavesGeometry = new THREE.ConeGeometry(
                4,
                9,
                8
            );

            const leavesMaterial = new THREE.MeshStandardMaterial({
                color: 0x17251d,
                roughness: 1
            });

            const leaves = new THREE.Mesh(
                leavesGeometry,
                leavesMaterial
            );

            leaves.position.y = 8;

            tree.add(trunk);
            tree.add(leaves);

            tree.position.set(
                treePositions[i][0],
                0,
                treePositions[i][2]
            );

            trunk.castShadow = true;
            leaves.castShadow = true;

            this.environment.add(tree);
            this.objects.push(tree);
        }
    }

    createRocks() {
        const rockPositions = [
            [-18, 0, 12],
            [-5, 0, 22],
            [18, 0, 18],
            [28, 0, 30],
            [-30, 0, -5],
            [8, 0, -10]
        ];

        for (let i = 0; i < rockPositions.length; i++) {
            const geometry = new THREE.DodecahedronGeometry(
                2 + (i % 3)
            );

            const material = new THREE.MeshStandardMaterial({
                color: 0x55585a,
                roughness: 1
            });

            const rock = new THREE.Mesh(
                geometry,
                material
            );

            rock.position.set(
                rockPositions[i][0],
                1,
                rockPositions[i][2]
            );

            rock.rotation.set(
                Math.random(),
                Math.random(),
                Math.random()
            );

            rock.castShadow = true;
            rock.receiveShadow = true;
            rock.name = `TEST_ROCK_${i + 1}`;

            this.environment.add(rock);
            this.objects.push(rock);
        }
    }

    createLights() {
        const moonLight = new THREE.DirectionalLight(
            0x8fa8ff,
            1.2
        );

        moonLight.position.set(
            -30,
            50,
            20
        );

        moonLight.castShadow = true;
        moonLight.name = "TEST_MOON_LIGHT";

        this.environment.add(moonLight);

        const pointLight = new THREE.PointLight(
            0xff8a35,
            8,
            35
        );

        pointLight.position.set(
            0,
            8,
            0
        );

        pointLight.name = "TEST_DYNAMIC_LIGHT";

        this.environment.add(pointLight);

        console.log("[LIGHTS] Dynamic world lights created");
    }
}
