import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "antilink",

    description: "Manage Anti-Link.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(

            ctx,

            "antilink"

        );

    }

};
