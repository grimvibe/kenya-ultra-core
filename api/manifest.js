const fs = require("fs");
const path = require("path");
const pkg = require("../package.json");

module.exports = async (req, res) => {
    try {

        const commandsDir = path.join(__dirname, "../commands");

        let count = 0;

        function scan(dir) {
            const files = fs.readdirSync(dir);

            for (const file of files) {

                const full = path.join(dir, file);

                if (fs.statSync(full).isDirectory()) {
                    scan(full);
                } else if (file.endsWith(".js")) {
                    count++;
                }

            }
        }

        scan(commandsDir);

        res.json({
            success: true,

            platform: "Kenya Ultra",

            core: true,

            version: pkg.version,

            apiVersion: 1,

            commandCount: count,

            timestamp: Date.now()

        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });

    }
};
