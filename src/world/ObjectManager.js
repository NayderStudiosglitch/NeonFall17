export class ObjectManager {
    constructor(scene) {
        this.scene = scene;
        this.objects = new Map();
    }

    add(name, object) {
        this.objects.set(name, object);
        this.scene.add(object);

        console.log(`[OBJECT] Added: ${name}`);
    }

    get(name) {
        return this.objects.get(name);
    }

    remove(name) {
        const object = this.objects.get(name);

        if (!object) return false;

        this.scene.remove(object);
        this.objects.delete(name);

        console.log(`[OBJECT] Removed: ${name}`);

        return true;
    }

    update(deltaTime) {
        for (const object of this.objects.values()) {
            if (typeof object.update === "function") {
                object.update(deltaTime);
            }
        }
    }

    get count() {
        return this.objects.size;
    }
}
