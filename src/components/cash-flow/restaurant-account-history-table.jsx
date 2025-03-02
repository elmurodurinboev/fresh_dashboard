import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {IconCalendar, IconDownload, IconTrash} from "@tabler/icons-react";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {Formatter} from "@/utils/formatter.js";
import {PaginationControls} from "@/components/custom/pagination-controls.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {
  endOfDay,
  format,
  startOfDay,
} from "date-fns";
import {useQuery} from "@tanstack/react-query";
import CashFlowService from "@/services/cash-flow.service.js";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {Button, buttonVariants} from "@/components/ui/button.jsx";
import {cn} from "@/lib/utils.js";
import {Calendar} from "@/components/ui/calendar.jsx";
import RestaurantService from "@/services/restaurant.service.js";

const RestaurantAccountHistoryTable = (
  {
    start_date,
    end_date,
    navigator,
    setEnd_Date,
    setStart_Date
  }) => {
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState("")
  // Pagination logic

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

  const [searchParams] = useSearchParams()

  const [page, setPage] = useState(searchParams.get("page") ?? "1")
  const [page_size, setPageSize] = useState(searchParams.get("per_page") ?? "10")

  const accountHistory = useQuery({
    queryKey: ["getAccountHistory", page, page_size, restaurant, start_date, end_date],
    queryFn: CashFlowService.getAccountsHistory
  })

  const restaurantsData = useQuery({
    queryKey: ["getRestaurants", 1, 250],
    queryFn: RestaurantService.getAll
  })


  return (
    <>
      <div className={"flex justify-between items-center my-3"}>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                type={"button"}
                className={cn(" justify-start text-left font-normal", !start_date && "text-muted-foreground")}
              >
                <IconCalendar className="mr-2 h-4 w-4"/>
                {start_date ? format(new Date(start_date), "PPP") + "-" + format(new Date(end_date), "PPP") :
                  <span>Sana tanlash</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align={"end"} className="w-auto p-0 flex items-center">
              <div className={"flex flex-col p-2 px-4 gap-2"}>
                <button
                  className={cn(buttonVariants({variant: "ghost"}), "bg-neutral-50 dark:bg-secondary dark:text-gray-200 dark:hover:text-primary")}
                  onClick={() => navigator.this_week()}
                >
                  Shu hafta
                </button>
                <button
                  className={cn(buttonVariants({variant: "ghost"}), "bg-neutral-50 dark:bg-secondary dark:text-gray-200 dark:hover:text-primary")}
                  onClick={() => navigator.last_week()}
                >
                  Avvalgi hafta
                </button>
                <button
                  className={cn(buttonVariants({variant: "ghost"}), "bg-neutral-50 dark:bg-secondary dark:text-gray-200 dark:hover:text-primary")}
                  onClick={() => navigator.current_month()}
                >
                  Shu oy
                </button>
                <button
                  className={cn(buttonVariants({variant: "ghost"}), "bg-neutral-50 dark:bg-secondary dark:text-gray-200 dark:hover:text-primary")}
                  onClick={() => navigator.prev_month()}
                >
                  Oldingi oy
                </button>
                <button
                  className={cn(buttonVariants({variant: "ghost"}), "bg-neutral-50 dark:bg-secondary dark:text-gray-200 dark:hover:text-primary")}
                  onClick={() => navigator.this_year()}
                >
                  Shu yil
                </button>
              </div>
              <Calendar
                mode="range"
                captionLayout="dropdown-buttons"
                selected={{
                  from: start_date && new Date(start_date),
                  to: end_date && new Date(end_date)
                }}
                onSelect={(newDate) => {
                  if (!newDate || !newDate.from || !newDate.to) return;

                  setStart_Date(format(startOfDay(newDate.from), "yyyy-MM-dd HH:mm"));
                  setEnd_Date(format(endOfDay(newDate.to), "yyyy-MM-dd HH:mm"));
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className={"flex items-center gap-2"}>
          {restaurantsData.isLoading ? (
            <Skeleton className="w-20 rounded-md"/>
          ) : restaurantsData.isError || !restaurantsData.data?.results || !restaurantsData.isSuccess ? (
            <Skeleton className="w-20 rounded-md"/>
          ) : (
            <Select value={restaurant.toString()} onValueChange={setRestaurant}>
              <SelectTrigger className="w-full text-black">
                <SelectValue placeholder="Restoranni tanlang"/>
              </SelectTrigger>
              <SelectContent>
                {restaurantsData.data.results.map((item, index) => (
                  <SelectItem value={item.id.toString()} key={index}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {
            !!restaurant && (
              <Button variant={"destructive"} size={"sm"} onClick={() => setRestaurant("")}>
                <IconTrash size={18} />
              </Button>
            )
          }
        </div>

      </div>
      {
        !accountHistory.isLoading ? (
          accountHistory && accountHistory.data && accountHistory.isSuccess && !accountHistory.isError && (
            <div className="rounded-md border min-h-[400px] flex flex-col justify-between">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      Restoran
                    </TableHead>
                    <TableHead>
                      Miqdor
                    </TableHead>
                    <TableHead>
                      Yaratilgan sana
                    </TableHead>
                    <TableHead className={"text-end"}>
                      Chek
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    accountHistory.data.results.length > 0 ? (
                      accountHistory.data.results.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {item?.restaurant.name}
                          </TableCell>

                          <TableCell>
                            <div className={"flex items-center"}>
                              UZS {Formatter.currency(item?.amount ? item.amount : 0)}
                              <div className="ml-2 flex items-center">
                                <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                                <span className="text-sm text-green-600">To'langan</span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            {format(item?.created_at, "dd-MM-yyyy HH:MM")}
                          </TableCell>

                          <TableCell className={"text-end"}>
                            <div className={"flex justify-end items-center"}>
                              <a href={item.file} target={"_blank"} className={"p-1.5 hover:text-primary"}>
                                <IconDownload size={16}/>
                              </a>
                            </div>
                          </TableCell>

                        </TableRow>
                      ))

                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-14 text-center text-rose-500 font-medium"
                        >
                          Ma'lumot topilmadi.
                        </TableCell>
                      </TableRow>
                    )
                  }

                </TableBody>
              </Table>
              {
                accountHistory?.data?.count > 10 &&
                <div
                  className="pagination flex items-center justify-between bg-white px-6 py-[18px] border-t border-gray-300">
                  <PaginationControls
                    total={accountHistory?.data?.count}
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
                          accountHistory?.data?.count > 10 && <SelectItem value={"20"}>20</SelectItem>
                        }
                        {
                          accountHistory?.data?.count > 20 && <SelectItem value={"30"}>30</SelectItem>
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
    </>
  )
    ;
};

export default RestaurantAccountHistoryTable;