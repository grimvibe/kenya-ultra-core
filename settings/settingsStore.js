import defaults from "./defaults.js";
import cache from "./cache.js";

export async function getGroupSettings(groupId) {

    if (!cache.has(groupId)) {

        cache.set(groupId, { ...defaults });

    }

    return cache.get(groupId);

}

export async function setGroupSetting(groupId, key, value) {

    const settings = await getGroupSettings(groupId);

    settings[key] = value;

    cache.set(groupId, settings);

    return settings;

}

export async function toggleGroupSetting(groupId, key) {

    const settings = await getGroupSettings(groupId);

    settings[key] = !settings[key];

    cache.set(groupId, settings);

    return settings[key];

}
