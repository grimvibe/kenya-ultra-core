class CoreClient {

    constructor(baseURL) {
        this.baseURL = baseURL.replace(/\/$/, "");
    }

    async request(endpoint) {

        const res = await fetch(this.baseURL + endpoint);

        if (!res.ok) {
            throw new Error(`Core request failed: ${endpoint}`);
        }

        return res.json();

    }

}

export default CoreClient;
