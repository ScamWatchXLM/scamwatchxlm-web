"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { QueryProvider } from "./query-provider"
import { ThemeProvider } from "./theme-provider"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <TooltipProvider delayDuration={150}>
          {children}
          <Toaster richColors position="bottom-right" />
        </TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
