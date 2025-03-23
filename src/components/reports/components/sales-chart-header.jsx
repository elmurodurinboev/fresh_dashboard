// /features/reports/components/SalesChartHeader.jsx
import {format, startOfDay, endOfDay, differenceInDays} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverTrigger, PopoverContent} from "@/components/ui/popover";
import {Button, buttonVariants} from "@/components/ui/button";
import {IconCalendar} from "@tabler/icons-react";
import {cn} from "@/lib/utils";

const SalesChartHeader = ({start_date, end_date, setStart_Date, setEnd_Date, setType, navigator}) => {
    const quickButtons = [
        {label: "yesterday", action: navigator.yesterday},
        {label: "today", action: navigator.today},
        {label: "current_week", action: navigator.this_week},
        {label: "prev_week", action: navigator.last_week},
        {label: "current_month", action: navigator.current_month},
        {label: "prev_month", action: navigator.prev_month},
        {label: "current_year", action: navigator.this_year},
    ];

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    type="button"
                    className={cn("justify-start text-left font-normal", !start_date && "text-muted-foreground")}
                >
                    <IconCalendar className="mr-2 h-4 w-4"/>
                    {start_date
                        ? `${format(new Date(start_date), "PPP")} - ${format(new Date(end_date), "PPP")}`
                        : <span>Sana tanlash</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0 flex items-center">
                <div className="flex flex-col p-2 px-4 gap-2">
                    {quickButtons.map(btn => (
                        <button
                            key={btn.label}
                            className={cn(buttonVariants({variant: "ghost"}),
                                "bg-neutral-50 dark:bg-secondary dark:text-gray-200 dark:hover:text-primary")}
                            onClick={btn.action}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
                <Calendar
                    mode="range"
                    captionLayout="dropdown-buttons"
                    selected={{
                        from: start_date && new Date(start_date),
                        to: end_date && new Date(end_date),
                    }}
                    onSelect={(newDate) => {
                        if (!newDate?.from || !newDate?.to) return;
                        const diff = differenceInDays(newDate.to, newDate.from);

                        if (diff < 2) setType("hour");
                        else if (diff < 14) setType("week");
                        else if (diff < 30) setType("day");
                        else setType("month");

                        setStart_Date(format(startOfDay(newDate.from), "yyyy-MM-dd HH:mm"));
                        setEnd_Date(format(endOfDay(newDate.to), "yyyy-MM-dd HH:mm"));
                    }}
                    numberOfMonths={2}
                />
            </PopoverContent>
        </Popover>
    );
};

export default SalesChartHeader;
