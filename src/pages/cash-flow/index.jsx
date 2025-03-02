import {Layout} from "@/components/custom/layout.jsx";
import {useQuery} from "@tanstack/react-query";
import CashFlowService from "@/services/cash-flow.service.js";
import BalanceCard from "@/components/cash-flow/balance-card.jsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.jsx";
import RestaurantBalanceTable from "@/components/cash-flow/restaurant-balance-table.jsx";
import {useAuth} from "@/hooks/utils/useAuth.js";
import ROLES from "@/data/roles.js";
import RestaurantAccountHistoryTable from "@/components/cash-flow/restaurant-account-history-table.jsx";
import {useSearchParams} from "react-router-dom";
import RestaurantAccountsTable from "@/components/cash-flow/restaurant-accounts-table.jsx";
import {
  endOfMonth,
  endOfToday,
  endOfWeek,
  endOfYear,
  endOfYesterday,
  format,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYear,
  startOfYesterday,
  subMonths,
  subWeeks,
  subYears
} from "date-fns";
import {useState} from "react";

const Index = () => {
  const {session} = useAuth()
  const cashFlowData = useQuery({
    queryKey: ['getAllCashFlowData'],
    queryFn: CashFlowService.getAll
  })
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || "payouts";

  const accountsData = useQuery({
    queryKey: ["getAccounts"],
    queryFn: CashFlowService.getRestaurantsAccounts,
    enabled: session?.user?.user_role === ROLES.ADMIN
  })

  const updateTab = (newTab) => {
    searchParams.set('tab', newTab);
    setSearchParams(searchParams);
  };

  // Calendars logic
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

  const handleChangeDate = (start, end) => {
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

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header/>

      <Layout.Body>
        {
          session?.user?.user_role === ROLES.RESTAURANT_OWNER && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <BalanceCard
                amount={500000}
                title={"To'lov uchun mavjud"}
                description={"Siz bank hisob raqaminggizga chiqarib olishinggiz mumkin bo'lgan pul miqdori."}
              />
              <BalanceCard
                amount={10000000}
                title={"Jan 1 - Jan 31 uchun to'lov"}
                description={"Ushbu muddatda hisob raqamiga chiqarilgan barcha pul miqdori."}
              />
              <BalanceCard
                amount={0}
                title={"Restoran balansi"}
                description={"Buyurtmalardan komissiya olinadigan restoran balansidagi pul miqdori"}
              />
            </div>
          )
        }
        {/* Tabs and Table Section */}
        <div className="bg-white">
          <Tabs defaultValue={tab} onValueChange={updateTab} className="w-full">
            <TabsList className="w-full flex justify-start rounded-none bg-transparent h-12">
              {
                session?.user?.user_role === ROLES.ADMIN && (
                  <TabsTrigger
                    value="accounts"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none h-12"
                  >
                    Hisoblar
                  </TabsTrigger>
                )
              }
              <TabsTrigger
                value="payouts"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none h-12"
              >
                Hisob tarixi
              </TabsTrigger>
              <TabsTrigger
                value="account-top-ups"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none h-12"
              >
                Balans tarixi
              </TabsTrigger>
            </TabsList>

            {
              session?.user?.user_role === ROLES.ADMIN && (
                <TabsContent value="accounts">
                  <RestaurantAccountsTable accountsData={accountsData}/>
                </TabsContent>
              )
            }

            <TabsContent value="payouts">
              <RestaurantAccountHistoryTable
                start_date={start_date}
                end_date={end_date}
                navigator={navigator}
                setStart_Date={setStart_Date}
                setEnd_Date={setEnd_Date}
              />
            </TabsContent>

            <TabsContent value="account-top-ups">
              <RestaurantBalanceTable cashFlowData={cashFlowData}/>
            </TabsContent>
          </Tabs>
        </div>
      </Layout.Body>
    </Layout>
  );
};

export default Index;