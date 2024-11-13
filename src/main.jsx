import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provide"
import router from "@/router"
import "@/index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LanguageProvider defaultLanguage="en" storageKey="vite-ui-language">
        <RouterProvider router={router} />
        <Toaster />
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
)
