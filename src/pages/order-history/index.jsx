import {Layout} from "@/components/custom/layout.jsx";
import ThemeSwitch from "@/components/theme-switch.jsx";
import {UserNav} from "@/components/user-nav.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import { useQuery} from "@tanstack/react-query";
import {Skeleton} from "@/components/ui/skeleton.jsx";

import {Button} from "@/components/custom/button.jsx";
import {useNavigate} from "react-router-dom";
import OrderService from "@/services/order.service.js";
import {format} from "date-fns";
import {cn} from "@/lib/utils.js";
import {useTranslations} from "use-intl";

const Index = () => {
  const t = useTranslations("order")
  const orderData = useQuery({
    queryKey: ['getAllOrders'],
    queryFn: OrderService.getAll,

  })

  const getRowClass = (status) => {
    switch (status) {
      case "new":
        return "bg-yellow-100 hover:bg-yellow-200"; // Light blue for "new"
      case "delivery":
        return "bg-blue-100 hover:bg-blue-200"; // Light green for "delivery"
      case "returned":
        return "bg-red-100 hover:bg-red-200"; // Light red for "returned"
      case "completed":
        return "bg-green-300 hover:bg-green-400"; // Light red for "returned"
      default:
        return "bg-gray-100 hover:bg-gray-200"; // Default gray
    }
  };

  const navigate = useNavigate()

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header sticky>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch/>
          <UserNav/>
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Buyurtmalar</h2>
          </div>
          <div>
            <Button
              onClick={() => navigate("create")}
            >
              Do`kon qo`shish
            </Button>
          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          {
            !orderData.isLoading ? (
              orderData && orderData.data && orderData.isSuccess && !orderData.isError && (
                <div className="rounded-md border min-h-[500px] font-medium">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          Qayerdan
                        </TableHead>
                        <TableHead>
                          Status
                        </TableHead>
                        <TableHead>
                          Buyurtma narhi
                        </TableHead>
                        <TableHead>
                          Yetkazish narhi
                        </TableHead>
                        <TableHead className={"text-end"}>
                          Yaratilgan sana
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        orderData.data.result.length > 0 ? (
                          orderData.data.result.map((order, index) => (
                            <TableRow key={index} className={cn("",getRowClass(order.status))}>
                              <TableCell>
                                {
                                  order?.org_type
                                }
                              </TableCell>
                              <TableCell>
                                {
                                  t(order.status.toString())
                                }
                              </TableCell>
                              <TableCell>
                                {
                                  order?.amount
                                }
                              </TableCell>
                              <TableCell>
                                {
                                  order?.delivery_fee
                                }
                              </TableCell>

                              <TableCell className={"text-end"}>
                                {
                                  format(order?.created_at, 'yyyy-MM-dd HH:MM')
                                }
                              </TableCell>
                            </TableRow>
                          ))

                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="h-24 text-center text-rose-500 font-medium"
                            >
                              No results.
                            </TableCell>
                          </TableRow>
                        )
                      }

                    </TableBody>
                  </Table>
                </div>
              )
            ) : (
              <Skeleton className={"rounded-md border h-[500px]"}/>
            )
          }
        </div>
      </Layout.Body>
    </Layout>
  )
};

export default Index;