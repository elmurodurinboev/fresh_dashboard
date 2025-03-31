import {Layout} from "@/components/custom/layout.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {Button} from "@/components/custom/button.jsx";
import {DotsHorizontalIcon} from "@radix-ui/react-icons";
import {useNavigate, useSearchParams} from "react-router-dom";
import DefaultImage from "@/components/custom/default-image.jsx";
import UserService from "@/services/user.service.js";
import {useEffect, useRef, useState} from "react";
import {PaginationControls} from "@/components/custom/pagination-controls.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {toast} from "@/hooks/use-toast.js";
import DeleteConfirmationModal from "@/components/custom/delete-confirmation-modal.jsx";
import SearchBar from "@/components/custom/search-bar.jsx";
import {useAuth} from "@/hooks/utils/useAuth.js";
import CourierService from "@/services/courier.service.js";
import CouriersMap from "@/components/custom/couriers-map.jsx";
import {Formatter} from "@/utils/formatter.js";

const Index = () => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState({})
  const [couriers, setCouriers] = useState([])


  // Socket logic
  const {session} = useAuth()
  const socketRef = useRef(null);

  useEffect(() => {
    const token = session?.tokens?.access; // Get token from localStorage or cookie

    socketRef.current = new WebSocket(import.meta.env.VITE_SOCKET_URL);

    socketRef.current.onopen = () => {
      console.log("✅ WebSocket connected");

      // Send authentication message after connection
      const authMessage = {
        type: "auth",
        token: token,
      };

      socketRef.current.send(JSON.stringify(authMessage));
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        return toast({
          title: "Error",
          variant: "destructive",
          description: data.error || "Something went wrong"
        })
      }
      if (data.message) {
        return console.log(data.message)
      }
      setCouriers(data.couriers)
    };

    socketRef.current.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    socketRef.current.onclose = () => {
      console.log("🔴 WebSocket disconnected");
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  const navigate = useNavigate()


  const reset = () => {
    setDeleteModal(false)
    setSelectedProduct({})
  }

  const deleteMutation = useMutation({
    mutationFn: UserService.delete,
    onSuccess: async () => {
      toast({
        title: 'OK',
        description: "Successfully deleted"
      })
      await couriersData.refetch()
      reset()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Messages.error_occurred"
      })
      reset()
    },
  })

  const handleDelete = (user) => {
    setSelectedProduct(user)
    setDeleteModal(true)
  }

  // Pagination logic
  const searchRef = useRef()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState("")
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
    queryKey: ['getAllCourier', page, page_size, search],
    queryFn: CourierService.getAll
  })

  const allCouriersData = useQuery({
    queryKey: ['getAllCourierNoPagination', 1, 250],
    queryFn: CourierService.getAll,
    enabled: couriers.length > 0
  })

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header/>

      <Layout.Body>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Kuryerlar</h2>
          </div>
          <Button onClick={() => navigate("create")}>
            Qo'shish
          </Button>
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
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          {
            !couriersData.isLoading ? (
              couriersData && couriersData.data && couriersData.isSuccess && !couriersData.isError && (
                <div className="rounded-md border min-h-[600px] flex flex-col justify-between">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          Ismi va rasmi
                        </TableHead>
                        <TableHead>
                          Telefon raqami
                        </TableHead>
                        <TableHead>
                          Transport raqami
                        </TableHead>
                        <TableHead>
                          Sumka raqami
                        </TableHead>
                        <TableHead>
                          Balansi
                        </TableHead>
                        <TableHead className={"text-end"}>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        couriersData.data.results.length > 0 ? (
                          couriersData.data.results.map((user, index) => (
                            <TableRow key={index} className={"bg-secondary"}>
                              <TableCell className={"flex gap-2 items-center overflow-hidden"}>
                                {user?.image ? (
                                  <img
                                    src={user.image}
                                    alt={"product_image"}
                                    className={"w-[48px] h-[48px] rounded-md object-cover"}
                                  />
                                ) : (
                                  <DefaultImage/>
                                )}
                                <span>{user?.full_name ? user.full_name : "Nomalum"}</span>
                              </TableCell>

                              <TableCell>
                                {
                                  user?.phone_number && Formatter.formatPhoneNumber(user.phone_number)
                                }
                              </TableCell>
                              <TableCell className={"uppercase"}>
                                {
                                  user?.car_number
                                }
                              </TableCell>
                              <TableCell>
                                {
                                  user?.bag_number
                                }
                              </TableCell>
                              <TableCell>
                                {
                                  user?.balance && Formatter.currency(user.balance)
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
                                        onClick={() => navigate(`update/${user.id}`)}>Edit</DropdownMenuItem>
                                      <DropdownMenuSeparator/>
                                      <DropdownMenuItem
                                        onClick={() => handleDelete(user)}
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
              <Skeleton className={"rounded-md border h-[500px]"}/>
            )
          }
        </div>
        <div className={"mt-4 flex-1 w-full overflow-auto z-10"}>
          {
            !allCouriersData.isLoading && allCouriersData && allCouriersData.data && allCouriersData.isSuccess && !allCouriersData.isError && allCouriersData.data.results.length > 0 && (
              <CouriersMap couriersLocations={couriers} couriersData={allCouriersData.data.results}/>
            )
          }
        </div>
      </Layout.Body>
      <DeleteConfirmationModal
        open={deleteModal}
        setOpen={setDeleteModal}
        loading={deleteMutation.isPending}
        handleDelete={() => deleteMutation.mutate(selectedProduct.id)}
        handleClose={() => {
          setDeleteModal(false)
          setSelectedProduct({})
        }}
      />
    </Layout>
  )
};

export default Index;