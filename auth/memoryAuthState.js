import { initAuthCreds } from "baileys";

/**
 * Fully in-memory auth state for Kenya-Ultra Core.
 * Compatible with Baileys v7 RC13.
 */
export function useMemoryAuthState(existing = null) {

    const creds = existing?.creds || initAuthCreds();

    // Safely preserve existing keys
    const keys =
        existing?.keys && typeof existing.keys === "object"
            ? structuredClone(existing.keys)
            : {};

    const authState = {

        state: {

            creds,

            keys: {

                get: async (type, ids) => {

                    const data = {};

                    if (!keys[type]) {
                        keys[type] = {};
                    }

                    for (const id of ids) {

                        if (Object.prototype.hasOwnProperty.call(keys[type], id)) {
                            data[id] = keys[type][id];
                        }

                    }

                    return data;

                },

                set: async (newData) => {

                    if (!newData || typeof newData !== "object") {
                        return;
                    }

                    for (const type of Object.keys(newData)) {

                        if (!keys[type]) {
                            keys[type] = {};
                        }

                        for (const id of Object.keys(newData[type])) {

                            const value = newData[type][id];

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

        /**
         * Baileys mutates creds in-place.
         * Nothing needs writing because we're purely in memory.
         */
        saveCreds: async () => {
            return;
        },

        /**
         * Snapshot used to generate SESSION_ID.
         */
        getSnapshot: () => ({
            creds: structuredClone(creds),
            keys: structuredClone(keys || {})
        })

    };

    return authState;

                                }
