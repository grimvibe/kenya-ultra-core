// Normalizes a WhatsApp JID (e.g. "254712345678:12@s.whatsapp.net")
// down to just the digits, then checks it against OWNER_NUMBER in .env.
// Add this to your .env:
//   OWNER_NUMBER=254712345678
//
// A message can arrive as either the owner's phone-number JID
// (@s.whatsapp.net) or their @lid, depending on how WhatsApp routed
// that particular message (this is the same LID migration handled in
// index.js via participantAlt/remoteJidAlt). senderAlt carries the
// other form when Baileys knows it, so we check both — otherwise the
// owner gets locked out of owner-only commands whenever WhatsApp
// happens to route their own message as @lid.
//
// Sometimes WhatsApp hasn't linked the phone-number/@lid identities
// server-side AT ALL yet for a given chat, so neither sender nor
// senderAlt resolves to anything digit-matchable against
// OWNER_NUMBER — both come through as opaque @lid values. For the
// common case of the developer testing on their OWN bot instance
// (not a random end-user's self-hosted deployment), fromMe + botIds
// closes that gap safely: fromMe alone is NOT sufficient (that would
// let any end-user's own bot instance grant them platform-admin
// access just by messaging themselves), but fromMe together with
// THIS instance's own linked number matching OWNER_NUMBER can only
// be true for the developer's own bot, since a stranger's deployment
// is linked to a different number entirely.

function digitsOf(jid) {

    if (!jid) return null;

    return jid.split("@")[0].split(":")[0];

}

export default function isOwner(sender, senderAlt = null, fromMe = false, botIds = []) {

    if (!process.env.OWNER_NUMBER) {
        return false;
    }

    const ownerDigits = process.env.OWNER_NUMBER.replace(/\D/g, "");

    const senderDigits = digitsOf(sender);
    const altDigits = digitsOf(senderAlt);

    if (senderDigits === ownerDigits || altDigits === ownerDigits) {
        return true;
    }

    if (fromMe && botIds?.length) {

        return botIds.some(id => digitsOf(id) === ownerDigits);

    }

    return false;

}
