import {
    endOfMonth, endOfToday, endOfWeek, endOfYear,
    endOfYesterday, format, startOfMonth, startOfToday,
    startOfWeek, startOfYear, startOfYesterday,
    subMonths, subWeeks, subYears,
} from "date-fns";

export const useReportsNavigator = (setStart, setEnd, setType) => {
    const getTime = () => ({
        start_of_today: format(startOfToday(), "yyyy-MM-dd HH:mm"),
        end_of_today: format(endOfToday(), "yyyy-MM-dd HH:mm"),
        start_of_yesterday: format(startOfYesterday(), "yyyy-MM-dd HH:mm"),
        end_of_yesterday: format(endOfYesterday(), "yyyy-MM-dd HH:mm"),
        start_of_week: format(startOfWeek(new Date()), "yyyy-MM-dd HH:mm"),
        end_of_week: format(endOfWeek(new Date()), "yyyy-MM-dd HH:mm"),
        start_of_lastweek: format(startOfWeek(subWeeks(new Date(), 1)), "yyyy-MM-dd HH:mm"),
        end_of_lastweek: format(endOfWeek(subWeeks(new Date(), 1)), "yyyy-MM-dd HH:mm"),
        startOfMonth: format(startOfMonth(new Date()), "yyyy-MM-dd HH:mm"),
        endOfMonth: format(endOfMonth(new Date()), "yyyy-MM-dd HH:mm"),
        startOfPrevMonth: format(startOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd HH:mm"),
        endOfPrevMonth: format(endOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd HH:mm"),
        startOfYear: format(startOfYear(new Date()), "yyyy-MM-dd HH:mm"),
        endOfYear: format(endOfYear(new Date()), "yyyy-MM-dd HH:mm"),
        startOfPreviousYear: format(startOfYear(subYears(new Date(), 1)), "yyyy-MM-dd HH:mm"),
        endOfPreviousYear: format(endOfYear(subYears(new Date(), 1)), "yyyy-MM-dd HH:mm"),
    });

    const time = getTime();

    const handleChangeDate = (start, end, type) => {
        if (type) setType(type);
        setStart(start);
        setEnd(end);
    };

    const navigator = {
        today: () => handleChangeDate(time.start_of_today, time.end_of_today, "hour"),
        yesterday: () => handleChangeDate(time.start_of_yesterday, time.end_of_yesterday, "hour"),
        this_week: () => handleChangeDate(time.start_of_week, time.end_of_week, "week"),
        last_week: () => handleChangeDate(time.start_of_lastweek, time.end_of_lastweek, "week"),
        current_month: () => handleChangeDate(time.startOfMonth, time.endOfMonth, "day"),
        prev_month: () => handleChangeDate(time.startOfPrevMonth, time.endOfPrevMonth, "day"),
        this_year: () => handleChangeDate(time.startOfYear, time.endOfYear, "month"),
        last_year: () => handleChangeDate(time.startOfPreviousYear, time.endOfPreviousYear, "month"),
    };

    return {time, navigator};
};
