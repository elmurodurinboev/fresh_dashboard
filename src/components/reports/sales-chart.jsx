// /features/reports/components/SalesChart.jsx
import {useQuery} from "@tanstack/react-query";
import Chart from "react-apexcharts";
import {Skeleton} from "@/components/ui/skeleton";
import {Tabs} from "@/components/ui/tabs";
import ReportService from "@/services/report.service";
import {useSalesChartOptions} from "./hooks/use-sales-chart-options.js";
import SalesChartHeader from "./components/sales-chart-header.jsx";
import SalesChartTabs from "./components/sales-chart-tabs.jsx";

const SalesChart = (
    {
        start_date,
        end_date,
        setStart_Date,
        setEnd_Date,
        type,
        setType,
        navigator,
    }
) => {
    const {data, isLoading, isSuccess, isError} = useQuery({
        queryKey: ["chart.sales", type, start_date, end_date],
        queryFn: ReportService.getSalesChart,
    });

    const options = useSalesChartOptions(data?.result, type);

    return (
        <div className="statistics-incexp w-full shadow p-6 bg-white rounded-md">
            <div className="statistic-header mb-4">
                <h1 className="text-xl font-semibold">Hisobotlar</h1>
                <SalesChartHeader
                    start_date={start_date}
                    end_date={end_date}
                    setStart_Date={setStart_Date}
                    setEnd_Date={setEnd_Date}
                    setType={setType}
                    navigator={navigator}
                />
            </div>
            <Tabs value={type} onValueChange={(value) => {
                setType(value);
                navigator[{
                    hour: "today",
                    day: "current_month",
                    week: "this_week",
                    month: "this_year",
                }[value]]?.();
            }}>
                <SalesChartTabs/>
                {!isLoading ? (
                    !isError && isSuccess && data?.result && (
                        <Chart
                            options={options?.chartOptions}
                            series={options?.series}
                            height={392}
                            width="100%"
                            type="line"
                        />
                    )
                ) : (
                    <Skeleton className="h-[300px]"/>
                )}
            </Tabs>
        </div>
    );
};

export default SalesChart;
