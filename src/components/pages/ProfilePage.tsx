"use client";

import { Typography, CardContent, Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { PageContainer, ProfileCard, ProfileHeaderBox, LargeAvatar } from "@/components/StyledComponents";

function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user || null;

  if (!user) {
    return (
      <PageContainer maxWidth="md">
        <Typography variant="h6" align="center">
          Loading...
        </Typography>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="md">
      <ProfileCard>
        <CardContent sx={{ p: 4 }}>
          <ProfileHeaderBox>
            <LargeAvatar src={user.image ?? undefined}>{user.username?.charAt(0)}</LargeAvatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                {user.name || user.username || "User"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "monospace", mb: 1 }}>
                @{user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "monospace", mb: 2 }}>
                ID: {user.discord_id}
              </Typography>
            </Box>
          </ProfileHeaderBox>
        </CardContent>
      </ProfileCard>
    </PageContainer>
  );
}

export default ProfilePage;
