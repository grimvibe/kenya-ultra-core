import {
    saveBotSettings,
    loadBotSettings
} from "../auth/sessionStore.js";

class BotSettingsService {

    async getSettings(sessionId) {

        return await loadBotSettings(sessionId);

    }

    async setMode(sessionId, mode) {

        const settings = await loadBotSettings(sessionId);

        settings.mode = mode;

        await saveBotSettings(sessionId, settings);

        return settings;

    }

    async setPrefix(sessionId, prefix) {

        const settings = await loadBotSettings(sessionId);

        settings.prefix = prefix;

        await saveBotSettings(sessionId, settings);

        return settings;

    }

}

export default new BotSettingsService();
