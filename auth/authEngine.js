import jobManager from "./jobManager.js";
import { generateJobId } from "../utils/idGenerator.js";
import { generatePair } from "./pairManager.js";

class AuthEngine {

    async startPair(phone) {

        phone = phone.replace(/\D/g, "");

        if (phone.length < 10) {
            throw new Error("Invalid phone number.");
        }

        const jobId = generateJobId();

        jobManager.create(jobId, phone);

        try {

            // Resolves as soon as the pair code exists — pairManager.js
            // handles the rest of the connection lifecycle (reconnects,
            // sending the SESSION_ID once truly connected) internally
            // from here on, using jobId to keep the job record updated.
            const result = await generatePair(phone, jobId);

            jobManager.update(jobId, { status: "waiting" });

            return {
                success: true,
                jobId,
                pairCode: result.pairCode
            };

        } catch (error) {

            jobManager.update(jobId, { status: "failed" });

            throw error;

        }

    }

    getJob(jobId) {
        return jobManager.get(jobId);
    }

}

export default new AuthEngine();
