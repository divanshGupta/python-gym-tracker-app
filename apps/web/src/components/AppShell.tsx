import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface AppShellProps {
  children: ReactNode;
}

/**
 * AppShell wraps every authenticated page.
 * It renders the persistent Sidebar and a main content area
 * that is offset by the sidebar width on desktop.
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-void flex">
      <Sidebar />

      {/*
        Main content:
        - On desktop: left margin = sidebar width (240px)
        - On mobile: no margin (sidebar is a drawer overlay)
      */}
      <main className="flex-1 md:ml-60 min-h-screen overflow-y-auto">
        <div className="max-w-300 mx-auto px-5 py-8 md:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
