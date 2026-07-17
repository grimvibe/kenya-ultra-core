import makeWASocket, {
  fetchLatestBaileysVersion,
  Browsers
} from "baileys";

import P from "pino";
import { useMemoryAuthState } from "./memoryAuthState.js";

export async function createSocket(existingAuthState) {

  // In-memory auth state — Core only needs this to live long enough
  // to complete pairing, then it gets bundled into the SESSION_ID.
  // Reuse the same authState across reconnects (pass it back in)
  // so identity keys generated on the first attempt aren't lost.
  const authState = existingAuthState || useMemoryAuthState();

  // Always use the latest supported WhatsApp Web version
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({

    version,

    auth: authState.state,

    // Change to "trace" whenever you're debugging
    logger: P({
      level: "info"
    }),

    printQRInTerminal: false,

    // Pair Codes work correctly using Ubuntu Chrome.
    browser: Browsers.ubuntu("Chrome"),

    // Don't download unnecessary history
    syncFullHistory: false,

    // Show the bot as online after connecting
    markOnlineOnConnect: true

  });

  sock.ev.on("creds.update", authState.saveCreds);

  // Return both — pairManager needs authState.getSnapshot() once
  // pairing completes, to build the SESSION_ID.
  return { sock, authState };

}
