import jobManager from "./jobManager.js";
import { generateJobId } from "../utils/idGenerator.js";
import { generatePair } from "./pairManager.js";

class AuthEngine {

    async startPair(phone) {

        // Remove spaces and "+"
        phone = phone.replace(/\D/g, "");

        if (phone.length < 10) {
            throw new Error("Invalid phone number.");
        }

        const jobId = generateJobId();

        jobManager.create(jobId, phone);

        try {

            const result = await generatePair(phone);

            jobManager.update(jobId, {
                status: "connected",
                sessionId: result.sessionId
            });

            return {
                success: true,
                jobId,
                pairCode: result.pairCode,
                sessionId: result.sessionId
            };

        } catch (error) {

            jobManager.update(jobId, {
                status: "failed"
            });

            throw error;

        }

    }

    getJob(jobId) {
        return jobManager.get(jobId);
    }

}

export default new AuthEngine();
