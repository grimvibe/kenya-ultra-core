import { textTool } from "../../utils/textTool.js";

export default textTool({
    name: "unhex",
    description: "Convert hexadecimal back to text.",
    usageHint: "68656c6c6f",
    transform: (text) => {
        const clean = text.replace(/\s/g, "");
        if (!/^[0-9a-fA-F]+$/.test(clean) || clean.length % 2 !== 0) {
            throw new Error("that doesn't look like valid hex");
        }
        return Buffer.from(clean, "hex").toString("utf8");
    }
});
