import defaults from "./defaults.js";
import cache from "./cache.js";
import {
    loadGroupSettings,
    saveGroupSettings
} from "../auth/sessionStore.js";

// In-memory `cache` is kept as a fast read-through layer for the
// lifetime of a single container instance, but every write now goes
// to Redis too, and every cache miss falls back to Redis before
// falling back to defaults. Previously this only ever lived in
// memory, so settings silently vanished on cold starts and weren't
// shared across concurrent Cloud Run instances.

// `defaults` is a single module-level object shared by every group.
// `{ ...defaults, ...stored }` only shallow-copies the TOP level, so
// any feature the caller never overrides (e.g. `welcome`, `goodbye`,
// or any anti-* toggle a group hasn't touched yet) comes through as
// the exact same nested object reference as `defaults.welcome`
// itself — not a copy of it. Every place that then does
// `current.enabled = true` (toggleFeature, lockall/unlockall, etc.)
// was mutating that shared `defaults` object in place. The result:
// toggling `.welcome on` in one group could silently flip `.welcome`
// on for every OTHER group that had never configured it, for the
// lifetime of the process — which is exactly the kind of "sometimes
// works, sometimes doesn't" behavior welcome/goodbye were showing.
// `mergeSettings` below always returns brand-new nested objects so
// no group's settings can ever alias another's (or the defaults).
function mergeSettings(base, stored) {

    const result = {};

    for (const key of Object.keys(base)) {

        const baseValue = base[key];
        const storedValue = stored ? stored[key] : undefined;

        if (
            baseValue &&
            typeof baseValue === "object" &&
            !Array.isArray(baseValue)
        ) {

            result[key] = {
                ...baseValue,
                ...(storedValue && typeof storedValue === "object"
                    ? storedValue
                    : {})
            };

        } else {

            result[key] =
                storedValue !== undefined ? storedValue : baseValue;

        }

    }

    // Forward-compatibility: keep any keys a group saved previously
    // that aren't (or aren't anymore) part of `defaults`.
    if (stored) {

        for (const key of Object.keys(stored)) {

            if (!(key in result)) {
                result[key] = stored[key];
            }

        }

    }

    return result;

}

export async function getGroupSettings(groupId) {

    if (cache.has(groupId)) {
        return cache.get(groupId);
    }

    const stored = await loadGroupSettings(groupId);

    const settings = mergeSettings(defaults, stored);

    cache.set(groupId, settings);

    return settings;

}

export async function setGroupSetting(groupId, key, value) {

    const settings = await getGroupSettings(groupId);

    settings[key] = value;

    cache.set(groupId, settings);

    await saveGroupSettings(groupId, settings);

    return settings;

}

export async function toggleGroupSetting(groupId, key) {

    const settings = await getGroupSettings(groupId);

    settings[key] = !settings[key];

    cache.set(groupId, settings);

    await saveGroupSettings(groupId, settings);

    return settings[key];

}

export async function resetGroupSettings(groupId) {

    // Same reasoning as getGroupSettings — must be a deep copy, not
    // a shallow one, or every group ever reset shares nested objects
    // with `defaults` (and each other) again.
    const settings = mergeSettings(defaults, null);

    cache.set(groupId, settings);

    await saveGroupSettings(groupId, settings);

    return settings;

}
