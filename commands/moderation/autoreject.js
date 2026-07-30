import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "autoreject",

    description: "Automatically reject group join requests.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "autoreject");

    }

};
