import {Layout} from "@/components/custom/layout"
import Reports from "@/pages/dashboard/components/reports.jsx";

export default function Dashboard() {
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header/>

      {/* ===== Main ===== */}
      <Layout.Body>
        <Reports/>
      </Layout.Body>
    </Layout>
  )
}

