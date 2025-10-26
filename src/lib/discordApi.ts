import { REST } from "@discordjs/rest";
import { API } from "@discordjs/core/http-only";

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN);
const discordApi = new API(rest);

export default discordApi;
