import {Layout} from "@/components/custom/layout.jsx";
import {Button} from "@/components/custom/button.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {useQuery} from "@tanstack/react-query";
import CashFlowService from "@/services/cash-flow.service.js";
import BalanceCard from "@/components/cash-flow/balance-card.jsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.jsx";
import {IconDownload} from "@tabler/icons-react";
import RestaurantBalanceTable from "@/components/cash-flow/restaurant-balance-table.jsx";

const Index = () => {
  const cashFlowData = useQuery({
    queryKey: ['getAllCashFlowData'],
    queryFn: CashFlowService.getAll
  })


  const tableData = [
    {
      paymentNumber: "37003",
      amount: "UZS 8,639,364.09",
      status: "Paid",
      accountNumber: "20208000105582672001",
      dateCreated: "Jul 22, 8:00 AM"
    },
    {
      paymentNumber: "31143",
      amount: "UZS 12,218,999.65",
      status: "Paid",
      accountNumber: "20208000105582672001",
      dateCreated: "Jul 1, 8:00 AM"
    }
  ];


  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header/>

      <Layout.Body>
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
        {/* Tabs and Table Section */}
        <div className="bg-white">
          <Tabs defaultValue="payouts" className="w-full">
            <TabsList className="w-full flex justify-center rounded-none bg-transparent h-12">
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

            <TabsContent value="payouts" className="p-3 rounded-md shadow-md">
              <div className="p-4 flex justify-between items-center border-b">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="h-9">
                    Jan 1–31, 2024
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Payment number</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Account number</TableHead>
                      <TableHead>Date created</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row.paymentNumber}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {row.amount}
                            <div className="ml-2 flex items-center">
                              <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                              <span className="text-sm text-green-600">{row.status}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{row.accountNumber}</TableCell>
                        <TableCell>{row.dateCreated}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <IconDownload className="h-4 w-4"/>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="account-top-ups">
             <RestaurantBalanceTable cashFlowData={cashFlowData} />
            </TabsContent>
          </Tabs>
        </div>
      </Layout.Body>
    </Layout>
  );
};

export default Index;