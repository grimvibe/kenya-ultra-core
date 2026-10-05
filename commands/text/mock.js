import { textTool } from "../../utils/textTool.js";

export default textTool({
    name: "mock",
    description: "sPoNgEbOb mOcK cAsE a piece of text.",
    transform: (text) =>
        text
            .split("")
            .map((ch, i) => (i % 2 === 0 ? ch.toLowerCase() : ch.toUpperCase()))
            .join("")
});
