import express from "express";
import dotenv from "dotenv";
import chalk from "chalk";
import cors from "cors";

import pairRouter from "./api/pair.js";
import validateRouter from "./api/validate.js";

dotenv.config();

const app = express();

// Enable CORS
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// API Routes
app.use("/pair", pairRouter);
app.use("/validate", validateRouter);

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

console.log(chalk.green("Kenya-Ultra Core"));
console.log(chalk.gray("Starting services...\n"));

app.get("/", (req, res) => {
    res.json({
        success: true,
        name: "Kenya-Ultra Core",
        version: "1.0.0",
        status: "Running",
        endpoints: {
            pair: "/pair",
            validate: "/validate"
        }
    });
});

app.listen(PORT, () => {
    console.log(chalk.green(`✓ Core running on port ${PORT}`));
});
