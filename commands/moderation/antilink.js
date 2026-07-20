import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "antilink",

    description: "Enable or disable Anti-Link.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(

            ctx,

            "antilink",

            "Anti-Link"

        );

    }

};
