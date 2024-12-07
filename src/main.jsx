import React from "react"
import ReactDOM from "react-dom/client"
import {RouterProvider} from "react-router-dom"
import {Toaster} from "@/components/ui/toaster"
import {ThemeProvider} from "@/components/theme-provider"
import "@/index.css"
import router from "./router.jsx";
import {LanguageProvider} from "./components/language-provider.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <LanguageProvider defaultLanguage="en" storageKey="vite-ui-language">
          <RouterProvider router={router}/>
          <Toaster/>
        </LanguageProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  </React.StrictMode>
)
