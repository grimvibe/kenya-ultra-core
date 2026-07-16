import jobManager from "./jobManager.js";
import messageSender from "./messageSender.js";
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

            const result = await generatePair(phone);

            jobManager.update(jobId, {
                status: "waiting",
                sessionId: result.sessionId
            });

            // Prevent sending SESSION_ID twice
            let delivered = false;

            result.socket.ev.on("connection.update", async ({ connection }) => {

                if (connection !== "open") return;

                if (delivered) return;

                delivered = true;

                try {

                    await messageSender.sendSessionId(
                        result.socket,
                        phone,
                        result.sessionId
                    );

                    jobManager.update(jobId, {
                        status: "connected"
                    });

                    console.log(
                        `✅ SESSION_ID delivered to ${phone}`
                    );

                } catch (err) {

                    console.error(
                        "Failed to deliver SESSION_ID:",
                        err
                    );

                    jobManager.update(jobId, {
                        status: "delivery_failed"
                    });

                }

            });

            return {
                success: true,
                jobId,
                pairCode: result.pairCode
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
