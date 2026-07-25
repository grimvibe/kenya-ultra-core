export async function manifest(client) {

    return await client.request("/manifest");

}
