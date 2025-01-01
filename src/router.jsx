import { createBrowserRouter, Navigate } from "react-router-dom";
import GeneralError from "./pages/errors/general-error";
import NotFoundError from "./pages/errors/not-found-error";
import MaintenanceError from "./pages/errors/maintenance-error";
import UnauthorisedError from "@/pages/errors/unauthorised-error.jsx";
import {AuthService} from "@/services/auth.service.js";
import ROLES from "@/data/roles.js";
import NotAllowed from "@/pages/errors/not-allowed.jsx";

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
            index: true,
            lazy: async () => ({
              Component: (await import("@/pages/dashboard")).default,
            }),
            meta: { roles: [ROLES.ADMIN, ROLES.SHOP_OWNER, ROLES.RESTAURANT_OWNER] },
          },
          {
            path: "shops",
            lazy: async () => ({
              Component: (await import("@/pages/shops")).default,
            }),
            meta: { roles: [ROLES.ADMIN] },
          },
          {
            path: "shops/create",
            lazy: async () => ({
              Component: (await import("@/pages/shops/create-shop")).default,
            }),
            meta: { roles: [ROLES.ADMIN] },
          },
          {
            path: "users",
            lazy: async () => ({
              Component: (await import("@/pages/users")).default,
            }),
            meta: { roles: [ROLES.ADMIN] },
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
                path: "account",
                lazy: async () => ({
                  Component: (await import("./pages/settings/account")).default,
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
