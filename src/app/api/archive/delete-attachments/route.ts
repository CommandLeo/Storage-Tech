import type { NextRequest } from "next/server";
import type { Session } from "next-auth";
import { withRoleAuth } from "@/lib/authMiddleware";
import { deleteAllAttachments, sendArchiveLog } from "@/lib/archiveUtils";
import { ArchiveError } from "@/lib/errors";

async function handler(request: NextRequest, { session }: { session: Session }) {
  try {
    const { threadId, messageId } = await request.json();

    if (!threadId || !messageId) {
      throw new ArchiveError("Missing threadId or messageId");
    }

    const result = await deleteAllAttachments({ threadId, messageId });

    if (result.guildId) {
      await sendArchiveLog({
        action: "Attachments Deleted",
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

    const errorMessage = process.env.NODE_ENV === "development" ? error.message : "An internal server error occurred";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}

export const POST = withRoleAuth(handler);
