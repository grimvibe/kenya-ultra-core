import fs from "fs";

export function sessionPath(id) {
    return `sessions/${id}`;
}

export function sessionExists(id) {
    return fs.existsSync(sessionPath(id));
}

export function createSession(id) {

    if (!sessionExists(id)) {
        fs.mkdirSync(sessionPath(id), {
            recursive: true
        });
    }

    return sessionPath(id);

}
