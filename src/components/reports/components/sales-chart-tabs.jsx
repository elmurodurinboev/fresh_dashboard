// /features/reports/components/SalesChartTabs.jsx
import {TabsList, TabsTrigger} from "@/components/ui/tabs";

const tabs = [
    {value: "hour", label: "Kunlik"},
    {value: "week", label: "Haftalik"},
    {value: "day", label: "Oylik"},
    {value: "month", label: "Yillik"},
];

const SalesChartTabs = () => {
    return (
        <div className="flex justify-between items-center mb-2">
            <TabsList className="pl-0 space-x-6 bg-transparent">
                {tabs.map((tab) => (
                    <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-b-primary rounded-none p-0"
                    >
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </div>
    );
};

export default SalesChartTabs;
