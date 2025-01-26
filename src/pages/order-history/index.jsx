import {Layout} from "@/components/custom/layout.jsx";
import ThemeSwitch from "@/components/theme-switch.jsx";
import {UserNav} from "@/components/user-nav.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {useQuery} from "@tanstack/react-query";
import {Skeleton} from "@/components/ui/skeleton.jsx";

import OrderService from "@/services/order.service.js";
import {format} from "date-fns";
import {cn} from "@/lib/utils.js";
import {useTranslations} from "use-intl";
import {Formatter} from "@/utils/formatter.js";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.jsx";
import OrdersItem from "@/components/orders/orders-item.jsx";
import {Button} from "@/components/ui/button.jsx";
import {
  IconSelector
} from "@tabler/icons-react"

const Index = () => {
  const t = useTranslations("order")
  const orderData = useQuery({
    queryKey: ['getAllOrders'],
    queryFn: OrderService.getAll,
  })

  const getRowClass = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 hover:bg-blue-200"; // Light blue for "new"
      case "paid":
        return "bg-green-50 hover:bg-green-100"; // Light green for "pay"
      case "accepted":
        return "bg-orange-100 hover:bg-orange-200"; // Light orange for "accepted"
      case "delivering":
        return "bg-purple-100 hover:bg-purple-200"; // Light purple for "delivery"
      case "completed":
        return "bg-green-100 hover:bg-green-200"; // Light green for "completed"
      case "canceled":
        return "bg-red-200 hover:bg-red-300"; // Light red for "canceled"
      case "returned":
        return "bg-pink-100 hover:bg-pink-200"; // Light pink for "returned"
      default:
        return "bg-gray-100 hover:bg-gray-200"; // Default gray
    }
  };

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
                        <TableHead>

                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        orderData.data.result.length > 0 ? (
                          orderData.data.result.map((order, index) => (
                            <Collapsible key={order.id} asChild>
                              <>
                                <TableRow key={index} className={cn("", getRowClass(order.status))}>
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
                                      Formatter.currency(order?.amount)
                                    }
                                  </TableCell>
                                  <TableCell>
                                    {
                                      Formatter.currency(order?.delivery_fee)
                                    }
                                  </TableCell>

                                  <TableCell className={"text-end"}>
                                    {
                                      format(order?.created_at, 'dd-MM-yyyy HH:MM')
                                    }
                                  </TableCell>
                                  <TableCell className={"text-end"}>
                                    <CollapsibleTrigger asChild>
                                      <Button variant={"outline"}>
                                        <IconSelector size={20} />
                                      </Button>
                                    </CollapsibleTrigger>
                                  </TableCell>
                                </TableRow>
                                <CollapsibleContent asChild className={"!bg-[#f7f7f7]"}>
                                  {
                                    order.items && order.items.length > 0 && <OrdersItem orderItems={order.items} />
                                  }
                                </CollapsibleContent>
                              </>
                            </Collapsible>
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