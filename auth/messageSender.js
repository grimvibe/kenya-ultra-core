class MessageSender {

    async sendSessionId(sock, phone, sessionId) {

        try {

            const jid = `${phone}@s.whatsapp.net`;

            const message =
`🎉 *Kenya-Ultra Connected Successfully*

Your bot has been linked successfully.

━━━━━━━━━━━━━━

🔑 *SESSION_ID*

\`${sessionId}\`

━━━━━━━━━━━━━━

⚠️ Keep this SESSION_ID safe.
Do NOT share it with anyone.

Paste it into your public Kenya-Ultra bot's .env file:

SESSION_ID=${sessionId}

Thank you for using Kenya-Ultra 💚`;

            await sock.sendMessage(jid, {
                text: message
            });

            console.log(`✅ SESSION_ID sent to ${phone}`);

            return true;

        } catch (error) {

            console.error("Failed to send SESSION_ID:", error);

            return false;

        }

    }

    async sendText(sock, phone, text) {

        try {

            const jid = `${phone}@s.whatsapp.net`;

            await sock.sendMessage(jid, {
                text
            });

            return true;

        } catch (error) {

            console.error(error);

            return false;

        }

    }

}

export default new MessageSender();
