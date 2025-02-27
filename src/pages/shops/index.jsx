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
import ShopService from "@/services/shop.service.js";
import DefaultImage from "@/components/custom/default-image.jsx";
import {Formatter} from "@/utils/formatter.js";
import SearchBar from "@/components/custom/search-bar.jsx";
import {PaginationControls} from "@/components/custom/pagination-controls.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";

const Index = () => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState({})


  const navigate = useNavigate()

  const deleteMutation = useMutation({
    mutationFn: ShopService.delete,
    onSuccess: async () => {
      toast({
        title: 'OK',
        description: "Successfully Deleted"
      })
      setDeleteModal(false)
      setSelectedProduct({})
      await shopData.refetch()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Messages.error_occurred"
      })
      setDeleteModal(false)
    },
  })

  const handleDelete = (product) => {
    setSelectedProduct(product)
    setDeleteModal(true)
  }

  // Pagination logic


  const [search, setSearch] = useState("");
  const searchRef = useRef()

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


  const shopData = useQuery({
    queryKey: ['getAllShops', page, page_size, search],
    queryFn: ShopService.getAll
  })
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header/>
      <Layout.Body>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Do`konlar</h2>
          </div>
          <div>
            <Button
              onClick={() => navigate("create")}
            >
              Do`kon qo`shish
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
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          {
            !shopData.isLoading ? (
              shopData && shopData.data && shopData.isSuccess && !shopData.isError && (
                <div className="rounded-md border min-h-[600px] flex flex-col justify-between">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          Do`kon egasi
                        </TableHead>
                        <TableHead>
                          Nomi
                        </TableHead>
                        <TableHead>
                          Telefon raqami
                        </TableHead>
                        <TableHead>
                          Hudud
                        </TableHead>
                        <TableHead className={"text-end"}>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        shopData.data.results.length > 0 ? (
                          shopData.data.results.map((shop, index) => (
                            <TableRow key={index} className={"bg-secondary"}>
                              <TableCell className={"flex gap-2 items-center overflow-hidden"}>
                                {shop.owner.image ? (
                                  <img
                                    src={shop.owner.image}
                                    alt={"product_image"}
                                    className={"w-[48px] h-[48px] rounded-md object-cover"}
                                  />
                                ) : (
                                  <DefaultImage/>
                                )}
                                <div className={"flex flex-col"}>
                                  <span>{shop.owner.full_name}</span>
                                  <span
                                    className={"text-xs text-foreground"}>{shop.owner.phone_number && Formatter.formatPhoneNumber(shop.owner.phone_number)}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {
                                  shop?.name
                                }
                              </TableCell>
                              <TableCell>
                                {
                                  shop?.phone_number
                                }
                              </TableCell>
                              <TableCell>
                                {
                                  shop?.country?.name
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
                                        onClick={() => navigate(`/shops/update/${shop.id}`)}>Edit</DropdownMenuItem>
                                      <DropdownMenuSeparator/>
                                      <DropdownMenuItem
                                        onClick={() => handleDelete(shop)}
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
                              Ma'lumot topilmadi
                            </TableCell>
                          </TableRow>
                        )
                      }

                    </TableBody>
                  </Table>
                  {
                    shopData?.data?.count > 10 &&
                    <div
                      className="pagination flex items-center justify-between bg-white px-6 py-[18px] border-t border-gray-300">
                      <PaginationControls
                        total={shopData?.data?.count}
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
                              shopData?.data?.count > 10 && <SelectItem value={"20"}>20</SelectItem>
                            }
                            {
                              shopData?.data?.count > 20 && <SelectItem value={"30"}>30</SelectItem>
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
          setOpen={setDeleteModal}
          handleDelete={() => deleteMutation.mutate(selectedProduct.id)}
          handleClose={() => {
            setDeleteModal(false)
            setSelectedProduct({})
          }}
        />
      </Layout.Body>
    </Layout>
  )
};

export default Index;