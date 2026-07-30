import express from "express";
import dotenv from "dotenv";
import chalk from "chalk";
import cors from "cors";
import path from "path";

import pairRouter from "./api/pair.js";
import executeRouter from "./api/execute.js";
import validateRouter from "./api/validate.js";
import commandsRouter from "./api/commands.js";
import settingsRouter from "./api/settings.js";

import {
    getStatistics,
    getManifest
} from "./commands/index.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// ================================
// Static Assets (images, etc.)
// ================================

app.use("/assets", express.static(path.join(process.cwd(), "assets")));

// ================================
// Core Information
// ================================

const CORE = {
    name: "Kenya-Ultra Core",
    version: "1.0.0",
    protocol: 1,
    started: Date.now()
};

// ================================
// Existing APIs
// ================================

app.use("/pair", pairRouter);
app.use("/validate", validateRouter);
app.use("/execute", executeRouter);
app.use("/commands", commandsRouter);
app.use("/settings", settingsRouter);

// ================================
// Core APIs
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
            commands: "/commands",
            commandsDownload: "/commands/download",
            settings: "/settings/:sessionId",
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

        ...getManifest(),

        runtime: "Node.js",

        endpoints: {

            pair: "/pair",

            validate: "/validate",

            execute: "/execute",

            commands: "/commands",

            commandsDownload: "/commands/download"

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

    const stats = getStatistics();

    res.json({

        success: true,

        uptime: process.uptime(),

        memory: process.memoryUsage(),

        commands: stats.total,

        categories: stats.categories,

        version: stats.version,

        protocol: stats.protocol,

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

console.log(chalk.green(CORE.name));
console.log(chalk.gray("Starting services...\n"));

app.listen(PORT, () => {

    const stats = getStatistics();

    console.log(chalk.green(`✓ Core running on port ${PORT}`));
    console.log(chalk.cyan(`✓ Commands Loaded : ${stats.total}`));
    console.log(chalk.cyan(`✓ Categories      : ${stats.categories}`));
    console.log(chalk.cyan(`✓ Protocol        : v${CORE.protocol}`));
    console.log(chalk.cyan(`✓ Version         : ${CORE.version}`));
    console.log(chalk.green(`✓ SDK Ready`));
    console.log(chalk.green(`✓ Public API Ready`));

});
    
