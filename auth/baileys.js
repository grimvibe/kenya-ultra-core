import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  Browsers
} from "baileys";

import P from "pino";

export async function createSocket(sessionFolder) {

  // Create authentication state
  const { state, saveCreds } = await useMultiFileAuthState(sessionFolder);

  // Always use the latest supported WhatsApp Web version
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({

    version,

    auth: state,

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

  // Save credentials automatically whenever they change
  sock.ev.on("creds.update", saveCreds);

  return sock;

}
