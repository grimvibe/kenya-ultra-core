class JobManager {

    constructor() {
        this.jobs = new Map();
    }

    create(jobId, phone) {

        const job = {
            id: jobId,
            phone,
            status: "waiting",
            createdAt: Date.now(),
            sessionId: null,
            socket: null
        };

        this.jobs.set(jobId, job);

        return job;

    }

    get(jobId) {
        return this.jobs.get(jobId);
    }

    update(jobId, data) {

        const job = this.jobs.get(jobId);

        if (!job) return null;

        Object.assign(job, data);

        this.jobs.set(jobId, job);

        return job;

    }

    delete(jobId) {
        return this.jobs.delete(jobId);
    }

    getAll() {
        return [...this.jobs.values()];
    }

    cleanExpired(timeout = 120000) {

        const now = Date.now();

        for (const [id, job] of this.jobs) {

            if (now - job.createdAt > timeout) {
                this.jobs.delete(id);
            }

        }

    }

}

export default new JobManager();
