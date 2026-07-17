import { initAuthCreds } from "baileys";

/**
 * A minimal, fully in-memory Baileys auth state.
 *
 * Core doesn't need to persist sessions to disk — it only needs
 * creds/keys to exist in memory long enough to pair, then bundle
 * them into the SESSION_ID sent to the user. getSnapshot() gives
 * you that full { creds, keys } object, ready to pass straight
 * into encodeSession().
 */
export function useMemoryAuthState() {

    const creds = initAuthCreds();
    const keys = {};

    return {

        state: {

            creds,

            keys: {

                get: async (type, ids) => {

                    const data = {};

                    for (const id of ids) {

                        const value = keys[type]?.[id];

                        if (value) {
                            data[id] = value;
                        }

                    }

                    return data;

                },

                set: async (data) => {

                    for (const type in data) {

                        keys[type] = keys[type] || {};

                        for (const id in data[type]) {

                            const value = data[type][id];

                            if (value === null || value === undefined) {
                                delete keys[type][id];
                            } else {
                                keys[type][id] = value;
                            }

                        }

                    }

                }

            }

        },

        // Baileys calls this on "creds.update" — nothing to do since
        // `creds` above is mutated in place and read live by getSnapshot().
        saveCreds: async () => {},

        // Full, plain-JSON-serializable snapshot of the current auth state.
        getSnapshot: () => ({ creds, keys })

    };

}
