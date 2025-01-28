import {
  endOfMonth,
  endOfToday, endOfWeek,
  endOfYear, endOfYesterday,
  format,
  startOfMonth,
  startOfToday, startOfWeek,
  startOfYear,
  startOfYesterday, subMonths, subWeeks, subYears
} from "date-fns";
import {useState} from "react";
import SalesChart from "./sales-purchase-chart.jsx";

const Reports = () => {

  const getTime = () => {
    return {
      //Daily
      start_of_today: format(startOfToday(), "yyyy-MM-dd HH:mm"),
      end_of_today: format(endOfToday(), "yyyy-MM-dd HH:mm"),
      start_of_yesterday: format(startOfYesterday(), "yyyy-MM-dd HH:mm"),
      end_of_yesterday: format(endOfYesterday(), "yyyy-MM-dd HH:mm"),

      //Weekly
      start_of_week: format(startOfWeek(new Date()), "yyyy-MM-dd HH:mm"),
      end_of_week: format(endOfWeek(new Date()), "yyyy-MM-dd HH:mm"),
      start_of_lastweek: format(startOfWeek(subWeeks(new Date(), 1)), "yyyy-MM-dd HH:mm"),
      end_of_lastweek: format(endOfWeek(subWeeks(new Date(), 1)), "yyyy-MM-dd HH:mm"),

      //Monthly
      startOfMonth: format(startOfMonth(new Date()), "yyyy-MM-dd HH:mm"),
      endOfMonth: format(endOfMonth(new Date()), "yyyy-MM-dd HH:mm"),
      startOfPrevMonth: format(startOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd HH:mm"),
      endOfPrevMonth: format(endOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd HH:mm"),

      //Annual
      startOfYear: format(startOfYear(new Date()), "yyyy-MM-dd HH:mm"),
      endOfYear: format(endOfYear(new Date()), "yyyy-MM-dd HH:mm"),
      startOfPreviousYear: format(startOfYear(subYears(new Date(), 1)), "yyyy-MM-dd HH:mm"),
      endOfPreviousYear: format(endOfYear(subYears(new Date(), 1)), "yyyy-MM-dd HH:mm"),
    }
  }

  const [start_date, setStart_Date] = useState(getTime().startOfMonth)
  const [end_date, setEnd_Date] = useState(getTime().endOfMonth)
  const [type, setType] = useState("day")

  const handleChangeDate = (start, end, type) => {
    type && setType(type)
    setStart_Date(start)
    setEnd_Date(end)
  }

  const navigator = {
    today: () => handleChangeDate(getTime().start_of_today, getTime().end_of_today, "hour"),
    yesterday: () => handleChangeDate(getTime().start_of_yesterday, getTime().end_of_yesterday, "hour"),
    this_week: () => handleChangeDate(getTime().start_of_week, getTime().end_of_week, "week"),
    last_week: () => handleChangeDate(getTime().start_of_lastweek, getTime().end_of_lastweek, "week"),
    current_month: () => handleChangeDate(getTime().startOfMonth, getTime().endOfMonth, "day"),
    prev_month: () => handleChangeDate(getTime().startOfPrevMonth, getTime().endOfPrevMonth, "day"),
    this_year: () => handleChangeDate(getTime().startOfYear, getTime().endOfYear, "month"),
    last_year: () => handleChangeDate(getTime().startOfPreviousYear, getTime().endOfPreviousYear, "month")
  }

  const getToggeData = (data) => {
    const daily = {
      today: {
        label: "today",
        data: data.today,
        onClick: navigator.today
      },
      yesterday: {
        label: "yesterday",
        data: data.yesterday,
        onClick: navigator.yesterday
      }
    }

    const weekly = {
      this_week: {
        label: "current_week",
        data: data.this_week,
        onClick: navigator.this_week
      },
      last_week: {
        label: "prev_week",
        data: data.last_week,
        onClick: navigator.last_week,
      }
    }

    const monthly = {
      current_month: {
        label: "current_month",
        data: data.this_month,
        onClick: navigator.current_month
      },
      prev_month: {
        label: "prev_month",
        data: data.last_month,
        onClick: navigator.prev_month
      },
    }

    const annaul = {
      this_year: {
        label: "current_year",
        data: data.this_year,
        onClick: navigator.this_year,
      },
      last_year: {
        label: "prev_year",
        data: data.last_year,
        onClick: navigator.last_year
      },
    }

    return {daily, weekly, monthly, annaul}
  }

  return (
    <div>
      <SalesChart
        start_date={start_date}
        end_date={end_date}
        setStart_Date={setStart_Date}
        setEnd_Date={setEnd_Date}
        type={type}
        setType={setType}
        getTime={getTime}
        navigator={navigator}
      />
    </div>
  );
};

export default Reports;
