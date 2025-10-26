import type { NextRequest } from "next/server";
import type { RawFile } from "@discordjs/rest";
import type { Session } from "next-auth";
import { withRoleAuth } from "@/lib/authMiddleware";
import { createPost, sendArchiveLog } from "@/lib/archiveUtils";
import { ArchiveError } from "@/lib/errors";

async function handler(request: NextRequest, { session }: { session: Session }) {
  try {
    const formData = await request.formData();

    const channelName = formData.get("channelName");
    const threadName = formData.get("threadName");
    const content = formData.get("content");
    const tagsString = formData.get("tags");

    if (!channelName || typeof channelName !== "string") {
      throw new ArchiveError("Channel name is required");
    }

    if (!threadName || typeof threadName !== "string" || !content || typeof content !== "string") {
      throw new ArchiveError("Thread name and content are required");
    }

    let tags: string[] = [];
    if (tagsString && typeof tagsString === "string") {
      try {
        tags = JSON.parse(tagsString);
      } catch {
        throw new ArchiveError("Tags must be a valid JSON array");
      }
    }
    if (!Array.isArray(tags)) {
      throw new ArchiveError("Tags must be an array");
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

    const result = await createPost({
      channelName,
      threadName,
      content,
      files,
      tags,
    });

    if (result.guildId) {
      await sendArchiveLog({
        action: "Post Created",
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

    console.error("Error creating post:", error.message);
    const errorMessage = process.env.NODE_ENV === "development" ? error.message : "An internal server error occurred";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}

export const POST = withRoleAuth(handler);
