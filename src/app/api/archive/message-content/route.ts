import type { NextRequest } from "next/server";
import { withRoleAuth } from "@/lib/authMiddleware";
import { getMessageContent } from "@/lib/archiveUtils";
import { ArchiveError } from "@/lib/errors";

async function handler(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const threadId = searchParams.get("threadId");
    const messageId = searchParams.get("messageId");

    if (!threadId || typeof threadId !== "string" || !messageId || typeof messageId !== "string") {
      throw new ArchiveError("Missing thread id or message id");
    }

    const messageContent = await getMessageContent({ threadId, messageId });
    return Response.json({ content: messageContent }, { status: 200 });
  } catch (error) {
    if (error instanceof ArchiveError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    const errorMessage = process.env.NODE_ENV === "development" ? error.message : "An internal server error occurred";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}

export const GET = withRoleAuth(handler);
