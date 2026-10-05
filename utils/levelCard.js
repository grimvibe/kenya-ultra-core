import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import axios from "axios";
import fs from "fs";
import path from "path";

// Register bundled fonts so text renders even when the server has no
// system fonts installed (otherwise the card shows no text at all).
const FONT_DIR = path.join(process.cwd(), "assets", "fonts");

for (const file of ["DejaVuSans.ttf", "DejaVuSans-Bold.ttf"]) {

    try {

        const fontPath = path.join(FONT_DIR, file);

        if (fs.existsSync(fontPath)) {
            GlobalFonts.registerFromPath(fontPath, "DejaVu Sans");
        }

    } catch {}

}

const WIDTH = 900;
const HEIGHT = 320;

const GREEN = "#0f3d2e";
const ACCENT = "#22c55e";

async function fetchAvatar(avatarUrl) {

    if (!avatarUrl) return null;

    try {

        const { data } = await axios.get(avatarUrl, {
            responseType: "arraybuffer",
            timeout: 8000
        });

        return await loadImage(Buffer.from(data));

    } catch {
        return null;
    }

}

function drawInitialsAvatar(ctx, cx, cy, radius, name) {

    const initial = (name || "?").trim().charAt(0).toUpperCase();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#1e293b";
    ctx.fill();

    ctx.fillStyle = ACCENT;
    ctx.font = `bold ${radius}px 'DejaVu Sans'`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initial, cx, cy + 4);
    ctx.restore();

}

function drawAvatarRing(ctx, cx, cy, radius) {

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 6, 0, Math.PI * 2);
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();

}

/**
 * Renders a "LEVEL UP" card as a PNG buffer, styled to match the
 * green card look used elsewhere in Kenya-Ultra.
 *
 * @param {object} opts
 * @param {string} opts.userId - shown as the WhatsApp id / number line
 * @param {string} opts.name - display name (pushName), used for initials fallback
 * @param {number} opts.level
 * @param {string} opts.rank
 * @param {number} opts.totalExp
 * @param {string|null} opts.avatarUrl - optional profile picture URL
 * @returns {Promise<Buffer>}
 */
export async function renderLevelUpCard({
    userId,
    name,
    level,
    rank,
    totalExp,
    avatarUrl = null
}) {

    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = GREEN;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Subtle border
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, WIDTH - 2, HEIGHT - 2);

    // Avatar
    const cx = 150;
    const cy = HEIGHT / 2;
    const radius = 90;

    const avatarImg = await fetchAvatar(avatarUrl);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    if (avatarImg) {
        ctx.drawImage(avatarImg, cx - radius, cy - radius, radius * 2, radius * 2);
    } else {
        drawInitialsAvatar(ctx, cx, cy, radius, name);
    }

    ctx.restore();
    drawAvatarRing(ctx, cx, cy, radius);

    // Level pill under avatar
    ctx.fillStyle = ACCENT;
    const pillW = 110;
    const pillH = 32;
    const pillX = cx - pillW / 2;
    const pillY = cy + radius + 14;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 16);
    ctx.fill();

    ctx.fillStyle = "#04140c";
    ctx.font = "bold 18px 'DejaVu Sans'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`LEVEL ${level}`, cx, pillY + pillH / 2 + 1);

    // Text block
    const textX = 300;

    ctx.textAlign = "left";
    ctx.fillStyle = ACCENT;
    ctx.font = "bold 40px 'DejaVu Sans'";
    ctx.fillText("** LEVEL UP! **", textX, 90);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "22px 'DejaVu Sans'";
    ctx.fillText(userId || "", textX, 135);

    ctx.fillStyle = "#7dd3fc";
    ctx.font = "24px 'DejaVu Sans'";
    ctx.fillText(`Reached ${rank.toUpperCase()}`, textX, 175);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "20px 'DejaVu Sans'";
    ctx.fillText(`Total EXP: ${totalExp}`, textX, 210);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "26px 'DejaVu Sans'";
    ctx.fillText(name || "Member", textX, 255);

    ctx.fillStyle = "#64748b";
    ctx.font = "16px 'DejaVu Sans'";
    ctx.textAlign = "right";
    ctx.fillText("POWERED BY KENYA-ULTRA", WIDTH - 24, HEIGHT - 20);

    return canvas.encode("png");

}
