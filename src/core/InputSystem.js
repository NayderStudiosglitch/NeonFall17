import { INPUTS } from "./InputConfig.js";

export class InputSystem {
    constructor() {
        this.keys = new Set();
        this.mouseButtons = new Set();

        this.mouseDelta = {
            x: 0,
            y: 0
        };

        this.enabled = true;
    }

    pressKey(key) {
        if (!this.enabled) return;

        const normalizedKey = key.toUpperCase();

        this.keys.add(normalizedKey);
        console.log(`[INPUT] KEY DOWN: ${normalizedKey}`);
    }

    releaseKey(key) {
        const normalizedKey = key.toUpperCase();

        this.keys.delete(normalizedKey);
        console.log(`[INPUT] KEY UP: ${normalizedKey}`);
    }

    isKeyDown(key) {
        return this.keys.has(key.toUpperCase());
    }

    pressMouse(button) {
        if (!this.enabled) return;

        this.mouseButtons.add(button);
        console.log(`[INPUT] MOUSE DOWN: ${button}`);
    }

    releaseMouse(button) {
        this.mouseButtons.delete(button);
        console.log(`[INPUT] MOUSE UP: ${button}`);
    }

    isMouseDown(button) {
        return this.mouseButtons.has(button);
    }

    setMouseDelta(x, y) {
        this.mouseDelta.x = x;
        this.mouseDelta.y = y;
    }

    getMovement() {
        return {
            forward: this.isKeyDown(INPUTS.movement.forward),
            backward: this.isKeyDown(INPUTS.movement.backward),
            left: this.isKeyDown(INPUTS.movement.left),
            right: this.isKeyDown(INPUTS.movement.right)
        };
    }

    resetMouseDelta() {
        this.mouseDelta.x = 0;
        this.mouseDelta.y = 0;
    }
}
