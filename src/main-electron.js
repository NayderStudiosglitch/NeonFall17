import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// ========================================
// NEON FALL 17 — ELECTRON FOUNDATION
// ========================================

app.commandLine.appendSwitch("use-gl", "angle");
app.commandLine.appendSwitch("use-angle", "swiftshader");
app.commandLine.appendSwitch("disable-gpu-sandbox");
app.commandLine.appendSwitch("enable-unsafe-swiftshader");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_FILE = "/tmp/neonfall17-electron.log";

function log(message) {
    try {
        fs.appendFileSync(
            LOG_FILE,
            String(message) + "\n"
        );
    } catch {
        // Do not write to stdout/stderr.
        // Prevents EPIPE from crashing Electron.
    }
}

let mainWindow = null;

function createWindow() {

    log("========================================");
    log("[ELECTRON] Creating Neon Fall 17 window");

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,

        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    const indexPath = path.join(
        __dirname,
        "renderer",
        "index.html"
    );

    log("[ELECTRON] Loading: " + indexPath);

    mainWindow.loadFile(indexPath)
        .catch((error) => {

            log(
                "[ELECTRON] LOAD ERROR: " +
                error
            );

        });

    mainWindow.webContents.on(
        "did-fail-load",
        (
            event,
            errorCode,
            errorDescription,
            validatedURL
        ) => {

            log(
                "[ELECTRON] did-fail-load | " +
                errorCode +
                " | " +
                errorDescription +
                " | " +
                validatedURL
            );

        }
    );

    mainWindow.webContents.on(
        "render-process-gone",
        (event, details) => {

            log(
                "[ELECTRON] RENDER PROCESS GONE | " +
                JSON.stringify(details)
            );

        }
    );

    mainWindow.webContents.on(
        "console-message",
        (event, level, message, line, sourceId) => {

            log(
                "[RENDERER] " +
                message +
                " | line=" +
                line +
                " | source=" +
                sourceId
            );

        }
    );

    mainWindow.webContents.openDevTools({
        mode: "detach"
    });

    mainWindow.on("closed", () => {

        log("[ELECTRON] Window closed");

        mainWindow = null;

    });

    log("[ELECTRON] Window created");
}

app.whenReady().then(() => {

    // Start a fresh diagnostic log.
    try {
        fs.writeFileSync(
            LOG_FILE,
            ""
        );
    } catch {
        // Ignore log-file errors.
    }

    log("[GRAPHICS] Initializing graphics backend");
    log("[GRAPHICS] ANGLE + SwiftShader enabled");

    createWindow();

    app.on("activate", () => {

        if (
            BrowserWindow.getAllWindows().length === 0
        ) {

            createWindow();

        }

    });

});

app.on("window-all-closed", () => {

    if (process.platform !== "darwin") {
        app.quit();
    }

});

