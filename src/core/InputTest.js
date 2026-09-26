import { InputSystem } from "./InputSystem.js";

const input = new InputSystem();

console.log("=== NEON FALL 17 INPUT SYSTEM TEST ===");

input.pressKey("W");
input.pressKey("SHIFT");

console.log("Movement:", input.getMovement());
console.log("Sprint:", input.isKeyDown("SHIFT"));

input.releaseKey("W");
input.releaseKey("SHIFT");

input.pressKey("N");
console.log("Nuclear:", input.isKeyDown("N"));

input.releaseKey("N");

input.pressMouse("LEFT_CLICK");
console.log("Shoot:", input.isMouseDown("LEFT_CLICK"));

input.releaseMouse("LEFT_CLICK");

input.pressMouse("RIGHT_CLICK");
console.log("Aim:", input.isMouseDown("RIGHT_CLICK"));

input.releaseMouse("RIGHT_CLICK");

console.log("=== INPUT SYSTEM READY ===");
