import { textTool } from "../../utils/textTool.js";

export default textTool({
    name: "reverse",
    description: "Reverse a piece of text.",
    transform: (text) => text.split("").reverse().join("")
});
