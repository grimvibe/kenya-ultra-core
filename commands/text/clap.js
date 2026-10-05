import { textTool } from "../../utils/textTool.js";

export default textTool({
    name: "clap",
    description: "👏 Clap between every word.",
    transform: (text) => text.trim().split(/\s+/).join(" 👏 ")
});
