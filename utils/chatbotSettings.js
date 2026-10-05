import {
    loadChatbotSettings,
    saveChatbotSettings
} from "../auth/sessionStore.js";

const DEFAULT_SETTINGS = {
    enabled: false,
    mode: "all",
    persona: null
};

export async function getChatSettings(chatId) {

    try {

        const stored = await loadChatbotSettings(chatId);

        return { ...DEFAULT_SETTINGS, ...(stored || {}) };

    } catch (err) {

        console.error("Failed to read chatbot settings:", err.message);
        return { ...DEFAULT_SETTINGS };

    }

}

export async function setChatSettings(chatId, updates) {

    try {

        const current = await getChatSettings(chatId);
        const merged = { ...current, ...updates };

        await saveChatbotSettings(chatId, merged);

        return merged;

    } catch (err) {

        console.error("Failed to save chatbot settings:", err.message);
        throw new Error("Failed to save chatbot settings.");

    }

}
