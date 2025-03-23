// OrderRow.jsx
import {
    TableCell,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {format} from "date-fns";
import {cn} from "@/lib/utils";
import {IconCash, IconCreditCard, IconSelector} from "@tabler/icons-react";
import OrdersItem from "@/components/orders/orders-item";
import {Button} from "@/components/ui/button";
import {DotsHorizontalIcon} from "@radix-ui/react-icons";
import {Formatter} from "@/utils/formatter";
import {useTranslations} from "use-intl";
import OrderService from "@/services/order.service.js";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "@/hooks/use-toast.js";

const OrderRow = ({order}) => {
    const t = useTranslations("order");
    const getRowClass = (status) => {
        switch (status) {
            case "new":
                return "bg-blue-100 hover:bg-blue-200";
            case "paid":
                return "bg-green-50 hover:bg-green-100";
            case "accepted":
                return "bg-orange-100 hover:bg-orange-200";
            case "delivering":
                return "bg-purple-100 hover:bg-purple-200";
            case "completed":
                return "bg-green-100 hover:bg-green-200";
            case "canceled":
                return "bg-red-200 hover:bg-red-300";
            case "returned":
                return "bg-pink-100 hover:bg-pink-200";
            default:
                return "bg-gray-100 hover:bg-gray-200";
        }
    };

    const statuses = [
        {value: "new", label: "Yangi"},
        {value: "accepted", label: "Qabul qilingan"},
        {value: "completed", label: "Tugallangan"},
        {value: "canceled", label: "Bekor qilingan"},
        {value: "returned", label: "Qaytarilgan"},
    ];

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: OrderService.change,
        onError: (error) => {
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
        <Collapsible asChild>
            <>
                <TableRow className={cn("", getRowClass(order?.status))}>
                    <TableCell>{order?.org?.name}</TableCell>
                    <TableCell>{t(order?.status?.toString())}</TableCell>
                    <TableCell className="flex items-center gap-2">
                        {order?.payment_type === 'cash' ? <IconCash size={20}/> : <IconCreditCard size={20}/>}
                        {Formatter.currency(order?.amount)}
                    </TableCell>
                    <TableCell>{Formatter.currency(order?.delivery_fee)}</TableCell>
                    <TableCell className="text-end">
                        {format(order?.created_at, "dd-MM-yyyy HH:MM")}
                    </TableCell>
                    <TableCell className="gap-2 items-center flex justify-end">
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost">
                                <IconSelector size={20}/>
                            </Button>
                        </CollapsibleTrigger>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                                    <DotsHorizontalIcon className="h-4 w-4"/>
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[160px]">
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuRadioGroup value={order?.status}>
                                            {statuses?.map((status) => (
                                                <DropdownMenuRadioItem
                                                    key={status?.value}
                                                    value={status?.value}
                                                    className="cursor-pointer"
                                                    onClick={() => mutation.mutate({
                                                        id: order?.id,
                                                        type: order?.org_type,
                                                        status: status?.value,
                                                    })}
                                                >
                                                    {status?.label}
                                                </DropdownMenuRadioItem>
                                            ))}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
                <CollapsibleContent asChild className="bg-green-500">
                    {order?.items && (
                        <OrdersItem
                            orderItems={order.items}
                            client={order.client}
                            org={order.org}
                        />
                    )}
                </CollapsibleContent>
            </>
        </Collapsible>
    );
};

export default OrderRow;
