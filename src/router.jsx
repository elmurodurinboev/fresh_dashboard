import { createBrowserRouter, Navigate } from "react-router-dom";
import GeneralError from "./pages/errors/general-error";
import NotFoundError from "./pages/errors/not-found-error";
import MaintenanceError from "./pages/errors/maintenance-error";
import UnauthorisedError from "@/pages/errors/unauthorised-error.jsx";
import {AuthService} from "@/services/auth.service.js";
import ROLES from "@/data/roles.js";
import NotAllowed from "@/pages/errors/not-allowed.jsx";
import {sidelinks} from "@/data/sidelinks.jsx";

const getAllowedUsers = (path) => {
  const inx = sidelinks.indexOf(item => item.href === `/${path}`)
  if (inx === -1)
    return

  return sidelinks[inx].roles
}

// User's role (dynamically fetch from auth state or context in a real app)
const session = AuthService.getAuthSession()

// Routes with metadata for role-based access
const routes = [
  // Auth routes
  {
    path: "/auth/login",
    lazy: async () => ({
      Component: (await import("./pages/auth/login.jsx")).default,
    }),
  },

  // Main routes
  {
    path: "/",
    lazy: async () => ({
      Component: (await import("./layouts/Protected.jsx")).default,
    }),
    children: [
      {
        path: "/",
        lazy: async () => {
          const AppShell = await import("./components/app-shell");
          return { Component: AppShell.default };
        },
        errorElement: <GeneralError />,
        children: [
          {
            path: "dashboard",
            lazy: async () => ({
              Component: (await import("@/pages/dashboard")).default,
            }),
            meta: { roles: getAllowedUsers('dashboard') },
          },
          // Shop routes
          {
            path: "shops",
            lazy: async () => ({
              Component: (await import("@/pages/shops")).default
            }),
            meta: { roles: getAllowedUsers('shops') },
          },
          {
            path: "shops/create",
            lazy: async () => ({
              Component: (await import("@/pages/shops/create-shop")).default
            }),
            meta: { roles: getAllowedUsers('shops') },
          },
          {
            path: "shops/update/:id",
            lazy: async () => ({
              Component: (await import("@/pages/shops/update-shop")).default
            }),
            meta: { roles: getAllowedUsers('shops') },
          },

          // Shop product routes
          {
            path: "shop-products",
            lazy: async () => ({
              Component: (await import("@/pages/shops/products")).default
            }),
            meta: { roles: getAllowedUsers('shop-products') },
          },
          {
            path: "shop-products/update/:id",
            lazy: async () => ({
              Component: (await import("@/pages/shops/products/update-product")).default
            }),
            meta: { roles: getAllowedUsers('shop-products') },
          },

          {
            path: "shop-products/create",
            lazy: async () => ({
              Component: (await import("@/pages/shops/products/create-product")).default
            }),
            meta: { roles: getAllowedUsers('shop-products') },
          },

          // ShopCategory
          {
            path: "shop-category",
            lazy: async () => ({
              Component: (await import("@/pages/shops/category")).default
            }),
            meta: { roles: getAllowedUsers('shop-category') },
          },
          {
            path: "shop-category/create",
            lazy: async () => ({
              Component: (await import("@/pages/shops/category/create-category")).default
            }),
            meta: { roles: getAllowedUsers('shop-category') },
          },
          {
            path: "shop-category/update/:id",
            lazy: async () => ({
              Component: (await import("@/pages/shops/category/update-category")).default
            }),
            meta: { roles: getAllowedUsers('shop-category') },
          },

          // SubCategory
          {
            path: "subcategory",
            lazy: async () => ({
              Component: (await import("@/pages/shops/subcategory")).default
            }),
            meta: { roles: getAllowedUsers('subcategory') },
          },
          {
            path: "subcategory/create",
            lazy: async () => ({
              Component: (await import("@/pages/shops/subcategory/create-subcategory")).default
            }),
            meta: { roles: getAllowedUsers('subcategory') },
          },
          {
            path: "subcategory/update/:id",
            lazy: async () => ({
              Component: (await import("@/pages/shops/subcategory/update-subcategory")).default
            }),
            meta: { roles: getAllowedUsers('subcategory') },
          },

          // ======================================================================
          // Restaurant routes
          {
            path: "restaurants",
            lazy: async () => ({
              Component: (await import("@/pages/restaurants")).default
            }),
            meta: { roles: getAllowedUsers('restaurants') },
          },
          {
            path: "restaurants/update/:id",
            lazy: async () => ({
              Component: (await import("@/pages/restaurants/update-restaurants")).default
            }),
            meta: { roles: getAllowedUsers('restaurants') },
          },
          {
            path: "restaurants/create",
            lazy: async () => ({
              Component: (await import("@/pages/restaurants/create-restaurants")).default
            }),
            meta: { roles: getAllowedUsers('restaurants') },
          },

          {
            path: "cash-flow",
            lazy: async () => ({
              Component: (await import("@/pages/cash-flow/index.jsx")).default
            }),
            meta: { roles: getAllowedUsers('cash-flow') },
          },

          {
            path: "cash-flow/create",
            lazy: async () => ({
              Component: (await import("@/pages/cash-flow/create/index.jsx")).default
            }),
            meta: { roles: getAllowedUsers('cash-flow') },
          },


          // RestaurantProducts routes
          {
            path: "restaurant-products",
            lazy: async () => ({
              Component: (await import("@/pages/restaurants/products")).default
            }),
            meta: { roles: getAllowedUsers('restaurant-products') },
          },
          {
            path: "restaurant-products/create",
            lazy: async () => ({
              Component: (await import("@/pages/restaurants/products/create-product")).default
            }),
            meta: { roles: getAllowedUsers('restaurant-products') },
          },
          {
            path: "restaurant-products/update/:id",
            lazy: async () => ({
              Component: (await import("@/pages/restaurants/products/update-product")).default
            }),
            meta: { roles: getAllowedUsers('restaurant-products') },
          },

          // RestaurantCategory
          {
            path: "restaurant-category",
            lazy: async () => ({
              Component: (await import("@/pages/restaurants/category")).default
            }),
            meta: { roles: getAllowedUsers('restaurant-category') },
          },
          {
            path: "restaurant-category/create",
            lazy: async () => ({
              Component: (await import("@/pages/restaurants/category/create-category")).default
            }),
            meta: { roles: getAllowedUsers('restaurant-category') },
          },
          {
            path: "restaurant-category/update/:id",
            lazy: async () => ({
              Component: (await import("@/pages/restaurants/category/update-category")).default
            }),
            meta: { roles: getAllowedUsers('restaurant-category') },
          },

          // Courier router

          {
            path: "courier",
            lazy: async () => ({
              Component: (await import("@/pages/courier")).default
            }),
            meta: { roles: getAllowedUsers('courier') },
          },
          {
            path: "courier/create",
            lazy: async () => ({
              Component: (await import("@/pages/courier/create-courier")).default
            }),
            meta: { roles: getAllowedUsers('courier') },
          },
          {
            path: "courier/update/:id",
            lazy: async () => ({
              Component: (await import("@/pages/courier/update-courier")).default
            }),
            meta: { roles: getAllowedUsers('courier') },
          },

          // Users Routes

          {
            path: "users",
            lazy: async () => ({
              Component: (await import("@/pages/users")).default
            }),
            meta: { roles: getAllowedUsers('users') },
          },
          {
            path: "users/create",
            lazy: async () => ({
              Component: (await import("@/pages/users/create-user")).default
            }),
            meta: { roles: getAllowedUsers('users') }
          },
          {
            path: "settings",
            lazy: async () => ({
              Component: (await import("./pages/settings")).default,
            }),
            children: [
              {
                index: true,
                lazy: async () => ({
                  Component: (await import("./pages/settings/profile")).default,
                }),
                meta: { roles: [ROLES.ADMIN, ROLES.SHOP_OWNER, ROLES.RESTAURANT_OWNER, ROLES.OPERATOR, ROLES.COURIER, ROLES.CLIENT] },
              },
              {
                path: "appearance",
                lazy: async () => ({
                  Component: (await import("./pages/settings/appearance")).default,
                }),
                meta: { roles: [ROLES.ADMIN, ROLES.SHOP_OWNER, ROLES.RESTAURANT_OWNER, ROLES.OPERATOR, ROLES.COURIER, ROLES.CLIENT] },
              },
            ],
          },
        ],
      },
    ],
  },

  // Error routes
  { path: "/500", Component: GeneralError },
  { path: "/404", Component: NotFoundError },
  { path: "/503", Component: MaintenanceError },
  { path: "/401", Component: UnauthorisedError },
  { path: "/403", Component: NotAllowed },

  // Fallback 404 route
  { path: "*", Component: NotFoundError },
];

// Centralized guard logic
const applyGuards = (routes, userRole) => {
  const guardRoute = (route) => {
    if (!userRole) return { ...route, Component: () => <Navigate to="/500" replace /> };
    if (route.meta?.roles && !route.meta.roles.includes(userRole)) {
      return { ...route, Component: () => <Navigate to="/403" replace /> };
    }
    if (route.children) {
      return { ...route, children: route.children.map(guardRoute) };
    }
    return route;
  };

  return routes.map(guardRoute);
};

// Apply guards
const guardedRoutes = applyGuards(routes, session?.user?.user_role);

// Create the router
const router = createBrowserRouter(guardedRoutes);

export default router;