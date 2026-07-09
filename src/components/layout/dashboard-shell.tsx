import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"
import { CommandPalette } from "./command-palette"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh w-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto w-full max-w-7xl space-y-6">{children}</div>
        </main>
      </div>
      <CommandPalette />
    </div>
  )
}
