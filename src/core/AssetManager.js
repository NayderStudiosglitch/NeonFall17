import { Logger } from "./Logger.js";

export class AssetManager {
    constructor() {
        this.assets = new Map();
        this.loading = new Map();
    }

    register(name, path, type = "model") {
        if (this.assets.has(name)) {
            Logger.warning(`Asset already registered: ${name}`);
            return false;
        }

        this.assets.set(name, {
            name,
            path,
            type,
            loaded: false,
            data: null
        });

        Logger.info(`Asset registered: ${name}`);
        return true;
    }

    async load(name) {
        const asset = this.assets.get(name);

        if (!asset) {
            Logger.error(`Asset not found: ${name}`);
            return null;
        }

        if (asset.loaded) {
            Logger.info(`Asset loaded from cache: ${name}`);
            return asset.data;
        }

        if (this.loading.has(name)) {
            return this.loading.get(name);
        }

        const loadingPromise = this.loadAsset(asset);

        this.loading.set(name, loadingPromise);

        try {
            const data = await loadingPromise;

            asset.data = data;
            asset.loaded = true;

            Logger.info(`Asset loaded: ${name}`);

            return data;
        } finally {
            this.loading.delete(name);
        }
    }

    async loadAsset(asset) {
        /*
         * Foundation only.
         *
         * Real GLB/FBX/texture loading will be connected
         * when the 3D renderer is added.
         */

        return {
            name: asset.name,
            path: asset.path,
            type: asset.type
        };
    }

    get(name) {
        const asset = this.assets.get(name);

        if (!asset || !asset.loaded) {
            return null;
        }

        return asset.data;
    }

    unload(name) {
        const asset = this.assets.get(name);

        if (!asset) {
            Logger.warning(`Cannot unload missing asset: ${name}`);
            return false;
        }

        asset.data = null;
        asset.loaded = false;

        Logger.info(`Asset unloaded: ${name}`);

        return true;
    }

    remove(name) {
        if (!this.assets.has(name)) {
            return false;
        }

        this.unload(name);
        this.assets.delete(name);

        Logger.info(`Asset removed: ${name}`);

        return true;
    }

    clear() {
        for (const name of this.assets.keys()) {
            this.unload(name);
        }

        this.assets.clear();

        Logger.info("Asset Manager cleared");
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
            unloaded: this.assets.size - loaded
        };
    }
}
