export async function health(client) {

    return await client.request("/health");

}
