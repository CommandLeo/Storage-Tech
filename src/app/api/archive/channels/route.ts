import config from "@/lib/config";

export async function GET() {
  const configChannels = config.channels;

  const channels = Object.values(configChannels).flat();

  if (configChannels) {
    return Response.json({ channels });
  } else {
    return Response.json({ error: "No channels configured" }, { status: 500 });
  }
}
