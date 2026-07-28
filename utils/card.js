// =========================
// WhatsApp "ad reply" preview card
// =========================
//
// This builds the contextInfo.externalAdReply object that makes a text
// message render with a bordered thumbnail + title + body preview above
// the actual message — the boxed "card" look used by bots like
// WOLFBOT / BWM-XMD for things like .ping and .menu.
//
// NOTE: this only affects rendering if whatever calls
// `sock.sendMessage(jid, { text, contextInfo })` actually forwards the
// `contextInfo` field through. In this repo that final send happens
// outside kenya-ultra-core (this service only builds the Reply object),
// so the gateway/session layer needs to spread `reply.contextInfo` into
// the sendMessage payload for the card to actually show up.

export function buildAdCard({

    title,
    body = "",
    thumbnailUrl = null,
    sourceUrl = "https://kenya-ultra.tech",
    renderLargerThumbnail = false

}) {

    return {

        externalAdReply: {
            title,
            body,
            thumbnailUrl,
            sourceUrl,
            mediaType: 1,
            renderLargerThumbnail,
            showAdAttribution: false
        }

    };

}
