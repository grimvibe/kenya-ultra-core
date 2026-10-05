import { textTool } from "../../utils/textTool.js";

const ZALGO_MARKS = [
    "\u0300", "\u0301", "\u0302", "\u0303", "\u0304", "\u0305",
    "\u0306", "\u0307", "\u0308", "\u0309", "\u030a", "\u030b",
    "\u0316", "\u0317", "\u0318", "\u0319", "\u031c", "\u031d",
    "\u0325", "\u0326", "\u032e", "\u0333", "\u0334"
];

function zalgoify(char, intensity) {
    if (char === " ") return char;
    let out = char;
    for (let i = 0; i < intensity; i++) {
        out += ZALGO_MARKS[Math.floor(Math.random() * ZALGO_MARKS.length)];
    }
    return out;
}

export default textTool({
    name: "zalgo",
    description: "C̵o̸r̶r̴u̵p̷t̸ text with zalgo marks.",
    transform: (text) => text.split("").map(ch => zalgoify(ch, 4)).join("")
});
