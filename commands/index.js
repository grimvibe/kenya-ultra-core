import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = new Map();

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

            const module = await import(
                pathToFileURL(path.join(__dirname, file)).href +
                `?update=${Date.now()}`
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

await loadCommands();
