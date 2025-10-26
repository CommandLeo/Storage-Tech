"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "dark",
    primary: {
      main: "#7289da",
      light: "#8599e8",
      dark: "#5b73c7",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#43b581",
      light: "#6ec071",
      dark: "#2e7031",
      contrastText: "#ffffff",
    },
    error: {
      main: "#f04747",
      light: "#f6685e",
      dark: "#aa2e25",
    },
    warning: {
      main: "#faa61a",
      light: "#ffac33",
      dark: "#b26a00",
    },
    info: {
      main: "#7289da",
      light: "#8599e8",
      dark: "#5b73c7",
    },
    success: {
      main: "#43b581",
      light: "#6ec071",
      dark: "#357a38",
    },
    background: {
      default: "#1e1e2e",
      paper: "#252538",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b8b9bf",
      disabled: "#686b78",
    },
    divider: "#3a3a50",
    action: {
      hover: "rgba(114, 137, 218, 0.08)",
      selected: "rgba(114, 137, 218, 0.12)",
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
            outlineColor: "rgba(114, 137, 218, 0.5)",
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
            backgroundColor: "rgba(114, 137, 218, 0.08)",
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
              borderColor: "#3a3a50",
              borderWidth: "1.5px",
            },
            "&:hover fieldset": {
              borderColor: "#7289da",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#7289da",
              borderWidth: "2px",
            },
            "&.Mui-error fieldset": {
              borderColor: "#f04747",
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
            borderColor: "#3a3a50",
            borderWidth: "1.5px",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#7289da",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#7289da",
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
          border: "1px solid #3a3a50",
          backgroundColor: "#252538",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: "rgba(114, 137, 218, 0.3)",
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
          backgroundColor: "#252538",
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
          backgroundColor: "#181825",
          borderBottom: "1px solid #3a3a50",
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
          backgroundColor: "rgba(67, 181, 129, 0.1)",
          color: "#43b581",
          border: "1px solid rgba(67, 181, 129, 0.3)",
        },
        standardError: {
          backgroundColor: "rgba(240, 71, 71, 0.1)",
          color: "#f04747",
          border: "1px solid rgba(240, 71, 71, 0.3)",
        },
        standardWarning: {
          backgroundColor: "rgba(250, 166, 26, 0.1)",
          color: "#faa61a",
          border: "1px solid rgba(250, 166, 26, 0.3)",
        },
        standardInfo: {
          backgroundColor: "rgba(114, 137, 218, 0.1)",
          color: "#7289da",
          border: "1px solid rgba(114, 137, 218, 0.3)",
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
          backgroundColor: "#7289da",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#5b73c7",
            transform: "translateY(-1px)",
          },
          "&.MuiChip-colorSecondary": {
            backgroundColor: "#43b581",
            "&:hover": {
              backgroundColor: "#357a38",
            },
          },
        },
        outlined: {
          borderColor: "#3a3a50",
          color: "#b8b9bf",
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          "&:hover": {
            backgroundColor: "rgba(114, 137, 218, 0.1)",
            borderColor: "#7289da",
          },
        },
      },
    },

    // Menu components
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#252538",
          border: "1px solid #3a3a50",
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
            backgroundColor: "rgba(114, 137, 218, 0.1)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(114, 137, 218, 0.15)",
            "&:hover": {
              backgroundColor: "rgba(114, 137, 218, 0.2)",
            },
          },
        },
      },
    },

    // Loading components
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: "#7289da",
        },
      },
    },

    // Tooltip
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#181825",
          color: "#ffffff",
          border: "1px solid #3a3a50",
          borderRadius: 6,
          fontSize: "0.875rem",
          fontWeight: 500,
        },
        arrow: {
          color: "#181825",
        },
      },
    },
  },
});

export default theme;