import {
  IconLayoutDashboard,
  IconSettings,
  IconCube,
  IconBuildingStore,
  IconCategory,
  IconCategory2,
  IconScooterElectric,
  IconUsers,
  IconCashRegister
} from "@tabler/icons-react"
import ROLES from "@/data/roles.js";

export const sidelinks = [
  {
    title: "sidebar.dashboard",
    label: "",
    href: "/",
    icon: <IconLayoutDashboard size={18}/>,
    roles: [ROLES.ADMIN, ROLES.SHOP_OWNER, ROLES.RESTAURANT_OWNER]
  },

  {
    title: "sidebar.shop-products",
    label: "",
    href: "/shop-products",
    icon: <IconCube size={18}/>,
    roles: [ROLES.ADMIN, ROLES.SHOP_OWNER]
  },
  {
    title: "sidebar.shop-category",
    label: "",
    href: "/shop-category",
    icon: <IconCategory size={18}/>,
    roles: [ROLES.ADMIN, ROLES.SHOP_OWNER]
  },

  {
    title: "sidebar.subcategory",
    label: "",
    href: "/subcategory",
    icon: <IconCategory2 size={18}/>,
    roles: [ROLES.ADMIN, ROLES.SHOP_OWNER]
  },

  {
    title: "sidebar.shops",
    label: "",
    href: "/shops",
    icon: <IconBuildingStore size={18}/>,
    roles: [ROLES.ADMIN]
  },

  {
    title: "sidebar.restaurants",
    label: "",
    href: "/restaurants",
    icon: <IconBuildingStore size={18}/>,
    roles: [ROLES.ADMIN]
  },

  {
    title: "sidebar.restaurant-products",
    label: "",
    href: "/restaurant-products",
    icon: <IconCube size={18}/>,
    roles: [ROLES.ADMIN, ROLES.RESTAURANT_OWNER]
  },
  {
    title: "sidebar.restaurant-category",
    label: "",
    href: "/restaurant-category",
    icon: <IconCategory size={18}/>,
    roles: [ROLES.ADMIN, ROLES.RESTAURANT_OWNER]
  },
  {
    title: "sidebar.users",
    label: "",
    href: "/users",
    icon: <IconUsers size={18}/>,
    roles: [ROLES.ADMIN]
  },
  {
    title: "sidebar.courier",
    label: "",
    href: "/courier",
    icon: <IconScooterElectric size={18}/>,
    roles: [ROLES.ADMIN]
  },
  {
    title: "sidebar.cash-flow",
    label: "",
    href: "/cash-flow",
    icon: <IconCashRegister size={18}/>,
    // roles: [ROLES.ADMIN]
  },
  {
    title: "sidebar.settings",
    label: "",
    href: "/settings",
    icon: <IconSettings size={18}/>,
    roles: [ROLES.CLIENT, ROLES.COURIER, ROLES.OPERATOR, ROLES.ADMIN, ROLES.SHOP_OWNER, ROLES.RESTAURANT_OWNER]
  }
]
