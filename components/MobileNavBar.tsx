"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Item = {
  href: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
  isActive: (pathname: string) => boolean;
};

const MobileNavBar: React.FC = () => {
  const pathname = usePathname() || "/";

  const items: Item[] = [
    {
      href: "/",
      label: "Home",
      icon: (active) => (
        <svg viewBox="0 0 24 24" className={`w-6 h-6 ${active ? "text-green-600" : "text-gray-500"}`} fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5l9-7 9 7" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 9.5V20a1 1 0 001 1H12v-6h0v6h6.5a1 1 0 001-1V9.5" />
        </svg>
      ),
      isActive: (p) => p === "/",
    },
    {
      href: "/send-mzigo",
      label: "Send",
      icon: (active) => (
        <svg viewBox="0 0 24 24" className={`w-6 h-6 ${active ? "text-green-600" : "text-gray-500"}`} fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 9-18 9 4-9-4-9z" />
        </svg>
      ),
      isActive: (p) => p.startsWith("/send-mzigo"),
    },
    {
      href: "/track-mzigo",
      label: "Track",
      icon: (active) => (
        <svg viewBox="0 0 24 24" className={`w-6 h-6 ${active ? "text-green-600" : "text-gray-500"}`} fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
          <circle cx="10" cy="10" r="6" />
        </svg>
      ),
      isActive: (p) => p.startsWith("/track-mzigo"),
    },
    {
      href: "/profile",
      label: "Profile",
      icon: (active) => (
        <svg viewBox="0 0 24 24" className={`w-6 h-6 ${active ? "text-green-600" : "text-gray-500"}`} fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 21v-1a6 6 0 0112 0v1" />
        </svg>
      ),
      isActive: (p) => p.startsWith("/profile"),
    },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white w-full overflow-hidden shadow-[0_-1px_8px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-4 items-stretch w-full">
        {items.map((it) => {
          const active = it.isActive(pathname);
          return (
            <li key={it.href} className="min-w-0">
              <Link
                href={it.href}
                className={`flex flex-col items-center justify-center gap-1 py-2 text-[11px] sm:text-xs ${
                  active ? "text-green-600 font-medium" : "text-gray-600"
                }`}
              >
                {it.icon(active)}
                <span className="truncate">{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileNavBar;
