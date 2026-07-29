import firestore from "./firestore.js";

const COLLECTION = "chatbot_settings";

const DEFAULT_SETTINGS = {
    enabled: false,
    mode: "all",
    persona: null
};

export async function getChatSettings(chatId) {

    try {

        const doc = await firestore
            .collection(COLLECTION)
            .doc(chatId)
            .get();

        if (!doc.exists) {
            return { ...DEFAULT_SETTINGS };
        }

        return { ...DEFAULT_SETTINGS, ...doc.data() };

    } catch (err) {

        console.error("Failed to read chatbot settings:", err.message);
        return { ...DEFAULT_SETTINGS };

    }

}

export async function setChatSettings(chatId, updates) {

    try {

        await firestore
            .collection(COLLECTION)
            .doc(chatId)
            .set(updates, { merge: true });

        return await getChatSettings(chatId);

    } catch (err) {

        console.error("Failed to save chatbot settings:", err.message);
        throw new Error("Failed to save chatbot settings.");

    }

}
