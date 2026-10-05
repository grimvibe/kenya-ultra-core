import { textTool } from "../../utils/textTool.js";

export default textTool({
    name: "lowercase",
    description: "Convert text to lowercase.",
    transform: (text) => text.toLowerCase()
});
