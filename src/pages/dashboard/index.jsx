import {Layout} from "@/components/custom/layout";
import Reports from "@/pages/dashboard/components/reports.jsx";
import {ErrorBoundary} from "react-error-boundary";
import {GeneralErrorFallback} from "@/components/custom/general-error-fallback.jsx";

export default function Dashboard() {
    return (
        <Layout>
            <Layout.Header/>

            <Layout.Body>
                <ErrorBoundary fallback={<GeneralErrorFallback/>}>
                    <Reports/>
                </ErrorBoundary>
            </Layout.Body>
        </Layout>
    );
}
