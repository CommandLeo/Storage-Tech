"use client";
import { createTheme, alpha } from "@mui/material/styles";
import { purple, grey, red, orange, green, common } from "@mui/material/colors";

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "dark",
    primary: {
      main: purple[600],
      light: purple[400],
      dark: purple[800],
      contrastText: common.white,
    },
    secondary: {
      main: purple[300],
      light: purple[200],
      dark: purple[400],
      contrastText: common.black,
    },
    error: {
      main: red[500],
      light: red[400],
      dark: red[700],
    },
    warning: {
      main: orange[500],
      light: orange[400],
      dark: orange[700],
    },
    info: {
      main: purple[600],
      light: purple[400],
      dark: purple[800],
    },
    success: {
      main: green[500],
      light: green[400],
      dark: green[700],
    },
    background: {
      default: grey[900],
      paper: grey[800],
    },
    text: {
      primary: common.white,
      secondary: grey[400],
      disabled: grey[600],
    },
    divider: grey[800],
    action: {
      hover: alpha(purple[600], 0.08),
      selected: alpha(purple[600], 0.12),
      disabled: "rgba(255, 255, 255, 0.26)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.75rem",
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2.25rem",
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "1.875rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1.125rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
      fontWeight: 400,
    },
    subtitle1: {
      fontSize: "1rem",
      lineHeight: 1.5,
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      fontWeight: 500,
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.4,
      fontWeight: 400,
    },
    overline: {
      fontSize: "0.75rem",
      lineHeight: 1.4,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 500,
          padding: "10px 20px",
          fontSize: "0.95rem",
          transition: "all 0.2s ease",
          "&:focus": {
            outline: "2px solid",
            outlineColor: alpha(theme.palette.primary.main, 0.5),
            outlineOffset: "2px",
          },
        }),
        contained: {
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0)",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
          },
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px",
            transform: "translateY(-1px)",
          },
        },
        text: ({ theme }) => ({
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }),
        sizeLarge: {
          padding: "12px 24px",
          fontSize: "1rem",
        },
        sizeSmall: {
          padding: "6px 12px",
          fontSize: "0.875rem",
        },
      },
    },

    // Input components
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            transition: "all 0.2s ease",
            "& fieldset": {
              borderColor: theme.palette.divider,
              borderWidth: "1.5px",
            },
            "&:hover fieldset": {
              borderColor: theme.palette.primary.main,
            },
            "&.Mui-focused fieldset": {
              borderColor: theme.palette.primary.main,
              borderWidth: "2px",
            },
            "&.Mui-error fieldset": {
              borderColor: theme.palette.error.main,
            },
          },
          "& .MuiInputLabel-root": {
            fontWeight: 500,
          },
        }),
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.divider,
            borderWidth: "1.5px",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
            borderWidth: "2px",
          },
        }),
      },
    },

    // Card components
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: alpha(theme.palette.primary.main, 0.3),
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
            transform: "translateY(-2px)",
          },
        }),
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: "none",
          backgroundColor: theme.palette.background.paper,
          borderRadius: 8,
        }),
        elevation1: {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
        },
        elevation2: {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
        elevation3: {
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
        },
      },
    },

    // Navigation components
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: grey[900],
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }),
      },
    },

    // Feedback components
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        standardSuccess: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.success.main, 0.1),
          color: theme.palette.success.main,
          border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
        }),
        standardError: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.error.main, 0.1),
          color: theme.palette.error.main,
          border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
        }),
        standardWarning: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.warning.main, 0.1),
          color: theme.palette.warning.main,
          border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
        }),
        standardInfo: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.info.main, 0.1),
          color: theme.palette.info.main,
          border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
        }),
      },
    },

    // Chip components
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
          transition: "all 0.2s ease",
        },
        filled: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          "&:hover": {
            backgroundColor: theme.palette.primary.dark,
            transform: "translateY(-1px)",
          },
          "&.MuiChip-colorSecondary": {
            backgroundColor: theme.palette.secondary.main,
            "&:hover": {
              backgroundColor: theme.palette.secondary.dark,
            },
          },
        }),
        outlined: ({ theme }) => ({
          borderColor: theme.palette.divider,
          color: theme.palette.text.secondary,
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
            borderColor: theme.palette.primary.main,
          },
        }),
      },
    },

    // Menu components
    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
        }),
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 4,
          margin: "2px 4px",
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
          "&.Mui-selected": {
            backgroundColor: theme.palette.action.selected,
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
            },
          },
        }),
      },
    },

    // Loading components
    MuiCircularProgress: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
        }),
      },
    },

    // Tooltip
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }) => ({
          backgroundColor: grey[900],
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 6,
          fontSize: "0.875rem",
          fontWeight: 500,
        }),
        arrow: {
          color: grey[900],
        },
      },
    },
  },
});

export default theme;
