import {Layout} from "@/components/custom/layout.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {useQuery} from "@tanstack/react-query";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useState} from "react";
import {PaginationControls} from "@/components/custom/pagination-controls.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import CourierService from "@/services/courier.service.js";
import {Formatter} from "@/utils/formatter.js";
import {cn} from "@/lib/utils.js";
import {format} from "date-fns";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";
import CourierBalanceSheet from "@/components/custom/courier-balance-sheet.jsx";

const Index = () => {

  const navigate = useNavigate()
  // Pagination logic
  const [searchParams] = useSearchParams()
  const [page, setPage] = useState(searchParams.get("page") ?? "1")
  const [page_size, setPageSize] = useState(searchParams.get("per_page") ?? "10")

  const handlePageChange = (number) => {
    const params = new URLSearchParams()
    setPage(number)
    setPageSize(page_size)
    params.append("page", number)
    if (searchParams.get("page_size")) params.append("page_size", page_size)
    navigate(`${location.pathname}?${params.toString()}`)
  }

  const handlePageSizeChange = (page_size) => {
    const params = new URLSearchParams()
    setPageSize(page_size)
    setPage(1)
    params.append("page_size", page_size)
    params.append("page", 1)
    navigate(`${location.pathname}?${params.toString()}`)
  }
  const couriersData = useQuery({
    queryKey: ['getAllCourierTransactions', page, page_size],
    queryFn: CourierService.getTransactions
  })


  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header/>

      <Layout.Body>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Kuryer balans tranzaksiyalari</h2>
          </div>
          <CourierBalanceSheet />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          {
            !couriersData.isLoading ? (
              couriersData && couriersData.data && couriersData.isSuccess && !couriersData.isError && (
                <div className="rounded-md border min-h-[400px] flex flex-col justify-between">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          Kuryer raqami
                        </TableHead>
                        <TableHead>
                          Hozirgi balansi
                        </TableHead>
                        <TableHead>
                          TR Miqdori
                        </TableHead>
                        <TableHead>
                          Sharh
                        </TableHead>
                        <TableHead className={"text-end"}>
                          Yaratilgan vaqti
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        couriersData.data.results.length > 0 ? (
                          couriersData.data.results.map((item, index) => (
                            <TableRow key={index} className={"bg-secondary"}>
                              <TableCell className={"flex gap-2 items-center overflow-hidden"}>
                                {item?.courier?.bag_number}
                              </TableCell>
                              <TableCell>
                                {
                                  item?.courier?.balance && Formatter.currency(item.courier.balance)
                                }
                              </TableCell>
                              <TableCell
                                className={cn("flex items-center font-medium", item?.transaction_type === 'plus' ? "text-green-600" : "text-red-600")}>
                                {
                                  item?.transaction_type === 'plus' ? "+" : '-'
                                }

                                <span>
                                  {
                                    item?.amount && Formatter.currency(item.amount)
                                  }
                                </span>

                              </TableCell>
                              <TableCell className={"text-end"}>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger className={"line-clamp-1"}>
                                      {
                                        item.description
                                      }
                                    </TooltipTrigger>
                                    <TooltipContent className={"p-3 bg-secondary"}>
                                      <p className={"text-black text-sm"}>{
                                        item.description
                                      }</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>

                              <TableCell className={"text-end"}>
                                {
                                  format(item?.created_at, 'yyyy-MM-dd HH:MM')
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
                  {
                    couriersData?.data?.count > 10 &&
                    <div
                      className="pagination flex items-center justify-between bg-white px-6 py-[18px] border-t border-gray-300">
                      <PaginationControls
                        total={couriersData?.data?.count}
                        current_page={Number(page)}
                        page_size={Number(page_size)}
                        onPageChange={handlePageChange}
                      />
                      <div>
                        <Select value={page_size}
                                onValueChange={handlePageSizeChange}>
                          <SelectTrigger>
                            <SelectValue/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={"10"}>10</SelectItem>
                            {
                              couriersData?.data?.count > 10 && <SelectItem value={"20"}>20</SelectItem>
                            }
                            {
                              couriersData?.data?.count > 20 && <SelectItem value={"30"}>30</SelectItem>
                            }
                            {
                              couriersData?.data?.count > 30 && <SelectItem value={"40"}>40</SelectItem>
                            }
                            {
                              couriersData?.data?.count > 40 && <SelectItem value={"50"}>50</SelectItem>
                            }
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  }
                </div>
              )
            ) : (
              <Skeleton className={"rounded-md border h-[400px]"}/>
            )
          }
        </div>
      </Layout.Body>
    </Layout>
  )
};

export default Index;