import axios from "axios";
import Reply from "../utils/reply.js";

export default {

    name: "github",

    aliases: ["gh"],

    description: "Look up a GitHub user or repository.",

    category: "Utility",

    usage: ".github <username>  |  .github <owner/repo>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a GitHub username or "owner/repo".

Examples:
.github torvalds
.github facebook/react`
            );

        }

        const query = message.args[0];
        const headers = { "User-Agent": "Kenya-Ultra-Bot" };

        try {

            if (query.includes("/")) {

                const { data: repo } = await axios.get(
                    `https://api.github.com/repos/${query}`,
                    { headers, timeout: 15000 }
                );

                return Reply.image({

                    url: repo.owner.avatar_url,

                    caption:
`📦 *${repo.full_name}*

${repo.description || "No description"}

⭐ ${repo.stargazers_count.toLocaleString()} | 🍴 ${repo.forks_count.toLocaleString()} | 👁 ${repo.watchers_count.toLocaleString()}
📝 Language: ${repo.language || "N/A"}
🔗 ${repo.html_url}

🐺 Powered by Kenya-Ultra 👑`

                });

            }

            const { data: user } = await axios.get(
                `https://api.github.com/users/${query}`,
                { headers, timeout: 15000 }
            );

            return Reply.image({

                url: user.avatar_url,

                caption:
`👤 *${user.name || user.login}* (@${user.login})

${user.bio || "No bio"}

📦 Repos: ${user.public_repos} | 👥 Followers: ${user.followers} | Following: ${user.following}
🔗 ${user.html_url}

🐺 Powered by Kenya-Ultra 👑`

            });

        } catch (err) {

            if (err.response?.status === 404) {
                return Reply.error("No matching GitHub user or repository found.");
            }

            return Reply.error(
                err.message || "Failed to fetch data from GitHub."
            );

        }

    }

};
