import { useEffect, useState } from "react"
import { IconChevronsLeft, IconMenu2, IconX } from "@tabler/icons-react"
import { Layout } from "./custom/layout"
import { Button } from "./custom/button"
import Nav from "./nav"
import { cn } from "@/lib/utils"
import { sidelinks } from "@/data/sidelinks"
import MainLogo from "@/components/custom/main-logo.jsx";
import {useAuth} from "@/hooks/utils/useAuth.js";

export default function Sidebar({ className, isCollapsed, setIsCollapsed }) {
  const [navOpened, setNavOpened] = useState(false)

  const {session} = useAuth()
  const filterSidebarItems = (items) => {
    return items.filter(item => {
      if (!item.roles) return true
      return item.roles.some(role => session?.user.user_role === role)
    })
  }
  /* Make body not scrollable when navBar is opened */
  useEffect(() => {
    if (navOpened) {
      document.body.classList.add("overflow-hidden")
    } else {
      document.body.classList.remove("overflow-hidden")
    }
  }, [navOpened])

  return (
    <aside
      className={cn(
        `fixed left-0 right-0 top-0 z-50 w-full transition-[width] md:bottom-0 shadow-xl drop-shadow md:right-auto md:h-svh  ${
          isCollapsed ? "md:w-14" : "md:w-64"
        }`,
        className
      )}
    >
      {/* Overlay in mobile */}
      <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${
          navOpened ? "h-svh opacity-50" : "h-0 opacity-0"
        } w-full bg-black md:hidden`}
      />

      <Layout fixed className={navOpened ? "h-svh" : ""}>
        {/* Header */}
        <div
          className="z-50 flex justify-between px-4 py-3 shadow-sm md:px-4"
        >
          <div className={`flex items-center ${!isCollapsed ? "gap-2" : ""}`}>
            <MainLogo className={`transition-all ${
              isCollapsed ? "h-6 w-6" : "h-8 w-8"
            }`} />
            <div
              className={`flex flex-col justify-center truncate ${
                isCollapsed ? "invisible w-0" : "visible w-auto"
              }`}
            >
              <span className="font-medium leading-0">WeDrive Fresh</span>
              <span className="text-xs leading-0">1229</span>
            </div>
          </div>

          {/* Toggle Button in mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle Navigation"
            aria-controls="sidebar-menu"
            aria-expanded={navOpened}
            onClick={() => setNavOpened(prev => !prev)}
          >
            {navOpened ? <IconX /> : <IconMenu2 />}
          </Button>
        </div>

        {/* Navigation links */}
        <Nav
          id="sidebar-menu"
          className={`z-40 h-full flex-1 overflow-auto ${
            navOpened ? "max-h-screen" : "max-h-0 py-0 md:max-h-screen md:py-2"
          }`}
          closeNav={() => setNavOpened(false)}
          isCollapsed={isCollapsed}
          links={filterSidebarItems((sidelinks))}
        />

        {/* Scrollbar width toggle button */}
        <Button
          onClick={() => setIsCollapsed(prev => !prev)}
          size="icon"
          variant="outline"
          className="absolute -right-5 top-12 z-50 hidden rounded-full md:inline-flex"
        >
          <IconChevronsLeft
            stroke={1.5}
            className={`h-5 w-5 ${isCollapsed ? "rotate-180" : ""}`}
          />
        </Button>
      </Layout>
    </aside>
  )
}
