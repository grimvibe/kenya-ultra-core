import Prexzy from "./prexzy.js";
import Cod3Uchiha from "./cod3uchiha.js";

/**
 * Tries Prexzy's primary chat endpoint, then a second Prexzy
 * endpoint, then a fully separate provider — same resilience the
 * chatbot auto-reply already relies on. Optionally prefixes the
 * prompt with a short persona/system instruction so different
 * commands (e.g. a "coder" flavor vs a general chat flavor) can
 * share this one reliable chain instead of each depending on a
 * single unverified third-party endpoint.
 */
export async function askAI(prompt, systemPrompt = null) {

    const fullPrompt = systemPrompt
        ? `${systemPrompt}\n\nUser: ${prompt}`
        : prompt;

    try {
        return await Prexzy.chat(fullPrompt);
    } catch (chatErr) {

        try {
            return await Prexzy.deepQuery(fullPrompt);
        } catch (deepErr) {

            try {
                return await Cod3Uchiha.ask(fullPrompt);
            } catch (fallbackErr) {

                throw new Error(
                    `All AI providers failed — ${chatErr.message} / ${deepErr.message} / ${fallbackErr.message}`
                );

            }

        }

    }

}
