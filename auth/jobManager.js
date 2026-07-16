class JobManager {

    constructor() {
        this.jobs = new Map();
    }

    create(jobId, phone) {

        const now = Date.now();

        const job = {
            id: jobId,
            phone,
            status: "waiting",
            createdAt: now,
            updatedAt: now,
            sessionId: null,
            socket: null
        };

        this.jobs.set(jobId, job);

        return job;

    }

    has(jobId) {
        return this.jobs.has(jobId);
    }

    get(jobId) {
        return this.jobs.get(jobId) || null;
    }

    update(jobId, data) {

        const job = this.jobs.get(jobId);

        if (!job) return null;

        Object.assign(job, data, {
            updatedAt: Date.now()
        });

        this.jobs.set(jobId, job);

        return job;

    }

    delete(jobId) {
        return this.jobs.delete(jobId);
    }

    getAll() {
        return Array.from(this.jobs.values());
    }

    size() {
        return this.jobs.size;
    }

    cleanExpired(timeout = 120000) {

        const now = Date.now();

        for (const [id, job] of this.jobs.entries()) {

            if (now - job.updatedAt >= timeout) {

                console.log(`🧹 Removing expired job: ${id}`);

                this.jobs.delete(id);

            }

        }

    }

}

export default new JobManager();
