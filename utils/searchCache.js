const cache = new Map();

class SearchCache {

    set(user, results) {

        cache.set(user, {
            results,
            created: Date.now()
        });

    }

    get(user) {

        const data = cache.get(user);

        if (!data) return null;

        // expire after 10 minutes
        if (Date.now() - data.created > 600000) {

            cache.delete(user);

            return null;

        }

        return data.results;

    }

    clear(user) {

        cache.delete(user);

    }

}

export default new SearchCache();
