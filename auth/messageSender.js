class MessageSender {

    async sendSessionId(sock, phone, sessionId) {

        try {

            phone = phone.replace(/\D/g, "");

            if (!phone) {
                throw new Error("Invalid phone number.");
            }

            const jid = `${phone}@s.whatsapp.net`;

            const message = `🎉 *Kenya-Ultra Connected Successfully*

Your bot has been paired successfully.

━━━━━━━━━━━━━━

🔑 *YOUR SESSION_ID*

\`${sessionId}\`

━━━━━━━━━━━━━━

⚠️ IMPORTANT

• Keep this SESSION_ID private.
• Never share it with anyone.
• Store it safely.

Add it to your Kenya-Ultra bot:

\`\`\`
SESSION_ID=${sessionId}
\`\`\`

Thank you for using *Kenya-Ultra* 💚
Happy Coding 🚀`;

            await sock.sendMessage(jid, {
                text: message,
                previewType: "NONE"
            });

            console.log(`✅ SESSION_ID successfully sent to ${phone}`);

            return true;

        } catch (error) {

            console.error("❌ Failed to send SESSION_ID:", error);

            return false;

        }

    }

    async sendText(sock, phone, text) {

        try {

            phone = phone.replace(/\D/g, "");

            const jid = `${phone}@s.whatsapp.net`;

            await sock.sendMessage(jid, {
                text,
                previewType: "NONE"
            });

            return true;

        } catch (error) {

            console.error("❌ Failed to send message:", error);

            return false;

        }

    }

}

export default new MessageSender();
