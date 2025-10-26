"use client";

import ArchiveManager from "@/components/pages/ArchiveManager";
import WhitelistedRoute from "@/components/WhitelistedRoute";

export default function ArchiveManagerPage() {
  return (
    <WhitelistedRoute>
      <ArchiveManager />
    </WhitelistedRoute>
  );
}
