import { textTool } from "../../utils/textTool.js";

export default textTool({
    name: "space",
    description: "S p r e a d   o u t   e v e r y   l e t t e r.",
    transform: (text) => text.split("").join(" ")
});
