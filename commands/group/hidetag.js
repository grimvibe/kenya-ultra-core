export default {

    name: "hidetag",

    description: "Silently mention everyone.",

    category: "Group",

    async execute(ctx) {

        const {
            sock,
            msg,
            Reply,
            isGroup,
            isAdmin
        } = ctx;

        if (!isGroup) {
            return Reply.text("❌ This command can only be used in groups.");
        }

        if (!isAdmin) {
            return Reply.text("❌ Only group admins can use this command.");
        }

        const metadata = await sock.groupMetadata(msg.key.remoteJid);

        const mentions = metadata.participants.map(
            p => p.id
        );

        await Reply.message({

            text: "‎",

            mentions

        });

    }

};
