"use client";
import { Box } from "@mui/material";
import { GradientText, GradientButton } from "@/components/StyledComponents";

export default function NotFound() {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        gap: 4,
      }}
    >
      <GradientText variant="h2" sx={{ fontWeight: 700, textAlign: "center" }}>
        404 Not Found
      </GradientText>
      <GradientButton href="/" sx={{ fontWeight: 600, py: 1.5, fontSize: "1.1rem", minWidth: 180 }}>
        Go Home
      </GradientButton>
    </Box>
  );
}
