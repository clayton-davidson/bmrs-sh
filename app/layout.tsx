import "./globals.css";

import type { Metadata } from "next";
import { auth } from "@/auth";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next";

export const metadata: Metadata = {
  title: {
    default: "Beam Mill",
    template: "%s | Beam Mill",
  },
  description: "Beam Mill",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider session={session}>
              <NuqsAdapter>
                <div className="[--header-height:calc(theme(spacing.14))]">
                  <SidebarProvider className="flex flex-col">
                    <SiteHeader />
                    <div className="flex flex-1 overflow-hidden">
                      <AppSidebar />
                      <SidebarInset className="overflow-hidden">
                        <div className="h-full overflow-auto p-2">
                          <div className="max-w-full">{children}</div>
                        </div>
                      </SidebarInset>
                    </div>
                  </SidebarProvider>
                </div>
              </NuqsAdapter>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
