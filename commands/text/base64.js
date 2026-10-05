import { textTool } from "../../utils/textTool.js";

export default textTool({
    name: "base64",
    description: "Encode text as base64.",
    transform: (text) => Buffer.from(text, "utf8").toString("base64")
});
