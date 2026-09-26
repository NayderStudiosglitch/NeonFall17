import * as THREE from "../../node_modules/three/build/three.module.js";
import { World } from "../world/World.js";

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x182733);
scene.fog = new THREE.Fog(0x182733, 80, 300);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 2, 8);

const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: "high-performance"
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(1);

document.body.style.margin = "0";
document.body.style.overflow = "hidden";

document.body.appendChild(renderer.domElement);

const sun = new THREE.DirectionalLight(
    0xffffff,
    2
);

sun.position.set(
    -50,
    100,
    40
);

scene.add(sun);

const ambient = new THREE.HemisphereLight(
    0x9db7c8,
    0x202020,
    1.5
);

scene.add(ambient);

const world = new World(
    scene,
    camera
);

world.initialize();

console.log("[RENDERER] WORLD INITIALIZED");

function animate() {

    requestAnimationFrame(animate);

    world.update(1 / 60);

    renderer.render(
        scene,
        camera
    );
}

animate();

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
    }
);

console.log(
    "[NEON FALL 17] RENDERER ONLINE"
);

