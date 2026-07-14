import ping from "./ping.js";
import menu from "./menu.js";

const commands = new Map();

commands.set(ping.name, ping);
commands.set(menu.name, menu);

export default commands;
