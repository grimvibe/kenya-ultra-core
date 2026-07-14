export function generateSessionId() {

    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let id = "KU_";

    for (let i = 0; i < 16; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }

    return id;

}

export function generateJobId() {

    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let id = "JOB_";

    for (let i = 0; i < 10; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }

    return id;

}
