const PUBLIC_URL =
    process.env.PUBLIC_URL ||
    "https://kenya-ultra-core-git-900495233478.europe-west1.run.app";

export function assetUrl(relativePath) {

    return `${PUBLIC_URL.replace(/\/$/, "")}/assets/${relativePath.replace(/^\//, "")}`;

}
