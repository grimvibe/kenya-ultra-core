import Reply from "../utils/reply.js";

export default {
    name: "calc",
    description: "Evaluate a basic math expression. Usage: .calc 12 * (4 + 3)",
    category: "Utility",

    async execute(message) {

        const expression = (message.args || []).join(" ").trim();

        if (!expression) {
            return Reply.error("Please provide an expression. Example: .calc 12 * (4 + 3)");
        }

        // Only allow digits, operators, parentheses, decimals, and spaces —
        // this is what makes it safe to pass into Function() below.
        const isSafe = /^[0-9+\-*/().\s%]+$/.test(expression);

        if (!isSafe) {
            return Reply.error("Invalid characters in expression. Only numbers and + - * / ( ) % are allowed.");
        }

        try {

            const result = Function(`"use strict"; return (${expression})`)();

            if (!Number.isFinite(result)) {
                return Reply.error("That expression didn't produce a valid number.");
            }

            return Reply.text(`🧮 *Calculator*\n\n${expression} = *${result}*`);

        } catch (error) {

            return Reply.error("Couldn't evaluate that expression. Check your syntax.");

        }

    }

};
