import {useQuery} from "@tanstack/react-query";
import {Formatter} from "@/utils/formatter.js";
import {
  differenceInDays,
  endOfDay,
  format,
  startOfDay,
} from "date-fns";
import { Calendar } from "@/components/ui/calendar"
import Chart from "react-apexcharts";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.jsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {Button, buttonVariants} from "@/components/ui/button.jsx";
import {IconCalendar} from "@tabler/icons-react";
import {cn} from "@/lib/utils.js";
import ReportService from "@/services/report.service.js";

const SalesChart = ({start_date, end_date, setStart_Date, setEnd_Date, type, setType, navigator}) => {
  const sales_chart = useQuery({
    queryKey: ["chart.sales", type, start_date, end_date],
    queryFn: ReportService.getSalesChart
  })
  const options = {
    chart: {
      height: 350,
      type: 'line',
      toolbar: {
        show: false
      },
      animations: {
        enabled: false
      },
      zoom: {
        enabled: false
      }
    },
    markers: {
      size: 0
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      colors: ["#7F63F1"],
      borderRadius: "10px"
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        borderRadius: 5,
      }
    },
    stroke: {
      width: [4, 4],
      colors: ["transparent", "transparent"]
    },
    xaxis: {
      // categories: ["12-00", "12-00"],
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 400,
          colors: "#667085"
        }
      },
      tooltip: {
        enabled: false
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 400,
          colors: "#667085",
        },
        formatter: (val) => `${Formatter.currency(val)}`,
      },
    },
    tooltip: {
      theme: false,
      hideEmptySeries: false,
      y: {
        formatter: val => {
          if (val){
            return `${Formatter.currency(val)}`
          }
          return val
        }
      }
    }
  }

  const getCategories = (data) => {
    let categories = []
    if (type === "hour") {
      categories = data.map(hour => format(new Date(hour.date), "HH:mm"));
    }

    if (type === "day" || type === "week") {
      categories = data.map(day => format(new Date(day.date), "dd"));
    }

    if (type === "month") {
      categories = data.map(day => format(new Date(day.date), "LLLL"));
    }

    return categories
  }

  const getSeries = (data) => {
    const getCategories = () => {
      return data.map(date => date.total);
    }

    const series = [
      {
        name: "Statistika",
        type: 'column',
        data: getCategories(),
        color: "#7F63F1",
      },
    ]

    return series
  }
  return (
    <div className={"statistics-incexp w-full shadow p-6 bg-white rounded-md"}>
      <div className="statistic-header">
        <h1 className={"text-xl font-semibold"}>Hisobotlar</h1>
      </div>
      <div className="statistic-tabs">
        <Tabs value={type} onValueChange={(value) => {
          setType(value)
          if (value === "hour") {
            navigator.today()
          }
          if (value === "day") {
            navigator.current_month()
          }
          if (value === "week") {
            navigator.this_week()
          }
          if (value === "month") {
            navigator.this_year()
          }
        }}>
          <div className="flex justify-between items-center mb-2">
            <TabsList className={"pl-0 space-x-6 bg-transparent"}>
              <TabsTrigger value="hour"
                           className={"data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-b-primary rounded-none p-0"}>Kunlik</TabsTrigger>
              <TabsTrigger value="week"
                           className={"data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-b-primary rounded-none p-0"}>Haftalik</TabsTrigger>
              <TabsTrigger value="day"
                           className={"data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-b-primary rounded-none p-0"}>Oylik</TabsTrigger>
              <TabsTrigger value="month"
                           className={"data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-b-primary rounded-none p-0"}>Yillik</TabsTrigger>
            </TabsList>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  type={"button"}
                  className={cn(" justify-start text-left font-normal", !start_date && "text-muted-foreground")}
                >
                  <IconCalendar className="mr-2 h-4 w-4"/>
                  {start_date ? format(new Date(start_date), "PPP") + "-" + format(new Date(end_date), "PPP") :
                    <span>Sana tanlash</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent align={"end"} className="w-auto p-0 flex items-center">
                <div className={"flex flex-col p-2 px-4 gap-2"}>
                  <button
                    className={cn(buttonVariants({variant: "ghost"}), "bg-neutral-50 dark:bg-secondary dark:text-gray-200 dark:hover:text-primary")}
                    onClick={() => navigator.yesterday()}
                  >
                    yesterday
                  </button>
                  <button
                    className={cn(buttonVariants({variant: "ghost"}), "bg-neutral-50 dark:bg-secondary dark:text-gray-200 dark:hover:text-primary")}
                    onClick={() => navigator.today()}
                  >
                    today
                  </button>
                  <button
                    className={cn(buttonVariants({variant: "ghost"}), "bg-neutral-50 dark:bg-secondary dark:text-gray-200 dark:hover:text-primary")}
                    onClick={() => navigator.this_week()}
                  >
                    current_week
                  </button>
                  <button
                    className={cn(buttonVariants({variant: "ghost"}), "bg-neutral-50 dark:bg-secondary dark:text-gray-200 dark:hover:text-primary")}
                    onClick={() => navigator.last_week()}
                  >
                    prev_week
                  </button>
                  <button
                    className={cn(buttonVariants({variant: "ghost"}), "bg-neutral-50 dark:bg-secondary dark:text-gray-200 dark:hover:text-primary")}
                    onClick={() => navigator.current_month()}
                  >
                    current_month
                  </button>
                  <button
                    className={cn(buttonVariants({variant: "ghost"}), "bg-neutral-50 dark:bg-secondary dark:text-gray-200 dark:hover:text-primary")}
                    onClick={() => navigator.prev_month()}
                  >
                    prev_month
                  </button>
                  <button
                    className={cn(buttonVariants({variant: "ghost"}), "bg-neutral-50 dark:bg-secondary dark:text-gray-200 dark:hover:text-primary")}
                    onClick={() => navigator.this_year()}
                  >
                    current_year
                  </button>
                </div>
                <Calendar
                  mode="range"
                  captionLayout="dropdown-buttons"
                  selected={{
                    from: start_date && new Date(start_date),
                    to: end_date && new Date(end_date)
                  }}
                  onSelect={(newDate) => {
                    if (!newDate || !newDate.from || !newDate.to) return;

                    const differenceDays = differenceInDays(newDate.to, newDate.from);
                    if (differenceDays > 0 && differenceDays < 2) {
                      setType("hour");
                    } else if (differenceDays < 14) {
                      setType("week");
                    } else if (differenceDays < 30) {
                      setType("day");
                    } else {
                      setType("month");
                    }

                    setStart_Date(format(startOfDay(newDate.from), "yyyy-MM-dd HH:mm"));
                    setEnd_Date(format(endOfDay(newDate.to), "yyyy-MM-dd HH:mm"));
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          {!sales_chart.isLoading ? (
            !sales_chart.isError && (
              sales_chart.isSuccess && sales_chart.data && sales_chart.data.result && (
                <>
                  <Chart
                    options={{...options, xaxis: {...options.xaxis, categories: getCategories(sales_chart.data.result)}}}
                    series={getSeries(sales_chart.data.result)}
                    height={392}
                    width={"100%"}
                    type="line"
                  />
                </>
              )
            )
          ) : (
            <Skeleton className={"h-[300px]"}/>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default SalesChart;