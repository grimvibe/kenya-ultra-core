import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = new Map();

// Wrap any promise so it can never hang forever
function withTimeout(promise, ms, label) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
        ),
    ]);
}

async function loadCommands() {

    commands.clear();

    const files = fs
        .readdirSync(__dirname)
        .filter(file =>
            file.endsWith(".js") &&
            file !== "index.js"
        );

    for (const file of files) {

        try {

            const importUrl =
                pathToFileURL(path.join(__dirname, file)).href +
                `?update=${Date.now()}`;

            // If a command file hangs on import (e.g. DB connect at module
            // scope), this will time out instead of freezing the whole app.
            const module = await withTimeout(
                import(importUrl),
                8000,
                `import(${file})`
            );

            const command = module.default;

            if (!command?.name || typeof command.execute !== "function") {
                console.warn(`⚠️ Skipping invalid command: ${file}`);
                continue;
            }

            commands.set(command.name.toLowerCase(), command);

            console.log(`✅ Loaded command: ${command.name}`);

        } catch (err) {

            console.error(`❌ Failed to load ${file}`);
            console.error(err);

        }

    }

    console.log(`🚀 ${commands.size} command(s) loaded.`);

}

export function getCommand(name) {
    return commands.get(name.toLowerCase());
}

export function getCommands() {
    return [...commands.values()];
}

export default commands;

try {
    await withTimeout(loadCommands(), 20000, "loadCommands()");
} catch (err) {
    console.error("❌ loadCommands() failed or hung:", err.message);
    // Don't let the app boot in a broken half-loaded state
    process.exit(1);
}
