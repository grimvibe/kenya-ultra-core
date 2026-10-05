import { textTool } from "../../utils/textTool.js";
import { MORSE_MAP } from "../../utils/morseCode.js";

export default textTool({
    name: "morse",
    description: "Convert text to morse code.",
    transform: (text) =>
        text.toLowerCase().split("").map(ch => {
            if (!(ch in MORSE_MAP)) throw new Error(`no morse mapping for "${ch}"`);
            return MORSE_MAP[ch];
        }).join(" ")
});
