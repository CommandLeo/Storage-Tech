import { SvgIcon, Box, Button, Typography, Paper, Card, Container, Avatar, SvgIconProps, ButtonProps } from "@mui/material";
import type { AnchorHTMLAttributes } from "react";
import { styled } from "@mui/material/styles";

// Discord Logo Icon Component
export const DiscordIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.195.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
  </SvgIcon>
);

// Layout Components
export const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(5),
  paddingBottom: theme.spacing(5),
}));

// Typography Components
export const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textFillColor: "transparent",
  fontWeight: 700,
}));

export const HeroTitle = styled(Typography)(({ theme }) => ({
  fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textFillColor: "transparent",
}));

export const HeroSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(5),
  maxWidth: "700px",
  margin: `0 auto ${theme.spacing(5)}px auto`,
  lineHeight: 1.6,
}));

// Button Components
export const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  border: 0,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  color: theme.palette.primary.contrastText,
  height: 48,
  padding: theme.spacing(0, 3.75),
  fontWeight: 600,
  textTransform: "none",
  transition: theme.transitions.create(["background", "box-shadow", "transform"], {
    duration: theme.transitions.duration.standard,
  }),
  "&:hover": {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.secondary.dark} 90%)`,
    boxShadow: theme.shadows[6],
    transform: "translateY(-2px)",
  },
}));

export const DiscordButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  textTransform: "none",
  borderRadius: 4,
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "translateY(-1px)",
    boxShadow: `0 4px 8px ${theme.palette.primary.main}33`,
  },
  "&:active": {
    transform: "translateY(0)",
  },
}));

// Card Components
export const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  textAlign: "center",
  padding: theme.spacing(3),
}));

export const ProfileCard = styled(Card)(() => ({
  maxWidth: 800,
  margin: "0 auto",
}));

export const UploadCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderRadius: theme.spacing(2),
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.2s ease",
  border: `2px dashed ${theme.palette.divider}`,
  outline: "none",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: `${theme.palette.primary.main}0D`, // 5% opacity
  },
  "&.drag-active": {
    borderColor: theme.palette.primary.main,
    backgroundColor: `${theme.palette.primary.main}0D`,
    borderWidth: 3,
  },
  "&.drag-accept": {
    borderColor: theme.palette.success.main,
    backgroundColor: `${theme.palette.success.main}0D`,
  },
  "&.drag-reject": {
    borderColor: theme.palette.error.main,
    backgroundColor: `${theme.palette.error.main}0D`,
  },
}));

export const ProfileHeaderBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(4),
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  [theme.breakpoints.up("md")]: {
    alignItems: "flex-start",
    textAlign: "left",
  },
}));

// Avatar Components
export const LargeAvatar = styled(Avatar)(() => ({
  width: 120,
  height: 120,
  fontSize: "3rem",
  flexShrink: 0,
}));

// Navigation Components
export const NavButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  fontWeight: 500,
  backgroundColor: "transparent",
  boxShadow: "none",
  textTransform: "none",
  "&:hover": {
    color: theme.palette.primary.light,
  },
}));

export const NavExternalButton = styled(Button)<ButtonProps & AnchorHTMLAttributes<HTMLAnchorElement>>(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  display: "inline-flex",
  alignItems: "center",
  fontWeight: 500,
  backgroundColor: "transparent",
  boxShadow: "none",
  textTransform: "none",
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  minWidth: 0,
  "& .MuiButton-endIcon": {
    marginLeft: theme.spacing(0.5),
  },
  "&:hover": {
    color: theme.palette.primary.light,
  },
}));

// Hero Section with Gradient Background
export const HeroSection = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #1e1e2e 0%, #252538 100%)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(ellipse at center, ${theme.palette.primary.main}20 0%, transparent 70%)`,
    pointerEvents: "none",
  },
}));

export const MainHeroSection = styled(HeroSection)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
  textAlign: "center",
  minHeight: "60vh",
  display: "flex",
  alignItems: "center",
}));

const StyledComponents = {
  GradientButton,
  DiscordButton,
  HeroSection,
  PageContainer,
  GradientText,
  HeroTitle,
  HeroSubtitle,
  FeatureCard,
  ProfileCard,
  UploadCard,
  ProfileHeaderBox,
  LargeAvatar,
  NavButton,
  NavExternalButton,
  MainHeroSection,
};

export default StyledComponents;
