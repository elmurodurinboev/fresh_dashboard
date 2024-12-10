import {
  IconLayoutDashboard,
  IconSettings,
  IconCube,
  IconBuildingStore,
  IconCategory,
  IconCategory2
} from "@tabler/icons-react"

export const sidelinks = [
  {
    title: "sidebar.dashboard",
    label: "",
    href: "/",
    icon: <IconLayoutDashboard size={18}/>
  },

  {
    title: "sidebar.products",
    label: "",
    href: "/products",
    icon: <IconCube size={18}/>
  },

  {
    title: "sidebar.category",
    label: "",
    href: "/category",
    icon: <IconCategory size={18}/>
  },

  {
    title: "sidebar.subcategory",
    label: "",
    href: "/subcategory",
    icon: <IconCategory2 size={18}/>
  },

  {
    title: "sidebar.shops",
    label: "",
    href: "/shops",
    icon: <IconBuildingStore size={18}/>
  },
  {
    title: "sidebar.settings",
    label: "",
    href: "/settings",
    icon: <IconSettings size={18}/>
  }
]
