import { TableCell, TableRow } from "@/components/ui/table";

export default function OrdersItem({orderItems}) {

  return (
    <>
      {orderItems && orderItems.length > 0 ? (
        orderItems.map((order, index) => (
          <TableRow key={index}>
            <TableCell>{order.product}</TableCell>
            <TableCell>{order.quantity}</TableCell>
            <TableCell>
              {order.price}
            </TableCell>
          </TableRow>
        ))
      ) : null}
    </>
  );
}