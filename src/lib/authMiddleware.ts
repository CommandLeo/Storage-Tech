import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler = (request: NextRequest, context?: any) => Promise<Response>;

export function withAuth(handler: Handler) {
  return auth((request, context) => {
    if (!request.auth?.user) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }

    return handler(request, { ...context, session: request.auth });
  });
}

export function withRoleAuth(handler: Handler) {
  return auth((request, context) => {
    if (!request.auth?.user) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }

    if (!request.auth.user.hasAccess) {
      return Response.json({ error: "Access denied - insufficient permissions" }, { status: 403 });
    }

    return handler(request, { ...context, session: request.auth });
  });
}
