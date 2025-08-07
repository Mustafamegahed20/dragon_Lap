import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      dark: "#1565c0",
      light: "#42a5f5",
      logo: "#0e4393ff",
    },
    secondary: {
      main: "#f57c00",
      dark: "#ef6c00",
      light: "#ffa726",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a202c",
      secondary: "#4a5568",
    },
  },
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h5: {
      fontWeight: 500,
      fontSize: "1.25rem",
    },
    h6: {
      fontWeight: 500,
      fontSize: "1.125rem",
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0 1px 3px rgba(0, 0, 0, 0.1)",
    "0 4px 6px rgba(0, 0, 0, 0.1)",
    "0 10px 15px rgba(0, 0, 0, 0.1)",
    "0 20px 25px rgba(0, 0, 0, 0.15)",
    "0 25px 50px rgba(0, 0, 0, 0.25)",
    ...Array(19).fill("0 25px 50px rgba(0, 0, 0, 0.25)"),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 8,
          padding: "10px 24px",
          fontSize: "1rem",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e2e8f0",
          "&:hover": {
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
  },
});
