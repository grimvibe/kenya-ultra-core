import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "anticontact",

    description: "Manage Anti-Contact.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "anticontact");

    }

};
