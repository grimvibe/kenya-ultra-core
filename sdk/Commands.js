export async function commands(client) {

    return await client.request("/commands");

}
