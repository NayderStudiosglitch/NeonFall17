export class CollisionManager {

    constructor() {
        this.colliders = new Map();

        console.log("[COLLISION] System created");
    }

    // ========================================
    // REGISTER COLLIDER
    // ========================================

    register(id, collider) {
        if (!id || !collider) return false;

        if (!collider.min || !collider.max) {
            console.warn(
                `[COLLISION] Invalid collider: ${id}`
            );
            return false;
        }

        this.colliders.set(id, collider);

        console.log(
            `[COLLISION] Registered: ${id}`
        );

        return true;
    }

    // ========================================
    // REMOVE COLLIDER
    // ========================================

    unregister(id) {
        if (!this.colliders.has(id)) {
            return false;
        }

        this.colliders.delete(id);

        console.log(
            `[COLLISION] Removed: ${id}`
        );

        return true;
    }

    // ========================================
    // GET COLLIDER
    // ========================================

    get(id) {
        return this.colliders.get(id) || null;
    }

    // ========================================
    // PLAYER COLLISION
    // ========================================

    resolvePlayerPosition(position, radius = 0.45) {

        if (!position) return;

        // Ground
        if (position.y < 0) {
            position.y = 0;
        }

        for (const collider of this.colliders.values()) {

            if (!collider.min || !collider.max) {
                continue;
            }

            const closestX = Math.max(
                collider.min.x,
                Math.min(position.x, collider.max.x)
            );

            const closestY = Math.max(
                collider.min.y,
                Math.min(position.y, collider.max.y)
            );

            const closestZ = Math.max(
                collider.min.z,
                Math.min(position.z, collider.max.z)
            );

            const dx =
                position.x - closestX;

            const dy =
                position.y - closestY;

            const dz =
                position.z - closestZ;

            const distanceSquared =
                dx * dx +
                dy * dy +
                dz * dz;

            if (distanceSquared < radius * radius) {

                // ====================================
                // SIDE COLLISION
                // ====================================

                const pushLeft =
                    Math.abs(
                        position.x - collider.min.x
                    );

                const pushRight =
                    Math.abs(
                        collider.max.x - position.x
                    );

                const pushFront =
                    Math.abs(
                        position.z - collider.min.z
                    );

                const pushBack =
                    Math.abs(
                        collider.max.z - position.z
                    );

                const smallest =
                    Math.min(
                        pushLeft,
                        pushRight,
                        pushFront,
                        pushBack
                    );

                if (smallest === pushLeft) {

                    position.x =
                        collider.min.x - radius;

                } else if (smallest === pushRight) {

                    position.x =
                        collider.max.x + radius;

                } else if (smallest === pushFront) {

                    position.z =
                        collider.min.z - radius;

                } else {

                    position.z =
                        collider.max.z + radius;
                }
            }
        }
    }

    // ========================================
    // CLEAR ALL
    // ========================================

    clear() {
        this.colliders.clear();

        console.log(
            "[COLLISION] All colliders cleared"
        );
    }

    // ========================================
    // STATS
    // ========================================

    getStats() {
        return {
            total: this.colliders.size
        };
    }
}

