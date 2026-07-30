import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "autoapprove",

    description: "Automatically approve group join requests.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "autoapprove");

    }

};
