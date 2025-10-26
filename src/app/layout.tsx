import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import theme from "@/lib/theme";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Storage Tech",
  description: "Storage Tech's Website",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SessionProvider>
              <Box display="flex" flexDirection="column" minHeight="100vh">
                <Navbar />
                <Box component="main" flex={1} display="flex" flexDirection="column">
                  {children}
                </Box>
              </Box>
            </SessionProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
