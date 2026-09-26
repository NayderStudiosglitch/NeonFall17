import * as THREE from "./node_modules/three/build/three.module.js";

import { World } from "./src/world/World.js";
import { WorldRuntime } from "./src/world/WorldRuntime.js";

// ========================================
// NEON FALL 17
// RENDERER
// WORLD + CAMERA + PLAYER + GAME LOOP
// ========================================

console.log("================================");
console.log("NEON FALL 17");
console.log("WORLD <-> RENDERER");
console.log("PLAYABLE 3D WORLD");
console.log("================================");

// ========================================
// RENDERER
// ========================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1.5)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.shadowMap.enabled = true;

document.body.style.margin = "0";
document.body.style.overflow = "hidden";

document.body.appendChild(
    renderer.domElement
);

console.log("[RENDERER] ONLINE");

// ========================================
// SCENE
// ========================================

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x18222b);

console.log("[SCENE] READY");

// ========================================
// FPS CAMERA
// ========================================

const camera =
    new THREE.PerspectiveCamera(
        75,
        window.innerWidth /
            window.innerHeight,
        0.1,
        1000
    );

camera.position.set(
    0,
    1.6,
    8
);

console.log("[CAMERA] READY");

// ========================================
// WORLD
// ========================================

const world =
    new World(
        scene,
        camera
    );

world.initialize();

console.log(
    "[WORLD ENGINE] CONNECTED"
);

// ========================================
// WORLD RUNTIME
// ========================================

const worldRuntime =
    new WorldRuntime(world);

worldRuntime.start();

console.log(
    "[WORLD RUNTIME] ONLINE"
);

// ========================================
// GAME LOOP
// ========================================

let lastTime =
    performance.now();

function gameLoop(currentTime) {

    const deltaTime =
        Math.min(
            (currentTime - lastTime) / 1000,
            0.1
        );

    lastTime = currentTime;

    // ------------------------------
    // WORLD UPDATE
    // ------------------------------

    world.update(
        deltaTime
    );

    // ------------------------------
    // RENDER
    // ------------------------------

    renderer.render(
        scene,
        camera
    );

    requestAnimationFrame(
        gameLoop
    );
}

// ========================================
// START GAME LOOP
// ========================================

requestAnimationFrame(
    gameLoop
);

console.log(
    "[GAME LOOP] STARTED"
);

// ========================================
// RESIZE
// ========================================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        console.log(
            "[WINDOW] RESIZED"
        );
    }
);

// ========================================
// CLEANUP
// ========================================

window.addEventListener(
    "beforeunload",
    () => {

        if (worldRuntime) {
            worldRuntime.stop?.();
        }

        world.destroy?.();

        renderer.dispose();

        console.log(
            "[NEON FALL 17] SHUTDOWN"
        );
    }
);

console.log(
    "[NEON FALL 17] PLAYABLE WORLD READY"
);

