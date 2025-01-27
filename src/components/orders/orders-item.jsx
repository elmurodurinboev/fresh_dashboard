import {TableCell, TableRow, Table, TableHead, TableHeader} from "@/components/ui/table";
import DefaultImage from "@/components/custom/default-image.jsx";
import {Formatter} from "@/utils/formatter.js";
import {useAuth} from "@/hooks/utils/useAuth.js";
import ROLES from "@/data/roles.js";
import {IconUser} from "@tabler/icons-react";

export default function OrdersItem({orderItems, client}) {
  const {session} = useAuth()
  return (
    <TableRow>
      <TableCell colSpan={6} className={"bg-[#f7f7f7] p-4"}>
        {
          client && session && session.user && session.user.user_role === ROLES.ADMIN &&
          (
            <div className={"flex gap-4 items-center"}>
              <div className={"w-[64px] h-[64px] bg-input flex justify-center items-center rounded-full overflow-hidden"}>
                {
                  session.user.picture ? (
                    <img
                      src={session.user.picture}
                      alt={"product_image"}
                      className={"w-[64px] h-[64px] rounded-md object-cover"}
                    />
                  ) : (
                    <IconUser className={"w-12 h-12"}/>
                  )
                }
              </div>
              <div className={"flex flex-col gap-2"}>
                <p>Ism: <b>{session.user.full_name}</b></p>
                <p>Jinsi: <b>{session.user.gender}</b></p>
                <p>Telefon raqami: <b>{Formatter.formatPhoneNumber(session.user.phone_number)}</b></p>
              </div>
            </div>
          )
        }
        <div className={"w-full border border-primary !rounded-md overflow-hidden mt-4"}>
          <Table>
            <TableHeader>
              <TableRow className={"bg-border"}>
                <TableHead className={"text-black"}>
                  Ovqat nomi va rasmi
                </TableHead>
                <TableHead className={"text-black"}>
                  Soni
                </TableHead>
                <TableHead className={"text-end text-black"}>
                  Narhi
                </TableHead>
              </TableRow>
            </TableHeader>
            {orderItems && orderItems.length > 0 ? (
              orderItems.map((product, index) => (
                <TableRow key={index}>
                  <TableCell className={"flex gap-2 items-center overflow-hidden"}>
                    {product.product_image ? (
                      <img
                        src={product.product_image}
                        alt={"product_image"}
                        className={"w-[48px] h-[48px] rounded-md object-cover"}
                      />
                    ) : (
                      <DefaultImage/>
                    )}
                    <span>{product.product}</span>
                  </TableCell>
                  <TableCell>{Formatter.with_space(product.quantity)} ta</TableCell>
                  <TableCell className={"text-end"}>
                    {Formatter.currency(product.price)} so`m
                  </TableCell>
                </TableRow>
              ))
            ) : null}
          </Table>
        </div>
      </TableCell>
    </TableRow>
  );
}