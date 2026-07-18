// Normalizes a WhatsApp JID (e.g. "254712345678:12@s.whatsapp.net")
// down to just the digits, then checks it against OWNER_NUMBER in .env.
// Add this to your .env:
//   OWNER_NUMBER=254712345678

export default function isOwner(sender) {

    if (!sender || !process.env.OWNER_NUMBER) {
        return false;
    }

    const senderDigits = sender.split("@")[0].split(":")[0];
    const ownerDigits = process.env.OWNER_NUMBER.replace(/\D/g, "");

    return senderDigits === ownerDigits;

}
