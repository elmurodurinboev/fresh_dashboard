import {Layout} from "@/components/custom/layout.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {Button} from "@/components/custom/button.jsx";
import {DotsHorizontalIcon} from "@radix-ui/react-icons";
import {useNavigate, useSearchParams} from "react-router-dom";
import {toast} from "@/hooks/use-toast.js";
import DeleteConfirmationModal from "@/components/custom/delete-confirmation-modal.jsx";
import {useRef, useState} from "react";
import RestaurantService from "@/services/restaurant.service.js";
import DefaultImage from "@/components/custom/default-image.jsx";
import {Formatter} from "@/utils/formatter.js";
import {PaginationControls} from "@/components/custom/pagination-controls.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import SearchBar from "@/components/custom/search-bar.jsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {IconFilter} from "@tabler/icons-react";

const Index = () => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState({})
  const [owner, setOwner] = useState("")
  const [search, setSearch] = useState("")
  const searchRef = useRef()
  const navigate = useNavigate()

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

  const restaurantsData = useQuery({
    queryKey: ['getAllRestaurants', page, page_size, search, owner],
    queryFn: RestaurantService.getAll
  })


  const deleteMutation = useMutation({
    mutationFn: RestaurantService.delete,
    onSuccess: async () => {
      toast({
        variant: 'success',
        title: 'OK',
        description: "Successfully Deleted"
      })
      setDeleteModal(false)
      setSelectedRestaurant({})
      await restaurantsData.refetch()
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: "Error",
        description: error.message || "Messages.error_occurred"
      })
      setDeleteModal(false)
    },
  })

  const handleDelete = (product) => {
    setSelectedRestaurant(product)
    setDeleteModal(true)
  }


  const restaurantOwner = useQuery({
    queryKey: ["getRestaurantOwners"],
    queryFn: RestaurantService.getOwners
  })

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header/>

      <Layout.Body>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Restoranlar</h2>
          </div>
          <div>
            <Button
              onClick={() => navigate("create")}
            >
              Restoran qo`shish
            </Button>
          </div>
        </div>
        <div className={"mb-2 flex items-center justify-between"}>
          <SearchBar
            className={"w-[300px]"}
            ref={searchRef}
            placeholder={"Qidirish"}
            onSearch={(val) => {
              if (Number(page) !== 1) {
                handlePageChange(1)
              }
              setSearch(val)
            }}
          />
          <div>
            {!restaurantOwner.isLoading && restaurantOwner.data && restaurantOwner?.data?.result && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={owner ? "" : "outline"} size={"icon"}>
                    <IconFilter size={18}/>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72" align={"end"}>
                  <div className={"flex flex-col gap-1"}>
                    <span className={"text-sm font-medium text-gray-400"}>Restoran egasi</span>
                    <Select value={owner.toString()} onValueChange={val => {
                      handlePageChange(1)
                      setOwner(val)
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder={"Tanlang"}/>
                      </SelectTrigger>
                      <SelectContent>
                        {
                          restaurantOwner?.data?.result?.results && (
                            restaurantOwner?.data?.result?.results.map((item, index) => (
                              <SelectItem
                                key={index}
                                value={item.id.toString()}
                              >
                                {item.full_name}
                              </SelectItem>
                            ))
                          )
                        }
                      </SelectContent>
                    </Select>
                    <div className={"flex justify-end"}>
                      <Button variant={"destructive"} onClick={() => setOwner("")}>Tozalash</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          {
            !restaurantsData.isLoading ? (
              restaurantsData && restaurantsData.data && restaurantsData.isSuccess && !restaurantsData.isError && (
                <div className="rounded-md border min-h-[600px] flex flex-col justify-between">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          Nomi va rasmi
                        </TableHead>
                        <TableHead>
                          Egasi
                        </TableHead>
                        <TableHead>
                          Balansi
                        </TableHead>
                        <TableHead>
                          Holati
                        </TableHead>
                        <TableHead className={"text-end"}>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        restaurantsData.data.results.length > 0 ? (
                          restaurantsData.data.results.map((restaurant, index) => (
                            <TableRow key={index} className={"bg-secondary"}>
                              <TableCell className={"flex gap-2 items-center overflow-hidden"}>
                                {restaurant.picture ? (
                                  <img
                                    src={restaurant.picture}
                                    alt={"product_image"}
                                    className={"w-[48px] h-[48px] rounded-md object-cover"}
                                  />
                                ) : (
                                  <DefaultImage/>
                                )}
                                <span>{restaurant.name}</span>
                              </TableCell>

                              <TableCell>
                                {
                                  restaurant?.owner?.full_name
                                }
                              </TableCell>

                              <TableCell>
                                {Formatter.currency(restaurant?.balance ? restaurant.balance : 0)}
                              </TableCell>

                              <TableCell>
                                {
                                  restaurant.is_active ? 'Aktiv' : "Aktiv emas"
                                }
                              </TableCell>
                              <TableCell className={"text-end"}>
                                <div className={"w-auto flex justify-end items-center"}>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                                      >
                                        <DotsHorizontalIcon className="h-4 w-4"/>
                                        <span className="sr-only">Open menu</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[160px]">
                                      <DropdownMenuItem
                                        onClick={() => navigate(`update/${restaurant.id}`)}>Edit</DropdownMenuItem>
                                      <DropdownMenuSeparator/>
                                      <DropdownMenuItem
                                        onClick={() => handleDelete(restaurant)}
                                      >
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
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
                    restaurantsData?.data?.count > 10 &&
                    <div
                      className="pagination flex items-center justify-between bg-white px-6 py-[18px] border-t border-gray-300">
                      <PaginationControls
                        total={restaurantsData?.data?.count}
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
                              restaurantsData?.data?.count > 10 && <SelectItem value={"20"}>20</SelectItem>
                            }
                            {
                              restaurantsData?.data?.count > 20 && <SelectItem value={"30"}>30</SelectItem>
                            }
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  }
                </div>
              )
            ) : (
              <Skeleton className={"rounded-md border h-[500px]"}/>
            )
          }
        </div>
        <DeleteConfirmationModal
          open={deleteModal}
          loading={deleteMutation.isPending}
          setOpen={setDeleteModal}
          handleDelete={() => deleteMutation.mutate(selectedRestaurant.id)}
          handleClose={() => {
            setDeleteModal(false)
            setSelectedRestaurant({})
          }}
        />
      </Layout.Body>
    </Layout>
  )
};

export default Index;