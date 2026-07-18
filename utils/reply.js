class Reply {

    static text(text, mentions = []) {

        return {

            success: true,

            reply: {
                text,
                mentions
            }

        };

    }

    static error(text) {

        return {

            success: false,

            reply: {
                text: `❌ ${text}`,
                mentions: []
            }

        };

    }

    static success(text) {

        return {

            success: true,

            reply: {
                text: `✅ ${text}`,
                mentions: []
            }

        };

    }

    static info(text) {

        return {

            success: true,

            reply: {
                text: `ℹ️ ${text}`,
                mentions: []
            }

        };

    }

}

export default Reply;
