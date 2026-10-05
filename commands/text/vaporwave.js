import { textTool } from "../../utils/textTool.js";

function toFullwidth(char) {
    const code = char.charCodeAt(0);
    if (code === 0x20) return "\u3000";
    if (code >= 0x21 && code <= 0x7e) {
        return String.fromCharCode(code - 0x21 + 0xff01);
    }
    return char;
}

export default textTool({
    name: "vaporwave",
    description: "Ａｅｓｔｈｅｔｉｃ vaporwave text.",
    transform: (text) => text.split("").map(toFullwidth).join("")
});
