export class HUD {

    constructor(
        player,
        enemyManager = null
    ) {

        this.player =
            player;

        this.enemyManager =
            enemyManager;

        this.container = null;

        this.crosshair = null;
        this.ammo = null;
        this.weaponName = null;
        this.status = null;

        this.healthContainer = null;
        this.healthBar = null;
        this.healthText = null;

        this.waveText = null;

        this.create();

        console.log(
            "[HUD] FPS HUD created"
        );
    }

    // ========================================
    // CREATE HUD
    // ========================================

    create() {

        const container =
            document.createElement("div");

        container.id =
            "neon-hud";

        container.style.position =
            "fixed";

        container.style.left =
            "0";

        container.style.top =
            "0";

        container.style.width =
            "100%";

        container.style.height =
            "100%";

        container.style.pointerEvents =
            "none";

        container.style.zIndex =
            "100";

        // ====================================
        // CROSSHAIR
        // ====================================

        const crosshair =
            document.createElement("div");

        crosshair.textContent =
            "+";

        crosshair.style.position =
            "absolute";

        crosshair.style.left =
            "50%";

        crosshair.style.top =
            "50%";

        crosshair.style.transform =
            "translate(-50%, -50%)";

        crosshair.style.color =
            "white";

        crosshair.style.fontFamily =
            "Arial";

        crosshair.style.fontSize =
            "28px";

        crosshair.style.fontWeight =
            "bold";

        crosshair.style.textShadow =
            "0 0 6px black";

        this.crosshair =
            crosshair;

        container.appendChild(
            crosshair
        );

        // ====================================
        // AMMO
        // ====================================

        const ammo =
            document.createElement("div");

        ammo.style.position =
            "absolute";

        ammo.style.right =
            "35px";

        ammo.style.bottom =
            "30px";

        ammo.style.color =
            "white";

        ammo.style.fontFamily =
            "Arial";

        ammo.style.fontSize =
            "32px";

        ammo.style.fontWeight =
            "bold";

        ammo.style.textShadow =
            "0 0 8px black";

        this.ammo =
            ammo;

        container.appendChild(
            ammo
        );

        // ====================================
        // WEAPON NAME
        // ====================================

        const weaponName =
            document.createElement("div");

        weaponName.style.position =
            "absolute";

        weaponName.style.right =
            "38px";

        weaponName.style.bottom =
            "70px";

        weaponName.style.color =
            "#bfc7cc";

        weaponName.style.fontFamily =
            "Arial";

        weaponName.style.fontSize =
            "14px";

        weaponName.style.letterSpacing =
            "2px";

        this.weaponName =
            weaponName;

        container.appendChild(
            weaponName
        );

        // ====================================
        // STATUS
        // ====================================

        const status =
            document.createElement("div");

        status.style.position =
            "absolute";

        status.style.left =
            "50%";

        status.style.top =
            "58%";

        status.style.transform =
            "translateX(-50%)";

        status.style.color =
            "white";

        status.style.fontFamily =
            "Arial";

        status.style.fontSize =
            "18px";

        status.style.fontWeight =
            "bold";

        status.style.textShadow =
            "0 0 8px black";

        this.status =
            status;

        container.appendChild(
            status
        );

        // ====================================
        // HEALTH CONTAINER
        // ====================================

        const healthContainer =
            document.createElement("div");

        healthContainer.style.position =
            "absolute";

        healthContainer.style.left =
            "35px";

        healthContainer.style.bottom =
            "30px";

        healthContainer.style.width =
            "240px";

        healthContainer.style.height =
            "22px";

        healthContainer.style.background =
            "rgba(0, 0, 0, 0.65)";

        healthContainer.style.border =
            "2px solid white";

        healthContainer.style.boxSizing =
            "border-box";

        this.healthContainer =
            healthContainer;

        container.appendChild(
            healthContainer
        );

        // ====================================
        // HEALTH BAR
        // ====================================

        const healthBar =
            document.createElement("div");

        healthBar.style.width =
            "100%";

        healthBar.style.height =
            "100%";

        healthBar.style.background =
            "#20d060";

        healthBar.style.transition =
            "width 0.15s ease";

        this.healthBar =
            healthBar;

        healthContainer.appendChild(
            healthBar
        );

        // ====================================
        // HEALTH TEXT
        // ====================================

        const healthText =
            document.createElement("div");

        healthText.style.position =
            "absolute";

        healthText.style.left =
            "35px";

        healthText.style.bottom =
            "57px";

        healthText.style.color =
            "white";

        healthText.style.fontFamily =
            "Arial";

        healthText.style.fontSize =
            "18px";

        healthText.style.fontWeight =
            "bold";

        healthText.style.textShadow =
            "0 0 6px black";

        this.healthText =
            healthText;

        container.appendChild(
            healthText
        );

        // ====================================
        // WAVE TEXT
        // ====================================

        const waveText =
            document.createElement("div");

        waveText.style.position =
            "absolute";

        waveText.style.top =
            "30px";

        waveText.style.left =
            "50%";

        waveText.style.transform =
            "translateX(-50%)";

        waveText.style.color =
            "white";

        waveText.style.fontFamily =
            "Arial";

        waveText.style.fontSize =
            "20px";

        waveText.style.fontWeight =
            "bold";

        waveText.style.textAlign =
            "center";

        waveText.style.textShadow =
            "0 0 8px black";

        this.waveText =
            waveText;

        container.appendChild(
            waveText
        );

        document.body.appendChild(
            container
        );

        this.container =
            container;
    }

    // ========================================
    // UPDATE
    // ========================================

    update() {

        // ====================================
        // WEAPON HUD
        // ====================================

        if (
            this.player &&
            this.player.weaponManager
        ) {

            const stats =
                this.player.weaponManager
                    .getCurrentWeaponStats();

            if (stats) {

                this.ammo.textContent =
                    stats.ammo +
                    " / " +
                    stats.reserveAmmo;

                this.weaponName.textContent =
                    stats.name;

                if (
                    stats.isReloading
                ) {

                    this.status.textContent =
                        "RELOADING...";

                } else if (
                    stats.isAiming
                ) {

                    this.status.textContent =
                        "AIM";

                } else {

                    this.status.textContent =
                        "";
                }

                if (
                    stats.ammo <= 0 &&
                    stats.reserveAmmo <= 0
                ) {

                    this.status.textContent =
                        "EMPTY";
                }
            }
        }

        // ====================================
        // PLAYER HEALTH
        // ====================================

        if (
            this.player &&
            this.player.state
        ) {

            const health =
                this.player.state.health;

            const maxHealth =
                this.player.state.maxHealth;

            const healthPercent =
                maxHealth > 0
                    ? (health / maxHealth) * 100
                    : 0;

            this.healthBar.style.width =
                healthPercent + "%";

            this.healthText.textContent =
                "HP " +
                health +
                " / " +
                maxHealth;

            if (
                healthPercent <= 25
            ) {

                this.healthBar.style.background =
                    "#ff3030";

            } else if (
                healthPercent <= 50
            ) {

                this.healthBar.style.background =
                    "#f0b020";

            } else {

                this.healthBar.style.background =
                    "#20d060";
            }

            if (
                this.player.state.isDead
            ) {

                const seconds =
                    Math.max(
                        0,
                        Math.ceil(
                            this.player.respawnTimer
                        )
                    );

                this.status.textContent =
                    "PLAYER DOWN - RESPAWN " +
                    seconds;
            }
        }

        // ====================================
        // WAVE HUD
        // ====================================

        if (
            this.enemyManager
        ) {

            const wave =
                this.enemyManager.getState();

            if (
                wave.waiting
            ) {

                this.waveText.textContent =
                    "WAVE " +
                    wave.wave +
                    " CLEARED";

                this.status.textContent =
                    "NEXT WAVE IN " +
                    Math.ceil(
                        wave.nextWaveIn
                    );

            } else {

                this.waveText.textContent =
                    "WAVE " +
                    wave.wave +
                    "\nENEMIES: " +
                    wave.activeEnemies;
            }
        }
    }

    // ========================================
    // DESTROY
    // ========================================

    destroy() {

        if (
            this.container
        ) {

            this.container.remove();

            this.container = null;
        }

        console.log(
            "[HUD] FPS HUD destroyed"
        );
    }
}

