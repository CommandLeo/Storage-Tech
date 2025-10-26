"use client";

import { Box, Container, Fade, Typography } from "@mui/material";
import { HeroTitle, HeroSubtitle, MainHeroSection } from "@/components/StyledComponents";

function HomePage() {
  return (
    <Fade in timeout={600}>
      <Box>
        <MainHeroSection>
          <Container maxWidth="lg">
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <HeroTitle variant="h1">Storage Tech</HeroTitle>
              <HeroSubtitle variant="h5" sx={{ maxWidth: "100%" }}>
                Minecraft Storage & Sorting Solutions for everyone
              </HeroSubtitle>
            </Box>
          </Container>
        </MainHeroSection>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h1" sx={{ textAlign: "center" }}>
              WIP
            </Typography>
          </Box>
        </Container>
      </Box>
    </Fade>
  );
}

export default HomePage;
