import express from "express";
import dotenv from "dotenv";
import chalk from "chalk";
import cors from "cors";
import fs from "fs";
import path from "path";

import pairRouter from "./api/pair.js";
import executeRouter from "./api/execute.js";
import validateRouter from "./api/validate.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// ================================
// Core Information
// ================================

const CORE = {
    name: "Kenya-Ultra Core",
    version: "1.0.0",
    protocol: 1,
    started: Date.now()
};

function countCommands(dir) {
    let total = 0;

    const files = fs.readdirSync(dir);

    for (const file of files) {

        const full = path.join(dir, file);

        if (fs.statSync(full).isDirectory()) {
            total += countCommands(full);
        } else if (file.endsWith(".js")) {
            total++;
        }

    }

    return total;
}

const commandCount = countCommands("./commands");

// ================================
// Existing APIs
// ================================

app.use("/pair", pairRouter);
app.use("/validate", validateRouter);
app.use("/execute", executeRouter);

// ================================
// New Core APIs
// ================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        ...CORE,
        status: "Running",
        endpoints: {
            pair: "/pair",
            validate: "/validate",
            execute: "/execute",
            manifest: "/manifest",
            handshake: "/handshake",
            version: "/version",
            health: "/health"
        }
    });

});

app.get("/manifest", (req, res) => {

    res.json({

        success: true,

        platform: CORE.name,

        version: CORE.version,

        protocol: CORE.protocol,

        commandCount,

        runtime: "Node.js",

        endpoints: {

            pair: "/pair",

            validate: "/validate",

            execute: "/execute"

        }

    });

});

app.get("/version", (req, res) => {

    res.json({

        success: true,

        version: CORE.version,

        protocol: CORE.protocol

    });

});

app.get("/handshake", (req, res) => {

    res.json({

        success: true,

        platform: CORE.name,

        compatible: true,

        protocol: CORE.protocol

    });

});

app.get("/health", (req, res) => {

    res.json({

        success: true,

        uptime: process.uptime(),

        memory: process.memoryUsage(),

        commands: commandCount,

        status: "healthy"

    });

});

// ================================

const PORT = process.env.PORT || 3000;

console.clear();

console.log(chalk.green(`
██╗  ██╗███████╗███╗   ██╗██╗   ██╗ █████╗
██║ ██╔╝██╔════╝████╗  ██║╚██╗ ██╔╝██╔══██╗
█████╔╝ █████╗  ██╔██╗ ██║ ╚████╔╝ ███████║
██╔═██╗ ██╔══╝  ██║╚██╗██║  ╚██╔╝  ██╔══██║
██║  ██╗███████╗██║ ╚████║   ██║   ██║  ██║
╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝
`));

console.log(chalk.green(`${CORE.name}`));
console.log(chalk.gray("Starting services...\n"));

app.listen(PORT, () => {

    console.log(chalk.green(`✓ Core running on port ${PORT}`));
    console.log(chalk.cyan(`✓ Commands Loaded : ${commandCount}`));
    console.log(chalk.cyan(`✓ Protocol        : v${CORE.protocol}`));
    console.log(chalk.cyan(`✓ Version         : ${CORE.version}`));

});
