import {useState} from "react";
import SalesChart from "./sales-purchase-chart.jsx";
import {useReportsNavigator} from "@/hooks/use-reports-navigator.js";

const Reports = () => {
    const [start_date, setStart_Date] = useState("");
    const [end_date, setEnd_Date] = useState("");
    const [type, setType] = useState("day");

    const {time, navigator} = useReportsNavigator(setStart_Date, setEnd_Date, setType);

    useState(() => {
        navigator.current_month();
    }, []);

    return (
        <div>
            <SalesChart
                start_date={start_date}
                end_date={end_date}
                setStart_Date={setStart_Date}
                setEnd_Date={setEnd_Date}
                type={type}
                setType={setType}
                getTime={time}
                navigator={navigator}
            />
        </div>
    );
};

export default Reports;
