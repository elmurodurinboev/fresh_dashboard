import { Outlet } from "react-router-dom"
import {
  IconPalette,
  IconUser
} from "@tabler/icons-react"
import { Layout } from "@/components/custom/layout"
import { Separator } from "@/components/ui/separator"
import SidebarNav from "./components/sidebar-nav"

export default function Settings() {
  return (
    <Layout fixed>

      <Layout.Body className="flex flex-col">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Sozlamalar
          </h1>
        </div>
        <Separator className="my-4 lg:my-6" />
        <div className="flex flex-1 flex-col space-y-8 md:space-y-2 md:overflow-hidden lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="top-0 lg:sticky lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex w-full p-1 pr-4 md:overflow-y-hidden">
            <Outlet />
          </div>
        </div>
      </Layout.Body>
    </Layout>
  )
}

const sidebarNavItems = [
  {
    title: "Profil",
    icon: <IconUser size={18} />,
    href: "/settings"
  },
  {
    title: "Sayt sozlamalari",
    icon: <IconPalette size={18} />,
    href: "/settings/appearance"
  },
]
