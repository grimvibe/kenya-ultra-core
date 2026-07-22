import { initAuthCreds } from "baileys";

/**
 * Fully in-memory auth state for Kenya-Ultra Core.
 * Compatible with Baileys v7 RC13.
 */
export function useMemoryAuthState(existing = null) {

    const creds = existing?.creds || initAuthCreds();

    // Preserve existing keys if we're reconnecting
    const keys = existing?.keys
        ? structuredClone(existing.keys)
        : {};

    const authState = {

        state: {

            creds,

            keys: {

                get: async (type, ids) => {

                    const data = {};

                    keys[type] ||= {};

                    for (const id of ids) {

                        if (keys[type][id] !== undefined) {
                            data[id] = keys[type][id];
                        }

                    }

                    return data;

                },

                set: async (newData) => {

                    for (const type in newData) {

                        keys[type] ||= {};

                        for (const id in newData[type]) {

                            const value = newData[type][id];

                            if (value === null) {
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

            keys: structuredClone(keys)

        })

    };

    return authState;

        }
