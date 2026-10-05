import { textTool } from "../../utils/textTool.js";
import { MORSE_REVERSE } from "../../utils/morseCode.js";

export default textTool({
    name: "unmorse",
    description: "Convert morse code back to text.",
    usageHint: ".... .. / - .... . .-. .",
    transform: (text) =>
        text.trim().split(" ").map(code => {
            if (!(code in MORSE_REVERSE)) throw new Error(`"${code}" isn't valid morse`);
            return MORSE_REVERSE[code];
        }).join("")
});
