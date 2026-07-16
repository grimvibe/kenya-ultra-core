import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  Browsers
} from "baileys";

import P from "pino";

export async function createSocket(sessionFolder) {
  const { state, saveCreds } = await useMultiFileAuthState(sessionFolder);

  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: P({ level: "trace" }),
    printQRInTerminal: false,
    // IMPORTANT: pairing codes require a recognized browser signature.
    // A custom name here (e.g. ["Kenya-Ultra", "Chrome", "1.0.0"]) causes
    // WhatsApp to reject the companion_hello stage with a 400 bad-request,
    // which makes the generated pair code invalid on arrival.
    browser: Browsers.ubuntu("Chrome")
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}
