import express from "express";
import { getCommand } from "../commands/index.js";
import { loadAuth } from "../auth/sessionStore.js";
import { getChatSettings } from "../utils/chatbotSettings.js";
import { shouldAutoReply } from "../utils/chatbotTrigger.js";
import Prexzy from "../utils/prexzy.js";
import Cod3Uchiha from "../utils/cod3uchiha.js";
import cooldownService from "../services/cooldownService.js";
import muteService from "../services/muteService.js";
import botSettingsService from "../services/botSettingsService.js";
import isBotOwner from "../utils/isBotOwner.js";
import { trackActivity, isAnnounceEnabled } from "../utils/levelSystem.js";
import { renderLevelUpCard } from "../utils/levelCard.js";
import { checkModeration } from "../services/moderationService.js";
import { takePendingSearch } from "../utils/pendingSpotifySearch.js";
import { downloadPickedTrack } from "../commands/download/spotify.js";
import Reply from "../utils/reply.js";

const router = express.Router();

router.post("/", async (req, res) => {

    try {

        const {
            sessionId,
            message
        } = req.body;

        if (!sessionId) {

            return res.status(400).json({
                success: false,
                message: "SESSION_ID is required."
            });

        }

        if (!message || (message.text === undefined) || !message.message) {

            return res.status(400).json({
                success: false,
                message: "Invalid message."
            });

        }

        // Validate SESSION_ID
        const auth = await loadAuth(sessionId);

        if (!auth) {

            return res.status(401).json({
                success: false,
                message: "Invalid SESSION_ID."
            });

        }

        const botIds = message.botIds || [];

        // `fromMe` (set by Baileys at the protocol level, true whenever
        // the bot's own connected account sent the message — from the
        // real phone, "Message yourself", anywhere) is the most
        // reliable owner signal available. Unlike JID matching, it
        // doesn't depend on WhatsApp having already linked the
        // phone-number and @lid identities server-side. Falls back to
        // JID matching for setups where the "owner" is a genuinely
        // different WhatsApp account than the one the bot is paired
        // to, where fromMe would correctly be false.
        //
        // WhatsApp can also report the same sender under either their
        // phone-number JID or their @lid identity depending on how it
        // routed this specific message — check both, otherwise the
        // owner intermittently gets treated as a stranger whenever a
        // message happens to come through under whichever form wasn't
        // checked.
        const isOwnerMessage =
            message.fromMe === true ||
            isBotOwner(message.sender, botIds) ||
            isBotOwner(message.senderAlt, botIds);

        const botSettings = await botSettingsService.getSettings(sessionId);
        const PREFIX = botSettings.prefix || ".";

        // Private mode: only the bot owner gets a response at all.
        if (botSettings.mode === "private" && !isOwnerMessage) {

            return res.json({
                success: true,
                ignored: true
            });

        }

        // Muted users: block everything they send (commands and
        // normal chat alike), unless they're a group admin.
        if (message.isGroup && message.sender && !message.isAdmin) {

            try {

                const muted = await muteService.isMuted(
                    message.chat,
                    message.sender
                );

                if (muted) {

                    return res.json({
                        success: true,
                        action: "delete_message"
                    });

                }

            } catch (err) {

                console.error("Mute check failed:", err.message);

            }

        }

        // ---- Moderation (anti-link, anti-spam, anti-emoji, etc.) ----
        // Runs before everything else — a violating message shouldn't
        // still earn XP or trigger a chatbot reply.
        if (message.isGroup && message.sender) {

            try {

                const violation = await checkModeration({
                    isGroup: message.isGroup,
                    isAdmin: message.isAdmin,
                    isBotOwner: isOwnerMessage,
                    sender: message.sender,
                    chat: message.chat,
                    text: message.text,
                    message: message.message,
                    isCommand: message.text.startsWith(PREFIX)
                });

                if (violation) {
                    return res.json(violation);
                }

            } catch (err) {

                console.error("Moderation check failed:", err.message);

            }

        }

        // ---- XP / Levels ----
        // Award XP for this message (and, if it's a command, a
        // separate command-XP bump). Cooldown-gated internally, so
        // this is safe to call on every request. Only tracked inside
        // groups — DMs don't have a meaningful "level up" audience.
        let levelUpResult = null;

        if (message.isGroup && message.sender) {

            try {

                const activity = await trackActivity({
                    sessionId,
                    groupId: message.chat,
                    userId: message.sender,
                    isCommand: message.text.startsWith(PREFIX)
                });

                if (activity && activity.leveledUp) {

                    const announce = await isAnnounceEnabled(
                        sessionId,
                        message.chat
                    );

                    if (announce) {

                        const { getLevelInfo } = await import(
                            "../utils/levelSystem.js"
                        );

                        const info = await getLevelInfo(
                            sessionId,
                            message.chat,
                            message.sender
                        );

                        const buffer = await renderLevelUpCard({
                            userId: message.sender.split("@")[0],
                            name: message.pushName || "Member",
                            level: info.level,
                            rank: info.rank,
                            totalExp: info.totalExp,
                            avatarUrl: message.ppUrl || null
                        });

                        levelUpResult = {
                            type: "image",
                            file: `data:image/png;base64,${buffer.toString("base64")}`,
                            caption:
`🎉 @${message.sender.split("@")[0]} ⚡ reached level ${info.level}!
Rank: ${info.rank}

To turn this off, an admin can send ${PREFIX}level off`,
                            mentions: [message.sender]
                        };

                    }

                }

            } catch (err) {

                console.error("Level tracking error:", err.message);

            }

        }

        // Non-commands: check chatbot auto-reply before ignoring
        if (!message.text.startsWith(PREFIX)) {

            // A bare 1-5 reply to a pending ".spotify <name>" search
            // takes priority over everything else non-command related —
            // otherwise it just falls into the chatbot/ignored path below
            // and the user's pick goes nowhere.
            const pickedNumber = message.text.trim().match(/^[1-5]$/);

            if (pickedNumber) {

                try {

                    const tracks = await takePendingSearch(
                        message.chat,
                        message.sender,
                        message.senderAlt
                    );

                    if (tracks) {

                        const index = Number(pickedNumber[0]) - 1;
                        const track = tracks[index];

                        if (track) {

                            const result = await downloadPickedTrack(track);

                            return res.json({
                                ...result,
                                ...(levelUpResult ? { levelUp: levelUpResult } : {})
                            });

                        }

                    }

                } catch (err) {

                    console.error("Spotify pick error:", err.message);

                    return res.json({
                        ...Reply.error(
                            err.message || "Failed to download that track."
                        ),
                        ...(levelUpResult ? { levelUp: levelUpResult } : {})
                    });

                }

            }

            try {

                const settings = await getChatSettings(message.chat);

                const eligible = shouldAutoReply({
                    settings,
                    isGroup: message.isGroup,
                    message: message.message,
                    botIds
                });

                if (eligible) {

                    const prompt = settings.persona
                        ? `${settings.persona}\n\nUser message: ${message.text}`
                        : message.text;

                    let replyText = null;

                    try {

                        replyText = await Prexzy.chat(prompt);

                    } catch (chatErr) {

                        try {

                            // /ai/aichat has gone down independently of
                            // other Prexzy routes before — try a
                            // different endpoint on the same API first.
                            replyText = await Prexzy.deepQuery(prompt);

                        } catch (deepErr) {

                            try {

                                // If the whole Prexzy account is the
                                // problem (e.g. shared OpenAI credits
                                // exhausted), a different Prexzy
                                // endpoint won't help — fall through to
                                // a genuinely separate provider instead
                                // of going silent.
                                replyText = await Cod3Uchiha.ask(prompt);

                            } catch (fallbackErr) {

                                console.error(
                                    "Chatbot auto-reply: all providers failed —",
                                    chatErr.message,
                                    "/",
                                    deepErr.message,
                                    "/",
                                    fallbackErr.message
                                );

                            }

                        }

                    }

                    if (replyText) {

                        return res.json({
                            success: true,
                            action: "reply",
                            reply: {
                                type: "text",
                                text: replyText
                            },
                            ...(levelUpResult ? { levelUp: levelUpResult } : {})
                        });

                    }

                }

            } catch (err) {

                console.error("Chatbot auto-reply error:", err.message);

            }

            // No auto-reply fired this turn — if the message pushed
            // the sender to a new level, send the level-up card as
            // the reply instead of ignoring. Otherwise, ignore as usual.
            if (levelUpResult) {

                return res.json({
                    success: true,
                    action: "reply",
                    reply: levelUpResult
                });

            }

            return res.json({
                success: true,
                ignored: true
            });

        }

        const parts = message.text
            .slice(PREFIX.length)
            .trim()
            .split(/\s+/);

        const commandName = parts.shift().toLowerCase();
        const args = parts;

        const command = getCommand(commandName);

        if (!command) {

            return res.status(404).json({
                success: false,
                message: "Unknown command."
            });

        }

        // Cooldowns protect the bot account from WhatsApp flagging it
        // for spammy behavior (hammering a download/AI command sends
        // a burst of outbound messages in a short window) — the owner
        // is exempt since they're not the one who needs protecting
        // from themselves.
        if (!isOwnerMessage) {

            const cooldownCheck = await cooldownService.check(
                sessionId,
                message.sender,
                command
            );

            if (cooldownCheck.onCooldown) {

                return res.json({
                    success: true,
                    action: "reply",
                    reply: {
                        type: "text",
                        text: `⏳ Slow down! Try *${commandName}* again in ${Math.ceil(cooldownCheck.remainingMs / 1000)}s.`
                    }
                });

            }

            await cooldownService.start(sessionId, message.sender, command);

        }

        const result = await command.execute({

    sessionId,

    args,

    commandName,

    message: message.message,

    rawMessage: message.rawMessage,

    sock: message.sock,

    text: message.text,

    sender: message.sender,

    // Same LID-migration reasoning as ctx.isBotOwner above — WhatsApp
    // can report the sender under either their phone-number JID or
    // their @lid depending on how it routed this specific message.
    // stats.js (isOwner check) needs both forms to reliably match
    // against OWNER_NUMBER; this was previously missing entirely,
    // so senderAlt was always undefined downstream no matter what
    // WhatsApp actually sent.
    senderAlt: message.senderAlt,

    fromMe: message.fromMe === true,

    chat: message.chat,

    pushName: message.pushName,

    ppUrl: message.ppUrl || null,

    isGroup: message.isGroup,

    isAdmin: message.isAdmin || false,

    isBotAdmin: message.isBotAdmin || false,

    groupMetadata: message.groupMetadata || null,

    botIds,

    isBotOwner: isOwnerMessage

});

        return res.json({
            ...result,
            ...(levelUpResult ? { levelUp: levelUpResult } : {})
        });

    } catch (error) {

        console.error("EXECUTE API ERROR:", error);

        return res.status(500).json({

            success: false,

            message: error.message || "Internal Server Error"

        });

    }

});

export default router;
