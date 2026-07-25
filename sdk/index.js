import CoreClient from "./CoreClient.js";

import { handshake } from "./Handshake.js";
import { manifest } from "./Manifest.js";
import { health } from "./Health.js";
import { commands } from "./Commands.js";

export async function connect(baseURL) {

    const client = new CoreClient(baseURL);

    const hs = await handshake(client);

    if (!hs.compatible) {
        throw new Error("Protocol mismatch.");
    }

    const mf = await manifest(client);

    return {

        client,

        manifest: mf,

        health: () => health(client),

        commands: () => commands(client)

    };

      }
