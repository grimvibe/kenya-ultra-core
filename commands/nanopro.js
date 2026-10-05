export default {

    name: "nanopro",

    description: "Blend up to 4 images together with an AI prompt. Send/reply images one at a time, then finish with .nanopro done <prompt>.",

    category: "AI",

    usage: ".nanopro (send or reply with images, then .nanopro done <prompt>)",

    async execute(ctx) {

        // The whole collect/blend flow needs the live socket to
        // download each image and upload it, so — same as
        // group_status — this command just hands off to the
        // gateway with whatever text came after the command.
        // Session state (which images have been collected so far)
        // is tracked gateway-side, per sender.

        const input = (ctx.args || []).join(" ").trim();

        return {
            success: true,
            action: "nanopro",
            input
        };

    }

};
