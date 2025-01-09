import { Layout } from "@/components/custom/layout"
import ThemeSwitch from "@/components/theme-switch"
import { UserNav } from "@/components/user-nav"
import LanguageSwitch from "@/components/language-switch"
import Reports from "@/pages/dashboard/components/reports.jsx";

export default function Dashboard() {
  // const t = useTranslations("dashboard")
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <LanguageSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      {/* ===== Main ===== */}
      <Layout.Body>
        <Reports />
      </Layout.Body>
    </Layout>
  )
}

