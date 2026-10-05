import { textTool } from "../../utils/textTool.js";

export default textTool({
    name: "unbase64",
    description: "Decode base64 back to text.",
    usageHint: "aGVsbG8=",
    transform: (text) => {
        const decoded = Buffer.from(text, "base64").toString("utf8");
        if (Buffer.from(decoded, "utf8").toString("base64").replace(/=+$/, "")
            !== text.trim().replace(/=+$/, "")) {
            throw new Error("that doesn't look like valid base64");
        }
        return decoded;
    }
});
