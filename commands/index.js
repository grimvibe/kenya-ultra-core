import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

import commands, {
    registerCommand
} from "./commandStore.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function withTimeout(promise, ms, label) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(
                () => reject(new Error(`${label} timed out after ${ms}ms`)),
                ms
            )
        ),
    ]);
}

// Recursively collect all command files
function getCommandFiles(dir) {

    let files = [];

    const entries = fs.readdirSync(dir, {
        withFileTypes: true
    });

    for (const entry of entries) {

        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {

            files.push(...getCommandFiles(fullPath));

        } else if (
            entry.name.endsWith(".js") &&
            entry.name !== "index.js" &&
            entry.name !== "commandStore.js"
        ) {

            files.push(fullPath);

        }

    }

    return files;

}

async function loadCommands() {

    commands.clear();

    const files = getCommandFiles(__dirname);

    for (const file of files) {

        try {

            const importUrl =
                pathToFileURL(file).href +
                `?update=${Date.now()}`;

            const module = await withTimeout(
                import(importUrl),
                8000,
                `import(${path.basename(file)})`
            );

            const command = module.default;

            if (
                !command?.name ||
                typeof command.execute !== "function"
            ) {

                console.warn(
                    `⚠️ Skipping invalid command: ${path.relative(__dirname, file)}`
                );

                continue;

            }

            registerCommand(command);

            console.log(
                `✅ Loaded command: ${command.name} (${path.relative(__dirname, file)})`
            );

        } catch (err) {

            console.error(
                `❌ Failed to load ${path.relative(__dirname, file)}`
            );

            console.error(err);

        }

    }

    console.log(
        `🚀 ${commands.size} command(s) loaded.`
    );

}

export {
    getCommand,
    getCommands,
    getCategories,
    getStatistics,
    getManifest
} from "./commandStore.js";

export default commands;

try {

    await withTimeout(
        loadCommands(),
        20000,
        "loadCommands()"
    );

} catch (err) {

    console.error(
        "❌ loadCommands() failed or hung:",
        err.message
    );

    process.exit(1);

}
