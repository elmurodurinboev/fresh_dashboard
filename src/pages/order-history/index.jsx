import {Layout} from "@/components/custom/layout.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu.jsx";
import OrderService from "@/services/order.service.js";
import {format} from "date-fns";
import {cn} from "@/lib/utils.js";
import {useTranslations} from "use-intl";
import {Formatter} from "@/utils/formatter.js";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.jsx";
import {IconCash, IconCreditCard} from "@tabler/icons-react";
import OrdersItem from "@/components/orders/orders-item.jsx";
import {Button} from "@/components/ui/button.jsx";
import {IconSelector} from "@tabler/icons-react";
import {DotsHorizontalIcon} from "@radix-ui/react-icons";
import {toast} from "@/hooks/use-toast.js";

const Index = () => {
  const t = useTranslations("order");
  const orderData = useQuery({
    queryKey: ["getAllOrders"],
    queryFn: OrderService.getAll,
  });

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

  const statuses = [
    {
      value: "new",
      label: "Yangi",
    },
    // {
    //   value: "paid",
    //   label: "To'langan",
    // },
    {
      value: "accepted",
      label: "Qabul qilingan",
    },
    // {
    //   value: "delivering",
    //   label: "Yetkazilyapdi",
    // },
    {
      value: "completed",
      label: "Tugallangan",
    },
    {
      value: "canceled",
      label: "Bekor qilingan",
    },
    {
      value: "returned",
      label: "Qaytarilgan",
    },
  ];

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: OrderService.change,
    onError: (error) => {
      console.log(error);

      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Messages.error_occurred",
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "OK",
          variant: "success",
          description: "Muvaffaqiyatli o'zgartirildi!",
        });
        return queryClient.invalidateQueries(["getAllOrders"]);
      }
      toast({
        title: "Error",
        variant: "destructive",
        description: data?.result?.status[0] || "Nimadir xato ketdi!"
      })
    },
  });
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header/>

      <Layout.Body>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Buyurtmalar</h2>
          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          {!orderData.isLoading ? (
            orderData &&
            orderData.data &&
            orderData.isSuccess &&
            !orderData.isError && (
              <div className="rounded-md border min-h-[500px] font-medium">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Qayerdan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Buyurtma narhi</TableHead>
                      <TableHead>Yetkazish narhi</TableHead>
                      <TableHead className={"text-end"}>
                        Yaratilgan sana
                      </TableHead>
                      <TableHead className="text-end">Amallar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderData.data.result.length > 0 ? (
                      orderData.data.result.map((order, index) => (
                        <Collapsible key={order.id} asChild>
                          <>
                            <TableRow
                              key={index}
                              className={cn("", getRowClass(order.status))}
                            >
                              <TableCell>{order?.org?.name}</TableCell>
                              <TableCell>
                                {t(order.status.toString())}
                              </TableCell>
                              <TableCell className={"flex items-center gap-2"}>
                                {order.payment_type && order.payment_type === 'cash' ?
                                  <IconCash size={20}/> : <IconCreditCard size={20}/>
                                }
                                {Formatter.currency(order?.amount)}
                              </TableCell>
                              <TableCell>
                                {Formatter.currency(order?.delivery_fee)}
                              </TableCell>

                              <TableCell className={"text-end"}>
                                {format(order?.created_at, "dd-MM-yyyy HH:MM")}
                              </TableCell>
                              <TableCell
                                className={
                                  "gap-2 items-center flex justify-end"
                                }
                              >
                                <CollapsibleTrigger asChild>
                                  <Button variant={"ghost"}>
                                    <IconSelector size={20}/>
                                  </Button>
                                </CollapsibleTrigger>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                                    >
                                      <DotsHorizontalIcon className="h-4 w-4"/>
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-[160px]"
                                  >
                                    <DropdownMenuSub>
                                      <DropdownMenuSubTrigger>
                                        Status
                                      </DropdownMenuSubTrigger>
                                      <DropdownMenuSubContent>
                                        <DropdownMenuRadioGroup
                                          value={order.status}
                                        >
                                          {statuses.map((status, index) => (
                                            <DropdownMenuRadioItem
                                              key={index}
                                              value={status.value}
                                              className={"cursor-pointer"}
                                              onClick={() =>
                                                mutation.mutate({
                                                  id: order.id,
                                                  type: order.org_type,
                                                  status: status.value,
                                                })
                                              }
                                            >
                                              {status.label}
                                            </DropdownMenuRadioItem>
                                          ))}
                                        </DropdownMenuRadioGroup>
                                      </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                            <CollapsibleContent
                              asChild
                              className={"bg-green-500"}
                            >
                              {order.items && order.items.length > 0 && (
                                <OrdersItem
                                  orderItems={order.items}
                                  client={order.client}
                                  org={order.org}
                                />
                              )}
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
                    )}
                  </TableBody>
                </Table>
              </div>
            )
          ) : (
            <Skeleton className={"rounded-md border h-[500px]"}/>
          )}
        </div>
      </Layout.Body>
    </Layout>
  );
};

export default Index;
