"use client";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Inter } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Menu from "@/components/menu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import Head from "next/head";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  // nie pokazuj menu na stronie logowania i rejestracji
  const pathname = usePathname();
  const excludeMenuPaths = [
    "/auth/login",
    "/auth/register",
    "/auth/password-reset",
  ];
  const shouldShowMenu = !excludeMenuPaths.includes(pathname);

  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider client={queryClient}>
            <SidebarProvider defaultOpen={true}>
              {/* Conditionally render the Menu */}
              {shouldShowMenu && <Menu />}
              <main className="w-full">{children}</main>
            </SidebarProvider>
            <Toaster duration={100} />
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
