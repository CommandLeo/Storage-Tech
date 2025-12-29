"use client";

import { 
  Box, 
  Container, 
  Fade, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Button,
  Paper,
  Stack,
  Chip,
  alpha
} from "@mui/material";
import { 
  HeroTitle, 
  HeroSubtitle, 
  MainHeroSection,
  GradientButton 
} from "@/components/StyledComponents";
import { 
  Storage, 
  Build, 
  Speed, 
  Security,
  TrendingUp,
  People,
  Inventory,
  ArrowForward,
  MenuBook,
  AutoAwesome
} from "@mui/icons-material";
import Link from "next/link";

function HomePage() {
  const features = [
    {
      icon: <Storage sx={{ fontSize: 56, color: "primary.main" }} />,
      title: "Efficient Storage",
      description: "Advanced storage systems designed for maximum efficiency and scalability",
      highlight: "Optimized",
    },
    {
      icon: <Build sx={{ fontSize: 56, color: "primary.main" }} />,
      title: "Easy to Build",
      description: "Step-by-step guides and schematics for all skill levels, from beginner to expert",
      highlight: "Beginner Friendly",
    },
    {
      icon: <Speed sx={{ fontSize: 56, color: "primary.main" }} />,
      title: "High Performance",
      description: "Lightning-fast sorting systems optimized for maximum item throughput",
      highlight: "Fast",
    },
    {
      icon: <Security sx={{ fontSize: 56, color: "primary.main" }} />,
      title: "Reliable Designs",
      description: "Tested and proven redstone circuits that work consistently across versions",
      highlight: "Tested",
    },
  ];

  const stats = [
    { value: "500+", label: "Storage Designs", icon: <Inventory /> },
    { value: "10K+", label: "Active Users", icon: <People /> },
    { value: "99.9%", label: "Reliability", icon: <TrendingUp /> },
  ];

  const benefits = [
    {
      title: "Complete Documentation",
      description: "Detailed guides, video tutorials, and troubleshooting help",
      icon: <MenuBook sx={{ fontSize: 40 }} />,
    },
    {
      title: "Active Community",
      description: "Join thousands of players sharing designs and helping each other",
      icon: <People sx={{ fontSize: 40 }} />,
    },
    {
      title: "Regular Updates",
      description: "Stay current with the latest Minecraft versions and optimizations",
      icon: <AutoAwesome sx={{ fontSize: 40 }} />,
    },
  ];

  return (
    <Fade in timeout={600}>
      <Box>
        {/* Hero Section */}
        <MainHeroSection>
          <Container maxWidth="lg">
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Chip 
                label="The #1 Minecraft Storage Resource" 
                color="primary" 
                sx={{ mb: 3, fontWeight: 600 }}
              />
              <HeroTitle variant="h1">Storage Tech</HeroTitle>
              <HeroSubtitle variant="h5" sx={{ maxWidth: "100%", textAlign: "center", mb: 4 }}>
                Master Minecraft Storage & Sorting with proven designs, tutorials, and community support
              </HeroSubtitle>
              
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
                <GradientButton
                  component={Link}
                  href="/archive-manager"
                  size="large"
                  endIcon={<ArrowForward />}
                >
                  Explore Archive
                </GradientButton>
                <Button
                  component={Link}
                  href="/dictionary"
                  variant="outlined"
                  size="large"
                  color="primary"
                  sx={{ 
                    borderWidth: 2,
                    "&:hover": { borderWidth: 2 }
                  }}
                >
                  View Dictionary
                </Button>
              </Stack>

              {/* Stats */}
              <Stack 
                direction={{ xs: "column", sm: "row" }} 
                spacing={4}
                sx={{ mt: 8, width: "100%" }}
                justifyContent="center"
              >
                {stats.map((stat, index) => (
                  <Fade in timeout={1000 + index * 200} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        textAlign: "center",
                        background: theme => alpha(theme.palette.primary.main, 0.05),
                        border: theme => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        borderRadius: 3,
                        minWidth: { xs: "100%", sm: 180 },
                      }}
                    >
                      <Box sx={{ color: "primary.main", mb: 1 }}>{stat.icon}</Box>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: "primary.main", mb: 0.5 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </Paper>
                  </Fade>
                ))}
              </Stack>
            </Box>
          </Container>
        </MainHeroSection>
        
        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: 10 }}>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography 
              variant="overline"
              sx={{ 
                color: "primary.main",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: 2
              }}
            >
              Why Choose Storage Tech
            </Typography>
            <Typography 
              variant="h2" 
              sx={{ 
                mt: 2,
                mb: 2,
                fontWeight: 700,
                color: "text.primary"
              }}
            >
              Everything You Need
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
              From simple storage to complex sorting systems, we&apos;ve got you covered
            </Typography>
          </Box>
          
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
                      position: "relative",
                      overflow: "visible",
                      "&:hover": {
                        transform: "translateY(-12px)",
                        boxShadow: theme => `0 12px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
                      },
                    }}
                  >
                    <Chip
                      label={feature.highlight}
                      size="small"
                      color="primary"
                      sx={{
                        position: "absolute",
                        top: -10,
                        right: 16,
                        fontWeight: 600,
                        fontSize: "0.7rem",
                      }}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        p: 4,
                      }}
                    >
                      <Box 
                        sx={{ 
                          mb: 3,
                          p: 2,
                          borderRadius: 3,
                          background: theme => alpha(theme.palette.primary.main, 0.1),
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 700 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Benefits Section */}
        <Box sx={{ background: theme => alpha(theme.palette.primary.main, 0.02), py: 10 }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  mb: 2,
                  fontWeight: 700,
                  color: "text.primary"
                }}
              >
                Built for the Community
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
                Join a thriving community of Minecraft builders and engineers
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {benefits.map((benefit, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                  <Fade in timeout={1200 + index * 150}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        height: "100%",
                        background: "background.paper",
                        border: theme => `1px solid ${theme.palette.divider}`,
                        borderRadius: 3,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          borderColor: "primary.main",
                        },
                      }}
                    >
                      <Box sx={{ color: "primary.main", mb: 2 }}>
                        {benefit.icon}
                      </Box>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                        {benefit.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {benefit.description}
                      </Typography>
                    </Paper>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Container maxWidth="md" sx={{ py: 12 }}>
          <Fade in timeout={1500}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 6 },
                textAlign: "center",
                background: theme => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.dark, 0.05)} 100%)`,
                border: theme => `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 4,
              }}
            >
              <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
                Ready to Get Started?
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: "auto" }}>
                Browse our extensive archive of storage systems and start building today
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                <GradientButton
                  component={Link}
                  href="/archive-manager"
                  size="large"
                  endIcon={<ArrowForward />}
                >
                  Browse Archive
                </GradientButton>
                <Button
                  component={Link}
                  href="/discord"
                  target="_blank"
                  variant="outlined"
                  size="large"
                  color="primary"
                  sx={{ 
                    borderWidth: 2,
                    "&:hover": { borderWidth: 2 }
                  }}
                >
                  Join Discord
                </Button>
              </Stack>
            </Paper>
          </Fade>
        </Container>
      </Box>
    </Fade>
  );
}

export default HomePage;
