export class BlenderAssetLoader {
    constructor(scene) {
        this.scene = scene;

        this.assets = new Map();
        this.cache = new Map();

        console.log("[BLENDER] Asset Loader initialized");
    }

    register(name, path, type) {
        this.assets.set(name, {
            name,
            path,
            type,
            loaded: false
        });

        console.log(`[BLENDER] Registered: ${name}`);
    }

    async load(name) {
        const asset = this.assets.get(name);

        if (!asset) {
            console.error(`[BLENDER] Asset not registered: ${name}`);
            return null;
        }

        if (this.cache.has(name)) {
            console.log(`[BLENDER] Cache hit: ${name}`);
            return this.cache.get(name);
        }

        console.log(`[BLENDER] Loading: ${asset.path}`);

        /*
         * GLB/GLTF loading will be connected
         * to the Three.js GLTFLoader in the renderer layer.
         *
         * For now this creates the engine-side
         * asset record and cache entry.
         */

        const loadedAsset = {
            name: asset.name,
            path: asset.path,
            type: asset.type
        };

        asset.loaded = true;

        this.cache.set(name, loadedAsset);

        console.log(`[BLENDER] Loaded: ${name}`);

        return loadedAsset;
    }

    unload(name) {
        if (!this.cache.has(name)) {
            console.log(`[BLENDER] Not loaded: ${name}`);
            return;
        }

        this.cache.delete(name);

        const asset = this.assets.get(name);

        if (asset) {
            asset.loaded = false;
        }

        console.log(`[BLENDER] Unloaded: ${name}`);
    }

    getStats() {
        let loaded = 0;

        for (const asset of this.assets.values()) {
            if (asset.loaded) {
                loaded++;
            }
        }

        return {
            total: this.assets.size,
            loaded,
            cached: this.cache.size,
            unloaded: this.assets.size - loaded
        };
    }
}
