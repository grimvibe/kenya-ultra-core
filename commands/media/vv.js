import Reply from "../../utils/reply.js";
import { recoverViewOnce } from "../../services/viewOnceService.js";

export default {

    name: "vv",

    aliases: ["once", "readonce"],

    description: "Recover a View Once photo or video.",

    category: "Media",

    async execute(ctx) {

        const result = await recoverViewOnce(ctx);

        return result;

    }

};
