"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Container,
  IconButton,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import { AccountCircle, OpenInNew, Menu as MenuIcon, Home, Archive, Close, Book } from "@mui/icons-material";
import { useSession, signIn, signOut } from "next-auth/react";
import { DiscordIcon, DiscordButton, NavButton, NavExternalButton } from "@/components/StyledComponents";

function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const theme = useTheme();

  // Derived values for compatibility
  const user = session?.user ?? null;
  const isAuthenticated = !!session?.user;
  const loading = status === "loading";
  const hasAccess = session?.user?.hasAccess ?? false;
  const login = () => signIn("discord");
  const logout = () => signOut();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action: (() => void) | string) => {
    handleClose();
    setMobileMenuOpen(false); // Close mobile menu too
    if (typeof action === "function") {
      action();
    } else {
      router.push(action);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  // Navigation items for reuse (internal and external)
  const navItems = [
    { label: "Home", path: "/", icon: <Home />, show: true },
    { label: "Archive Manager", path: "/archive-manager", icon: <Archive />, show: isAuthenticated && hasAccess },
    {
      label: "Dictionary",
      href: "/dictionary",
      external: true,
      icon: <Book />,
      endIcon: <OpenInNew sx={{ fontSize: "12px" }} />,
      show: true,
    },
    {
      label: "Discord",
      href: "/discord",
      external: true,
      icon: <DiscordIcon />,
      endIcon: <OpenInNew sx={{ fontSize: "12px" }} />,
      show: true,
    },
  ];

  return (
    <>
      <AppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile Menu Button - CSS controlled for no flash */}
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleMobileMenu}
              sx={{
                mr: 1,
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Typography
              variant="h6"
              component={Link}
              href="/"
              sx={{
                mr: 2,
                display: "flex",
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: theme.palette.text.primary,
                textDecoration: "none",
                flexGrow: { xs: 1, md: 0 },
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
                transition: "color 0.2s ease-in-out",
                "&:hover": {
                  color: theme.palette.primary.main,
                },
              }}
            >
              Storage Tech
            </Typography>

            {/* Desktop Navigation - CSS controlled for no flash */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                ml: 3,
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              {navItems
                .filter(item => item.show)
                .map(item =>
                  item.external ? (
                    <NavExternalButton
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      endIcon={item.endIcon}
                    >
                      {item.label}
                    </NavExternalButton>
                  ) : (
                    <NavButton key={item.path} href={item.path}>
                      {item.label}
                    </NavButton>
                  )
                )}
            </Box>

            {/* User Menu */}
            <Box sx={{ flexGrow: 0 }}>
              {loading ? null : isAuthenticated ? (
                <div>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                    sx={{
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <Avatar
                      src={user?.image ?? undefined}
                      sx={{
                        width: 32,
                        height: 32,
                        transition: "box-shadow 0.2s ease-in-out",
                        "&:hover": {
                          boxShadow: theme.shadows[4],
                        },
                      }}
                    >
                      {!user?.image && <AccountCircle />}
                    </Avatar>
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    keepMounted
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    open={open}
                    onClose={handleClose}
                    sx={{
                      "& .MuiPaper-root": {
                        minWidth: 220,
                        borderRadius: 3,
                        boxShadow: theme.shadows[8],
                        backdropFilter: "blur(12px)",
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        p: 0,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        px: 2,
                        py: 2,
                        background: "rgba(255,255,255,0.08)",
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                        mb: 1,
                      }}
                    >
                      <Avatar
                        src={user?.image ?? undefined}
                        sx={{ width: 40, height: 40, boxShadow: theme.shadows[2] }}
                      >
                        {!user?.image && <AccountCircle />}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "inherit" }}>
                          {user?.name ?? user?.username ?? "User"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "inherit", opacity: 0.8 }}>
                          {user?.username ? `@${user.username}` : ""}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.18)" }} />
                    <MenuItem
                      onClick={() => handleMenuItemClick("/profile")}
                      sx={{
                        px: 2,
                        py: 1.5,
                        fontWeight: 500,
                        color: "inherit",
                        "&:hover": {
                          background: "rgba(255,255,255,0.12)",
                        },
                      }}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleMenuItemClick(logout)}
                      sx={{
                        px: 2,
                        py: 1.5,
                        fontWeight: 500,
                        color: "error.main",
                        "&:hover": {
                          background: "rgba(255,255,255,0.12)",
                        },
                      }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </div>
              ) : (
                <DiscordButton
                  variant="contained"
                  onClick={login}
                  startIcon={<DiscordIcon />}
                  sx={{
                    px: { xs: 2, sm: 3 },
                    py: 1,
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <Box sx={{ display: { xs: "none", sm: "block" } }}>Login with Discord</Box>
                  <Box sx={{ display: { xs: "block", sm: "none" } }}>Login</Box>
                </DiscordButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        PaperProps={{
          sx: {
            width: { xs: "100vw", sm: 320 },
            maxWidth: "100vw",
            boxSizing: "border-box",
            borderRight: `1px solid ${theme.palette.divider}`,
            color: theme.palette.getContrastText("#5865f2"),
            backdropFilter: "blur(16px)",
            p: 0,
            m: 0,
            borderRadius: 0,
            boxShadow: 8,
          },
        }}
        sx={{
          display: { xs: "block", md: "none" },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `1px solid ${theme.palette.divider}`,
            background: "rgba(255,255,255,0.08)",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: "inherit" }}>
            Storage Tech
          </Typography>
          <IconButton
            onClick={handleMobileMenuClose}
            sx={{
              color: "inherit",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "rotate(90deg)",
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>
        <List sx={{ pt: 2 }}>
          {navItems
            .filter(item => item.show)
            .map(item => (
              <ListItem
                key={item.path || item.href}
                disablePadding
              >
                <ListItemButton
                  component={item.external ? "a" : Link}
                  href={item.external ? item.href : item.path}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  onClick={handleMobileMenuClose}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    color: "inherit",
                    background: "rgba(255,255,255,0.04)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.18)",
                      transform: "translateX(8px)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                  {item.endIcon}
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Drawer>
    </>
  );
}

export default Navbar;
