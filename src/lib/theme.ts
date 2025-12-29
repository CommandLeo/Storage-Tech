"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "dark",
    primary: {
      main: "#9c27b0", // purple[600]
      light: "#ba68c8",
      dark: "#7b1fa2",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ce93d8", // lighter purple for secondary
      light: "#e1bee7",
      dark: "#ab47bc",
      contrastText: "#000000",
    },
    error: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f",
    },
    warning: {
      main: "#ff9800",
      light: "#ffb74d",
      dark: "#f57c00",
    },
    info: {
      main: "#9c27b0",
      light: "#ba68c8",
      dark: "#7b1fa2",
    },
    success: {
      main: "#66bb6a",
      light: "#81c784",
      dark: "#388e3c",
    },
    background: {
      default: "#1a1a1a", // darker gray
      paper: "#212121", // darker gray for paper
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
      disabled: "#6e6e6e",
    },
    divider: "#2e2e2e",
    action: {
      hover: "rgba(156, 39, 176, 0.08)",
      selected: "rgba(156, 39, 176, 0.12)",
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
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 500,
          padding: "10px 20px",
          fontSize: "0.95rem",
          transition: "all 0.2s ease",
          "&:focus": {
            outline: "2px solid",
            outlineColor: "rgba(156, 39, 176, 0.5)",
            outlineOffset: "2px",
          },
        },
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
        text: {
          "&:hover": {
            backgroundColor: "rgba(156, 39, 176, 0.08)",
          },
        },
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
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            transition: "all 0.2s ease",
            "& fieldset": {
              borderColor: "#2e2e2e",
              borderWidth: "1.5px",
            },
            "&:hover fieldset": {
              borderColor: "#9c27b0",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#9c27b0",
              borderWidth: "2px",
            },
            "&.Mui-error fieldset": {
              borderColor: "#f44336",
            },
          },
          "& .MuiInputLabel-root": {
            fontWeight: 500,
          },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2e2e2e",
            borderWidth: "1.5px",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9c27b0",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9c27b0",
            borderWidth: "2px",
          },
        },
      },
    },

    // Card components
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid #2e2e2e",
          backgroundColor: "#212121",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: "rgba(156, 39, 176, 0.3)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
            transform: "translateY(-2px)",
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#212121",
          borderRadius: 8,
        },
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
        root: {
          backgroundColor: "#121212",
          borderBottom: "1px solid #2e2e2e",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        },
      },
    },

    // Feedback components
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        standardSuccess: {
          backgroundColor: "rgba(102, 187, 106, 0.1)",
          color: "#66bb6a",
          border: "1px solid rgba(102, 187, 106, 0.3)",
        },
        standardError: {
          backgroundColor: "rgba(244, 67, 54, 0.1)",
          color: "#f44336",
          border: "1px solid rgba(244, 67, 54, 0.3)",
        },
        standardWarning: {
          backgroundColor: "rgba(255, 152, 0, 0.1)",
          color: "#ff9800",
          border: "1px solid rgba(255, 152, 0, 0.3)",
        },
        standardInfo: {
          backgroundColor: "rgba(156, 39, 176, 0.1)",
          color: "#9c27b0",
          border: "1px solid rgba(156, 39, 176, 0.3)",
        },
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
        filled: {
          backgroundColor: "#9c27b0",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#7b1fa2",
            transform: "translateY(-1px)",
          },
          "&.MuiChip-colorSecondary": {
            backgroundColor: "#ce93d8",
            "&:hover": {
              backgroundColor: "#ab47bc",
            },
          },
        },
        outlined: {
          borderColor: "#2e2e2e",
          color: "#b0b0b0",
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          "&:hover": {
            backgroundColor: "rgba(156, 39, 176, 0.1)",
            borderColor: "#9c27b0",
          },
        },
      },
    },

    // Menu components
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#212121",
          border: "1px solid #2e2e2e",
          borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          margin: "2px 4px",
          "&:hover": {
            backgroundColor: "rgba(156, 39, 176, 0.1)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(156, 39, 176, 0.15)",
            "&:hover": {
              backgroundColor: "rgba(156, 39, 176, 0.2)",
            },
          },
        },
      },
    },

    // Loading components
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: "#9c27b0",
        },
      },
    },

    // Tooltip
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#121212",
          color: "#ffffff",
          border: "1px solid #2e2e2e",
          borderRadius: 6,
          fontSize: "0.875rem",
          fontWeight: 500,
        },
        arrow: {
          color: "#121212",
        },
      },
    },
  },
});

export default theme;