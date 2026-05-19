"use client"

import { ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Navbar } from "@/components/navbar"
import { SiteSidebar } from "@/components/site-sidebar"

interface SiteLayoutProps {
  children: ReactNode
}

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <SiteSidebar />
      <div className="flex flex-col w-full min-h-screen">
        <Navbar />
        {children}
      </div>
    </SidebarProvider>
  )
}
