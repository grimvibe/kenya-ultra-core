import { textTool } from "../../utils/textTool.js";

export default textTool({
    name: "unbinary",
    description: "Convert binary back to text.",
    usageHint: "01101000 01101001",
    transform: (text) => {
        const groups = text.trim().split(/\s+/);
        if (!groups.every(g => /^[01]{1,8}$/.test(g))) {
            throw new Error("that doesn't look like valid 8-bit binary");
        }
        return groups.map(g => String.fromCharCode(parseInt(g, 2))).join("");
    }
});
