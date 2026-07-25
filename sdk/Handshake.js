export async function handshake(client) {

    return await client.request("/handshake");

}
