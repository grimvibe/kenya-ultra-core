import {
    saveMenuStyle,
    loadMenuStyle
} from "../auth/sessionStore.js";

class MenuStyleService {

    async get(sessionId, userId) {

        return await loadMenuStyle(sessionId, userId);

    }

    async set(sessionId, userId, style) {

        await saveMenuStyle(sessionId, userId, style);

        return style;

    }

}

export default new MenuStyleService();
