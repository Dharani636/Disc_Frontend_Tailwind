import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col">
        <Navbar />
        <div className="flex-1 p-7">{children}</div>
      </div>
    </div>
  );
}
