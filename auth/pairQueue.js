// Staggers concurrent pairing attempts instead of firing them all at
// WhatsApp simultaneously. When many users try to .pair at once (e.g.
// everyone re-pairing after a mass disconnect), a burst of pairing
// requests from the same server IP is a common trigger for WhatsApp's
// own anti-abuse rate limiting — spacing them out reduces that risk.
//
// Job creation (jobManager.create) still happens immediately in
// authEngine.js, so users get a jobId right away — only the actual
// WhatsApp-facing work (generatePair) is queued here.

const MIN_GAP_MS = 4000;

class PairQueue {

    constructor() {

        this.queue = Promise.resolve();

        this.lastStart = 0;

        this.pending = 0;

    }

    schedule(task) {

        this.pending++;

        const run = async () => {

            const wait = Math.max(
                0,
                MIN_GAP_MS - (Date.now() - this.lastStart)
            );

            if (wait > 0) {
                await new Promise(resolve => setTimeout(resolve, wait));
            }

            this.lastStart = Date.now();

            try {

                return await task();

            } finally {

                this.pending--;

            }

        };

        // Chain onto the queue regardless of whether the previous
        // task succeeded or failed, so one failure never blocks the
        // rest of the queue.
        const result = this.queue.then(run, run);

        this.queue = result.then(() => {}, () => {});

        return result;

    }

    size() {
        return this.pending;
    }

}

export default new PairQueue();
