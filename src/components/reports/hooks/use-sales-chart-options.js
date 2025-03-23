// /features/reports/hooks/useSalesChartOptions.js
import {Formatter} from "@/utils/formatter";
import {format} from "date-fns";

export const useSalesChartOptions = (data = [], type = "day") => {
    const getCategories = () => {
        if (!data) return [];
        if (type === "hour") return data.map(item => format(new Date(item.date), "HH:mm"));
        if (type === "day" || type === "week") return data.map(item => format(new Date(item.date), "dd"));
        if (type === "month") return data.map(item => format(new Date(item.date), "LLLL"));
        return [];
    };

    const getSeries = () => [
        {
            name: "Statistika",
            type: "column",
            data: data.map(item => item.total),
            color: "#7F63F1",
        },
    ];

    const chartOptions = {
        chart: {
            height: 350,
            type: "line",
            toolbar: {show: false},
            animations: {enabled: false},
            zoom: {enabled: false},
        },
        markers: {size: 0},
        dataLabels: {enabled: false},
        fill: {
            colors: ["#7F63F1"],
            borderRadius: "10px",
        },
        plotOptions: {
            bar: {
                columnWidth: "50%",
                borderRadius: 5,
            },
        },
        stroke: {
            width: [4, 4],
            colors: ["transparent", "transparent"],
        },
        xaxis: {
            categories: getCategories(),
            labels: {
                style: {
                    fontSize: "12px",
                    fontWeight: 400,
                    colors: "#667085",
                },
            },
            tooltip: {enabled: false},
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: "12px",
                    fontWeight: 400,
                    colors: "#667085",
                },
                formatter: val => Formatter.currency(val),
            },
        },
        tooltip: {
            theme: false,
            hideEmptySeries: false,
            y: {
                formatter: val => val ? Formatter.currency(val) : val,
            },
        },
    };

    return {chartOptions, series: getSeries()};
};
