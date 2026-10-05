import { textTool } from "../../utils/textTool.js";

function rot13Char(ch) {
    const code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + 13) % 26) + 65);
    if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + 13) % 26) + 97);
    return ch;
}

export default textTool({
    name: "rot13",
    description: "ROT13 encode/decode text (it's its own inverse).",
    transform: (text) => text.split("").map(rot13Char).join("")
});
