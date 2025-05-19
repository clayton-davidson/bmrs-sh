"use client";

import { SidebarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Link from "next/link";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center px-4">
        <Button
          className="h-8 w-8 cursor-pointer"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <SidebarIcon />
        </Button>

        <div className="hidden md:block mx-2 h-4" />

        <h4 className="text-2xl font-semibold tracking-tight md:mr-0 text-center w-full md:w-auto md:text-left">
          <Link href="/">Beam Mill</Link>
        </h4>

        <div className="hidden md:block md:flex-1" />
        <ModeToggle />
      </div>
    </header>
  );
}
