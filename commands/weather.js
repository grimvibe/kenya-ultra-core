import MaxxTech from "../utils/maxxtech.js";
import Reply from "../utils/reply.js";

export default {

    name: "weather",

    description: "Get current weather for a city.",

    category: "Tools",

    usage: ".weather <city>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a city.

Example:
.weather Nairobi`
            );

        }

        const city = message.args.join(" ");

        try {

            const w = await MaxxTech.request(
                "/weather",
                { q: city }
            );

            return Reply.text(
`🌤️ *Weather in ${w.city}, ${w.country}*

🌡️ Temp: ${w.temperature_c}°C (feels like ${w.feels_like_c}°C)
☁️ ${w.description}
💧 Humidity: ${w.humidity}%
🌬️ Wind: ${w.wind_kmph} km/h ${w.wind_direction}
👁️ Visibility: ${w.visibility_km} km
☀️ UV Index: ${w.uv_index}

━━━━━━━━━━━━━━

🐺 Powered by Kenya-Ultra 👑`
            );

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch weather."
            );

        }

    }

};
