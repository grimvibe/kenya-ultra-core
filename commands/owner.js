export default {
    name: "owner",
    description: "Show contact details for the bot owner.",
    category: "General",

    async execute() {

        const info = `╭━━━〔 👑 BOT OWNER 〕━━━⬣

👤 *Lawrence*
🏢 *Lucid Tech Solutions*

━━━━━━━━━━━━━━

🤖 Bot : Kenya-Ultra
📦 Version : v1.0.0
⚡ Developer : Lawrence

━━━━━━━━━━━━━━

📞 Phone
+254 754 938 511

📧 Email
lucidtechsolutions41@gmail.com

💻 GitHub
https://github.com/lawrencenjeri4-lgtm

📢 WhatsApp Channel
https://whatsapp.com/channel/0029VbDbTKcG8l5JKqrsMS2f

🌐 Website
Coming Soon...

━━━━━━━━━━━━━━

💚 Thank you for using Kenya-Ultra.

For support, business inquiries, collaborations or bug reports, feel free to reach out using any of the contacts above.

━━━━━━━━━━━━━━

© 2026 Kenya-Ultra`;

        return {
            action: "reply",
            reply: {
                type: "image",
                file: "owner.jpg",
                caption: info,
                contact: {
                    displayName: "Lawrence",
                    phone: "254754938511"
                }
            }
        };

    }

};
