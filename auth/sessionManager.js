import fs from "fs";
import path from "path";

export function sessionPath(id) {
    return path.join("sessions", id);
}

export function sessionExists(id) {
    return fs.existsSync(sessionPath(id));
}

export function createSession(id) {

    const dir = sessionPath(id);

    if (!sessionExists(id)) {

        fs.mkdirSync(dir, {
            recursive: true
        });

        // Session metadata
        fs.writeFileSync(
            path.join(dir, "metadata.json"),
            JSON.stringify({
                sessionId: id,
                createdAt: new Date().toISOString(),
                status: "waiting",
                version: "1.0.0"
            }, null, 4)
        );

        // Runtime information
        fs.writeFileSync(
            path.join(dir, "runtime.json"),
            JSON.stringify({
                lastSeen: null,
                commands: 0,
                restartCount: 0
            }, null, 4)
        );

    }

    return dir;

}
