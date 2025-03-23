// OrderList.jsx
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import OrderRow from "./order-row.jsx";

const OrderList = ({orders}) => {

    return (
        <div className="rounded-md border min-h-[500px] font-medium">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Qayerdan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Buyurtma narhi</TableHead>
                        <TableHead>Yetkazish narhi</TableHead>
                        <TableHead className="text-end">Yaratilgan sana</TableHead>
                        <TableHead className="text-end">Amallar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders?.length > 0 ? (
                        orders.map((order) => (
                            <OrderRow order={order} key={order?.id}/>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-rose-500 font-medium">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default OrderList;
