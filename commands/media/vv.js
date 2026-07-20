import { recoverViewOnce } from "../../services/viewOnceService.js";

export default {

    name: "vv",

    aliases: ["once", "readonce"],

    description: "Recover View Once media.",

    category: "Media",

    async execute(ctx) {

        console.log("================================");
        console.log("Context keys:", Object.keys(ctx));
        console.log("================================");

        return await recoverViewOnce(ctx);

    }

};
