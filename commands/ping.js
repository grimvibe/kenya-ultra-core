export default {
    name: "ping",
    description: "Check bot latency.",

    async execute(sock, msg) {

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text: "🏓 Pong!"
            }
        );

    }

};
