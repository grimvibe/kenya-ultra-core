// Parses simple duration shorthand into milliseconds.
// Supports: s (seconds), m (minutes), h (hours), d (days)
// Example: "10m" -> 600000, "2h" -> 7200000

const UNITS = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
};

export default function parseDuration(input) {

    if (!input) return null;

    const match = String(input).trim().match(/^(\d+)\s*(s|m|h|d)$/i);

    if (!match) return null;

    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    if (!value || value <= 0) return null;

    return value * UNITS[unit];

}
