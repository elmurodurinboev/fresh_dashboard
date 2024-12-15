import {createBrowserRouter} from "react-router-dom"
import GeneralError from "./pages/errors/general-error"
import NotFoundError from "./pages/errors/not-found-error"
import MaintenanceError from "./pages/errors/maintenance-error"
import UnauthorisedError from "@/pages/errors/unauthorised-error.jsx";

const router = createBrowserRouter([
  // Auth routes
  {
    path: "/auth/login",
    lazy: async () => ({
      Component: (await import("./pages/auth/login.jsx")).default
    })
  },

  // Main routes
  {
    path: '/',
    lazy: async () => ({
      Component: (await import("./layouts/Protected.jsx")).default
    }),
    children: [
      {
        path: "/",
        lazy: async () => {
          const AppShell = await import("./components/app-shell")
          return {Component: AppShell.default}
        },
        errorElement: <GeneralError/>,
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import("@/pages/dashboard")).default
            })
          },
          {
            path: "tasks",
            lazy: async () => ({
              Component: (await import("@/pages/tasks")).default
            })
          },
          {
            path: "shop-products",
            lazy: async () => ({
              Component: (await import("@/pages/shops/products")).default
            })
          },
          {
            path: "shop-products/update/:id",
            lazy: async () => ({
              Component: (await import("@/pages/shops/products/update-product")).default
            })
          },
          {
            path: "shops",
            lazy: async () => ({
              Component: (await import("@/pages/shops")).default
            })
          },
          {
            path: "restaurants",
            lazy: async () => ({
              Component: (await import("@/pages/restaurants")).default
            })
          },
          {
            path: "restaurants/create",
            lazy: async () => ({
              Component: (await import("@/pages/restaurants/create-restaurants")).default
            })
          },
          {
            path: "restaurants/update/:id",
            lazy: async () => ({
              Component: (await import("@/pages/restaurants/update-restaurants")).default
            })
          },
          {
            path: "restaurant-products",
            lazy: async () => ({
              Component: (await import("@/pages/restaurants/products")).default
            })
          },
          {
            path: "category",
            lazy: async () => ({
              Component: (await import("@/pages/shops/category")).default
            })
          },
          {
            path: "category/create",
            lazy: async () => ({
              Component: (await import("@/pages/shops/category/create-category")).default
            })
          },
          {
            path: "category/update/:id",
            lazy: async () => ({
              Component: (await import("@/pages/shops/category/update-category")).default
            })
          },

          {
            path: "subcategory",
            lazy: async () => ({
              Component: (await import("@/pages/shops/subcategory")).default
            })
          },
          {
            path: "subcategory/create",
            lazy: async () => ({
              Component: (await import("@/pages/shops/subcategory/create-subcategory")).default
            })
          },
          {
            path: "subcategory/update/:id",
            lazy: async () => ({
              Component: (await import("@/pages/shops/subcategory/update-subcategory")).default
            })
          },
          {
            path: "shop-products/create",
            lazy: async () => ({
              Component: (await import("@/pages/shops/products/create-product")).default
            })
          },
          {
            path: "shops/create",
            lazy: async () => ({
              Component: (await import("@/pages/shops/create-shop")).default
            })
          },
          {
            path: "shops/update/:id",
            lazy: async () => ({
              Component: (await import("@/pages/shops/update-shop")).default
            })
          },
          {
            path: "extra-components",
            lazy: async () => ({
              Component: (await import("@/pages/extra-components")).default
            })
          },
          {
            path: "settings",
            lazy: async () => ({
              Component: (await import("./pages/settings")).default
            }),
            errorElement: <GeneralError/>,
            children: [
              {
                index: true,
                lazy: async () => ({
                  Component: (await import("./pages/settings/profile")).default
                })
              },
              {
                path: "account",
                lazy: async () => ({
                  Component: (await import("./pages/settings/account")).default
                })
              },
              {
                path: "appearance",
                lazy: async () => ({
                  Component: (await import("./pages/settings/appearance")).default
                })
              },
              {
                path: "notifications",
                lazy: async () => ({
                  Component: (await import("./pages/settings/notifications/index.jsx"))
                    .default
                })
              },
              {
                path: "display",
                lazy: async () => ({
                  Component: (await import("./pages/settings/display")).default
                })
              },
              {
                path: "error-example",
                lazy: async () => ({
                  Component: (await import("./pages/settings/error-example"))
                    .default
                }),
                errorElement: <GeneralError className="h-[50svh]" minimal/>
              }
            ]
          }
        ]
      },
    ]
  },

  // Error routes
  {path: "/500", Component: GeneralError},
  {path: "/404", Component: NotFoundError},
  {path: "/503", Component: MaintenanceError},
  {path: "/401", Component: UnauthorisedError},

  // Fallback 404 route
  {path: "*", Component: NotFoundError}
])

export default router
