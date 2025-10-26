import type { NextRequest } from "next/server";
import type { Session } from "next-auth";
import type { RawFile } from "@discordjs/rest";
import { withRoleAuth } from "@/lib/authMiddleware";
import { postToThread, sendArchiveLog } from "@/lib/archiveUtils";
import { ArchiveError } from "@/lib/errors";

async function handler(request: NextRequest, { session }: { session: Session }) {
  try {
    const formData = await request.formData();

    const threadId = formData.get("threadId");
    const content = formData.get("content");

    if (!threadId || typeof threadId !== "string" || !content || typeof content !== "string") {
      throw new ArchiveError("Thread ID and content are required");
    }

    const files: RawFile[] = [];
    for (const file of formData.getAll("files")) {
      if (file instanceof File) {
        files.push({
          data: Buffer.from(await file.arrayBuffer()),
          name: file.name,
          contentType: file.type,
        });
      }
    }

    const result = await postToThread({ threadId, content, files });

    if (result.guildId) {
      await sendArchiveLog({
        action: "Message Posted",
        guildId: result.guildId,
        threadId: result.threadId,
        messageId: result.messageId,
        userId: session.user.discord_id,
      });
    }

    return Response.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof ArchiveError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    console.error("Error posting to thread:", error.message);
    const errorMessage = process.env.NODE_ENV === "development" ? error.message : "An internal server error occurred";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}

export const POST = withRoleAuth(handler);
