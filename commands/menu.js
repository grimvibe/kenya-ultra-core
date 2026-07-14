export default {
    name: "menu",
    description: "Show bot menu.",

    async execute(sock, msg) {

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text:
`🤖 Kenya-Ultra

Available Commands

• .ping
• .menu

More commands coming soon...`
            }
        );

    }

};
