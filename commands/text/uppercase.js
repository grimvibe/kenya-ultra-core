import { textTool } from "../../utils/textTool.js";

export default textTool({
    name: "uppercase",
    description: "Convert text to UPPERCASE.",
    transform: (text) => text.toUpperCase()
});
