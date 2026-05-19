"use client"

import { ReactNode } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Navbar } from "@/components/navbar"
import { SiteSidebar } from "@/components/site-sidebar"

interface SiteLayoutProps {
  children: ReactNode
}

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <SiteSidebar />
      <SidebarInset className="flex flex-col min-h-screen">
        <Navbar />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
