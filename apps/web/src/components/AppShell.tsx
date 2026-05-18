import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { MobileBottomBar } from "./mobile/MobileNavigation";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-void">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Bottom Navigation */}
      {/* <MobileBottomBar /> */}

      {/* Main Content */}
      <main
        className="
          min-h-screen overflow-y-auto md:ml-60 pt-15 md:pt-0
        "
      >
        <div className="max-w-300 mx-auto px-5 py-6 md:px-8 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}