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

            /*
             * Wait for WhatsApp connection.
             * Once paired successfully,
             * send SESSION_ID automatically.
             */

            result.socket.ev.on("connection.update", async ({ connection }) => {

                if (connection === "open") {

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
