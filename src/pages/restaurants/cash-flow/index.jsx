import {Layout} from "@/components/custom/layout.jsx";
import ThemeSwitch from "@/components/theme-switch.jsx";
import {UserNav} from "@/components/user-nav.jsx";
import {Button} from "@/components/custom/button.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {Formatter} from "@/utils/formatter.js";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {useQuery} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import CashFlowService from "@/services/cash-flow.service.js";
import {format} from "date-fns";

const Index = () => {
  const CashFlowData = useQuery({
    queryKey: ['getAllCashFlowData'],
    queryFn: CashFlowService.getAll
  })

  console.log(CashFlowData.data)
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
            <h2 className="text-2xl font-bold tracking-tight">Kirim chiqim</h2>
          </div>
          <div>
            <Button
              onClick={() => navigate("create")}
            >
              Yaratish
            </Button>
          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          {
            !CashFlowData.isLoading ? (
              CashFlowData && CashFlowData.data && CashFlowData.isSuccess && !CashFlowData.isError && (
                <div className="rounded-md border min-h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
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
                        CashFlowData.data.results.length > 0 ? (
                          CashFlowData.data.results.map((restaurant, index) => (
                            <TableRow key={index} className={"bg-secondary"}>
                              <TableCell className={"special-cell"}>
                                <span>{restaurant.restaurant.name}</span>
                              </TableCell>

                              <TableCell className={"special-cell"}>
                                {Formatter.currency(restaurant?.amount)}
                              </TableCell>

                              <TableCell className={"special-cell"}>
                                {
                                  restaurant?.finance_flow_type === "proceeds" ? (
                                    <span className={"bg-green-500 py-1 px-2 rounded-md text-white"}>Kirim</span>
                                  ) : (
                                    <span className={"bg-rose-500 py-1 px-2 rounded-md"}>Chiqim</span>
                                  )
                                }
                              </TableCell>
                              <TableCell className={"special-cell"}>
                                {
                                  restaurant.user.full_name ? restaurant.user.full_name : restaurant.user.phone_number
                                }
                              </TableCell>
                              <TableCell className={"text-end"}>
                                {
                                  format(restaurant?.created_at, 'yyyy-MM-dd')
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
  );
};

export default Index;