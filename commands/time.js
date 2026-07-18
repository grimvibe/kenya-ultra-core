import Reply from "../utils/reply.js";

export default {
    name: "time",
    description: "Show the current time. Usage: .time [timezone] (default: Africa/Nairobi)",
    category: "General",

    async execute(message) {

        const timezone = (message.args && message.args[0]) || "Africa/Nairobi";

        try {

            const formatter = new Intl.DateTimeFormat("en-GB", {
                timeZone: timezone,
                dateStyle: "full",
                timeStyle: "medium"
            });

            const formatted = formatter.format(new Date());

            return Reply.text(`🕒 *Current Time*\n\n${formatted}\n\n📍 Timezone: ${timezone}`);

        } catch (error) {

            return Reply.error(`Unknown timezone "${timezone}". Try something like "Africa/Nairobi" or "Europe/London".`);

        }

    }

};
