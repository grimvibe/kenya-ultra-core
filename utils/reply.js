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

    static card({

        title,

        fields = [],

        footer = "🐺 Powered by Kenya-Ultra 👑",

        mentions = []

    }) {

        let text = `╭⊷ ${title}\n│\n`;

        for (const [label, value] of fields) {

            text += `├⊷ ${label}: ${value}\n`;

        }

        text += `│\n`;
        text += `╰⊷ ${footer}`;

        return {

            success: true,

            reply: {
                text,
                mentions
            }

        };

    }

}

export default Reply;
