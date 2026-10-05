import axios from "axios";
import Reply from "../utils/reply.js";

const OWNER = "lawrencenjeri4-lgtm";
const REPO = "Kenya-ultra";

export default {

    name: "repo",

    aliases: ["sourcecode"],

    description: "Show info about the Kenya-Ultra source code / GitHub repo.",

    category: "General",

    usage: ".repo",

    async execute() {

        try {

            const { data: repo } = await axios.get(
                `https://api.github.com/repos/${OWNER}/${REPO}`,
                {
                    headers: { "User-Agent": "Kenya-Ultra-Bot" },
                    timeout: 15000
                }
            );

            return Reply.image({

                url: repo.owner.avatar_url,

                caption:
`🇰🇪 *${repo.full_name}*

${repo.description || "No description"}

⭐ ${repo.stargazers_count.toLocaleString()} stars | 🍴 ${repo.forks_count.toLocaleString()} forks
📝 License: ${repo.license?.name || "N/A"}
🕒 Last updated: ${new Date(repo.pushed_at).toDateString()}

🔗 ${repo.html_url}

⭐ If you like Kenya-Ultra, drop a star on the repo!

🐺 Powered by Kenya-Ultra 👑`

            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch repo info right now."
            );

        }

    }

};
