"use client";

import { Box, Container, Fade, Typography, Grid, Card, CardContent } from "@mui/material";
import { HeroTitle, HeroSubtitle, MainHeroSection } from "@/components/StyledComponents";
import { Storage, Build, Speed, Security } from "@mui/icons-material";

function HomePage() {
  const features = [
    {
      icon: <Storage sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Efficient Storage",
      description: "Advanced storage systems designed for maximum efficiency",
    },
    {
      icon: <Build sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Easy to Build",
      description: "Step-by-step guides for all skill levels",
    },
    {
      icon: <Speed sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "High Performance",
      description: "Optimized sorting systems for speed",
    },
    {
      icon: <Security sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Reliable Designs",
      description: "Tested and proven redstone circuits",
    },
  ];

  return (
    <Fade in timeout={600}>
      <Box>
        <MainHeroSection>
          <Container maxWidth="lg">
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <HeroTitle variant="h1">Storage Tech</HeroTitle>
              <HeroSubtitle variant="h5" sx={{ maxWidth: "100%", textAlign: "center" }}>
                Minecraft Storage & Sorting Solutions for everyone
              </HeroSubtitle>
            </Box>
          </Container>
        </MainHeroSection>
        
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: "center", 
              mb: 6,
              fontWeight: 600,
              color: "text.primary"
            }}
          >
            What We Offer
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Fade in timeout={800 + index * 100}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        p: 3,
                      }}
                    >
                      <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                      <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Fade>
  );
}

export default HomePage;
