export async function startLoading(sock, jid, msg, text = "⏳ Processing...") {

    await sock.sendMessage(jid, {
        react: {
            text: "⏳",
            key: msg.key
        }
    });

    const sent = await sock.sendMessage(jid, {
        text
    });

    return sent;
}

export async function finishLoading(sock, jid, msg, loadingMessage) {

    try {

        if (loadingMessage?.key) {

            await sock.sendMessage(jid, {
                delete: loadingMessage.key
            });

        }

    } catch {}

    await sock.sendMessage(jid, {
        react: {
            text: "✅",
            key: msg.key
        }
    });

}

export async function failLoading(sock, jid, msg, loadingMessage) {

    try {

        if (loadingMessage?.key) {

            await sock.sendMessage(jid, {
                delete: loadingMessage.key
            });

        }

    } catch {}

    await sock.sendMessage(jid, {
        react: {
            text: "❌",
            key: msg.key
        }
    });

}
