import Reply from "../utils/reply.js";

// NOTE: The real logic for this command runs entirely client-side
// (see clientActions.js — checkAutoReply / handleAutoReplyCommand)
// because auto-reply needs to react to every incoming message and
// keep per-instance state, not just handle a single command call.
// The client intercepts ".autoreply" / ".ar" before it ever reaches
// Core, so this file exists only so the command shows up in .menu.
// This execute() is a fallback and should not normally run.

export default {

    name: "autoreply",

    aliases: ["ar"],

    description: "Configure auto-reply for DMs/group mentions (owner only).",

    category: "Owner",

    usage: ".autoreply [on|off|dm|group|setmsg|schedule|resetcooldowns]",

    async execute() {

        return Reply.error(
            "This command runs locally on your bot instance — try sending it again from your own number."
        );

    }

};
