import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {Formatter} from "@/utils/formatter.js";
import {format} from "date-fns";
import {Skeleton} from "@/components/ui/skeleton.jsx";

const RestaurantBalanceTable = ({cashFlowData}) => {
  return (
    <div className="flex-1 overflow-auto py-3">
      {
        !cashFlowData.isLoading ? (
          cashFlowData && cashFlowData.data && cashFlowData.isSuccess && !cashFlowData.isError && (
            <div className="rounded-md border min-h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow className={"bg-secondary"}>
                    <TableHead>
                      Restoran nomi
                    </TableHead>
                    <TableHead>
                      Miqdori
                    </TableHead>
                    <TableHead>
                      Turi
                    </TableHead>
                    <TableHead>
                      Bajaruvchi
                    </TableHead>
                    <TableHead className={"text-end"}>
                      Yaratilgan sana
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    cashFlowData.data.results.length > 0 ? (
                      cashFlowData.data.results.map((restaurant, index) => (
                        <TableRow key={index}>
                          <TableCell className={"special-cell"}>
                            <span>{restaurant.restaurant.name}</span>
                          </TableCell>

                          <TableCell className={"special-cell"}>
                            {Formatter.currency(restaurant?.amount)}
                          </TableCell>

                          <TableCell className={"special-cell"}>
                            {
                              restaurant?.finance_flow_type === "proceeds" ? (
                                <span className={"bg-green-500 py-1 px-2 rounded-md text-white"}>To`ldirish</span>
                              ) : (
                                <span className={"bg-rose-500 py-1 px-2 rounded-md text-white"}>Naqd pul qilish</span>
                              )
                            }
                          </TableCell>
                          <TableCell className={"special-cell"}>
                            {
                              restaurant.user.full_name ? restaurant.user.full_name : Formatter.formatPhoneNumber(restaurant.user.phone_number)
                            }
                          </TableCell>
                          <TableCell className={"text-end"}>
                            {
                              format(restaurant?.created_at, 'yyyy-MM-dd HH:MM')
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
  );
};

export default RestaurantBalanceTable;