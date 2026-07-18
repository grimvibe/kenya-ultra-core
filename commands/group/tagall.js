export default {

    name: "tagall",

    description: "Mention all group members.",

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

        let text = "📢 *Attention Everyone!*\n\n";

        for (const member of metadata.participants) {

            text += `➜ @${member.id.split("@")[0]}\n`;

        }

        await Reply.message({

            text,
            mentions

        });

    }

};
