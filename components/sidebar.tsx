"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Search, FilePlus, Settings, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const menuItems = [
  {
    title: "소재마스터 등록",
    href: "/",
    icon: FilePlus,
  },
  {
    title: "소재 조회",
    href: "/fabrics",
    icon: Search,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col h-screen border-r bg-slate-900 text-slate-300 transition-all duration-300 sticky top-0",
        isCollapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center h-16 px-4 border-b border-slate-800">
        {!isCollapsed && (
          <span className="text-lg font-bold text-white truncate">Material Lib</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto text-slate-400 hover:text-white hover:bg-slate-800"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "text-slate-400")} />
              {!isCollapsed && <span className="font-medium">{item.title}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer (Optional) */}
      <div className="p-4 border-t border-slate-800">
        {!isCollapsed ? (
          <div className="text-xs text-slate-500">
            © 2025 Material Lib System
          </div>
        ) : (
           <Settings className="h-5 w-5 text-slate-500 mx-auto" />
        )}
      </div>
    </aside>
  )
}
