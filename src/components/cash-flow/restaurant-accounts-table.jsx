import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {Formatter} from "@/utils/formatter.js";
import {Skeleton} from "@/components/ui/skeleton.jsx";

const RestaurantAccountsTable = ({accountsData}) => {
  return (
    <div className="rounded-md border min-h-[500px] flex flex-col justify-between my-3">
      <Table>
        <TableHeader>
          <TableRow className={"bg-secondary"}>
            <TableHead>
              Restoran nomi
            </TableHead>
            <TableHead>
              Balans
            </TableHead>
            <TableHead className={"text-end"}>
              Hisob raqam
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            !accountsData.isLoading ? (
              accountsData.data && accountsData.isSuccess && accountsData.data.length > 0 ? (
                accountsData?.data?.map((restaurant, index) => (
                  <TableRow key={index}>
                    <TableCell className={"flex gap-2 items-center overflow-hidden"}>
                      {restaurant?.restaurant_name}
                    </TableCell>
                    <TableCell className={"font-medium"}>
                      {Formatter.currency(restaurant?.restaurant_balance ? restaurant?.restaurant_balance : 0)}
                    </TableCell>

                    <TableCell className={"font-medium text-end"}>
                      {Formatter.currency(restaurant?.restaurant_fee ? restaurant?.restaurant_fee : 0)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-14 text-center text-rose-500 font-medium"
                  >
                    Ma'lumot topilmadi.
                  </TableCell>
                </TableRow>
              )
            ) : (
              <TableRow>
                <TableCell colSpan={3}>
                  <Skeleton className={"rounded-md border h-10"}/>
                </TableCell>
              </TableRow>
            )
          }
        </TableBody>
      </Table>
    </div>
  );
};

export default RestaurantAccountsTable;