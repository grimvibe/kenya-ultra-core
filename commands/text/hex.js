import { textTool } from "../../utils/textTool.js";

export default textTool({
    name: "hex",
    description: "Convert text to hexadecimal.",
    transform: (text) => Buffer.from(text, "utf8").toString("hex")
});
