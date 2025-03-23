import {
    TableCell,
    TableRow,
    Table,
    TableHead,
    TableHeader,
} from "@/components/ui/table";
import DefaultImage from "@/components/custom/default-image.jsx";
import {Formatter} from "@/utils/formatter.js";
import {useAuth} from "@/hooks/utils/useAuth.js";
import ROLES from "@/data/roles.js";
import {IconUser} from "@tabler/icons-react";

export default function OrdersItem({orderItems, client, org}) {
    const {session} = useAuth();
    return (
        <TableRow>
            <TableCell colSpan={6} className={"bg-[#f7f7f7] p-4"}>
                {client &&
                    session &&
                    session?.user &&
                    session?.user?.user_role === ROLES.ADMIN && (
                        <div className="flex justify-between gap-3">
                            <div className="flex w-1/2 flex-col gap-1">
                                <span className="text-gray-600">
                                  Organizatsiya ma'lumotlari
                                </span>
                                <div className="flex gap-4 items-center rounded-md shadow p-2">
                                    <div
                                        className={
                                            "w-[64px] h-[64px] bg-input flex justify-center items-center rounded-full overflow-hidden"
                                        }
                                    >
                                        {org?.picture ? (
                                            <img
                                                src={org?.picture}
                                                alt={"product_image"}
                                                className={"w-[64px] h-[64px] rounded-md object-cover"}
                                            />
                                        ) : (
                                            <IconUser className={"w-12 h-12"}/>
                                        )}
                                    </div>
                                    <div className={"flex flex-col gap-2"}>
                                        <p>
                                            Nomi: <b>{org?.name}</b>
                                        </p>
                                        <p>
                                            Manzil: <b>{org?.address}</b>
                                        </p>
                                        <p>
                                            Telefon raqami:{" "}
                                            <b>
                                                {Formatter.formatPhoneNumber(org?.phone_number || null)}
                                            </b>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className={"flex flex-col w-1/2 gap-1"}>
                                <span className="text-gray-600">Mijoz ma'lumotlari</span>
                                <div className="flex gap-4 items-center rounded-md shadow p-2">
                                    <div
                                        className={
                                            "w-[64px] h-[64px] bg-input flex justify-center items-center rounded-full overflow-hidden"
                                        }
                                    >
                                        {client?.picture ? (
                                            <img
                                                src={client?.picture}
                                                alt={"product_image"}
                                                className={"w-[64px] h-[64px] rounded-md object-cover"}
                                            />
                                        ) : (
                                            <IconUser className={"w-12 h-12"}/>
                                        )}
                                    </div>
                                    <div className={"flex flex-col gap-2"}>
                                        <p>
                                            Ism: <b>{client?.full_name}</b>
                                        </p>
                                        <p>
                                            Jinsi: <b>{client?.gender}</b>
                                        </p>
                                        <p>
                                            Telefon raqami:{" "}
                                            <b>{Formatter.formatPhoneNumber(client?.phone_number || null)}</b>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                <div
                    className={
                        "w-full border border-primary !rounded-md overflow-hidden mt-4"
                    }
                >
                    {
                        orderItems && orderItems?.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow className={"bg-border"}>
                                        <TableHead className={"text-black"}>
                                            Ovqat nomi va rasmi
                                        </TableHead>
                                        <TableHead className={"text-black"}>Soni</TableHead>
                                        <TableHead className={"text-end text-black"}>Narhi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                {
                                    orderItems?.map((product, index) => (
                                        <TableRow key={index}>
                                            <TableCell
                                                className={"flex gap-2 items-center overflow-hidden"}
                                            >
                                                {product?.product_image ? (
                                                    <img
                                                        src={product?.product_image}
                                                        alt={"product_image"}
                                                        className={
                                                            "w-[48px] h-[48px] rounded-md object-cover"
                                                        }
                                                    />
                                                ) : (
                                                    <DefaultImage/>
                                                )}
                                                <span>{product?.product}</span>
                                            </TableCell>
                                            <TableCell>
                                                {Formatter.with_space(product?.quantity)} ta
                                            </TableCell>
                                            <TableCell className={"text-end"}>
                                                {Formatter.currency(product?.price)} so`m
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </Table>
                        ) : (
                            <div className={"py-2 text-center"}>Mahsulot majud emas</div>
                        )
                    }
                </div>
            </TableCell>
        </TableRow>
    );
}
