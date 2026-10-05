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

    async setOwnerInfo(sessionId, { name, number }) {

        const settings = await loadBotSettings(sessionId);

        if (name !== undefined) settings.ownerName = name;
        if (number !== undefined) settings.ownerNumber = number;

        await saveBotSettings(sessionId, settings);

        return settings;

    }

    async setMenuImage(sessionId, url) {

        const settings = await loadBotSettings(sessionId);

        settings.menuImageUrl = url;

        await saveBotSettings(sessionId, settings);

        return settings;

    }

    async setAutoViewStatus(sessionId, enabled) {

        const settings = await loadBotSettings(sessionId);

        settings.autoViewStatus = enabled;

        await saveBotSettings(sessionId, settings);

        return settings;

    }

    async setAutoReactStatus(sessionId, enabled, emoji) {

        const settings = await loadBotSettings(sessionId);

        settings.autoReactStatus = enabled;

        if (emoji) {
            settings.autoReactStatusEmoji = emoji;
        }

        await saveBotSettings(sessionId, settings);

        return settings;

    }

    async setAutoReactStatusEmoji(sessionId, emoji) {

        const settings = await loadBotSettings(sessionId);

        settings.autoReactStatusEmoji = emoji;

        await saveBotSettings(sessionId, settings);

        return settings;

    }

    // Reacts to regular chat messages (DMs/groups) — distinct from
    // autoReactStatus above, which only reacts to WhatsApp Status
    // updates.
    async setAutoReactMessages(sessionId, enabled, emoji) {

        const settings = await loadBotSettings(sessionId);

        settings.autoReactMessages = enabled;

        if (emoji) {
            settings.autoReactMessagesEmoji = emoji;
        }

        await saveBotSettings(sessionId, settings);

        return settings;

    }

    // .autotyping and .autorecording are fully independent now — each
    // is scoped to "off" | "groups" | "dms" | "all" and setting one
    // doesn't touch the other. (If a single chat ends up in-scope for
    // both, the bot-side presence resolver picks recording — see
    // index.js's scopeMatches/presenceActive — since WhatsApp can only
    // show one indicator per chat.)
    async setAutoTyping(sessionId, scope) {

        const settings = await loadBotSettings(sessionId);

        settings.autoTyping = scope;

        await saveBotSettings(sessionId, settings);

        return settings;

    }

    async setAutoRecording(sessionId, scope) {

        const settings = await loadBotSettings(sessionId);

        settings.autoRecording = scope;

        await saveBotSettings(sessionId, settings);

        return settings;

    }

    async setViewOnceEmoji(sessionId, emoji) {

        const settings = await loadBotSettings(sessionId);

        settings.viewOnceEmoji = emoji;

        await saveBotSettings(sessionId, settings);

        return settings;

    }

}

export default new BotSettingsService();
