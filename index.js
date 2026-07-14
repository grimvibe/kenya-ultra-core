import express from "express";
import dotenv from "dotenv";
import chalk from "chalk";

import pairRouter from "./api/pair.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/pair", pairRouter);

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
        status: "Running"
    });
});

app.listen(PORT, () => {
    console.log(chalk.green(`✓ Core running on port ${PORT}`));
});
