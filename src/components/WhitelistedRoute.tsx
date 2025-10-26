"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const WhitelistedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = !!session?.user;
  const loading = status === "loading";
  const hasAccess = session?.user?.hasAccess ?? false;

  useEffect(() => {
    if (!loading && (!isAuthenticated || !hasAccess)) {
      router.push("/");
    }
  }, [isAuthenticated, hasAccess, loading, router]);

  if (loading || !hasAccess) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
          flexDirection: "column",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  return children;
};

export default WhitelistedRoute;
