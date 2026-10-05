import { textTool } from "../../utils/textTool.js";

export default textTool({
    name: "binary",
    description: "Convert text to binary.",
    transform: (text) =>
        text.split("").map(ch => ch.charCodeAt(0).toString(2).padStart(8, "0")).join(" ")
});
