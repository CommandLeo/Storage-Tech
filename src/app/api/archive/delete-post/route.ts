import type { NextRequest } from "next/server";
import type { Session } from "next-auth";
import { withRoleAuth } from "@/lib/authMiddleware";
import { deletePost, sendArchiveLog } from "@/lib/archiveUtils";
import { ArchiveError } from "@/lib/errors";

async function handler(request: NextRequest, { session }: { session: Session }) {
  try {
    const { threadId, messageId } = await request.json();

    if (!threadId || !messageId) {
      throw new ArchiveError("Thread ID and message ID are required");
    }

    const result = await deletePost({ threadId, messageId });

    if (result.guildId) {
      await sendArchiveLog({
        action: "Post Deleted",
        guildId: result.guildId,
        threadId: result.threadId,
        messageId: result.messageId,
        userId: session.user.discord_id,
      });
    }

    return Response.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof ArchiveError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    console.error("Error deleting post:", error.message);
    const errorMessage = process.env.NODE_ENV === "development" ? error.message : "An internal server error occurred";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}

export const DELETE = withRoleAuth(handler);
