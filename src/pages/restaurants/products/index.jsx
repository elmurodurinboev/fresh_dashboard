import {Layout} from "@/components/custom/layout.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import RestaurantProductService from "@/services/restaurant-product.service.js";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import DefaultImage from "@/components/custom/default-image.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {Button} from "@/components/custom/button.jsx";
import {DotsHorizontalIcon} from "@radix-ui/react-icons";
import {Formatter} from "@/utils/formatter.js";
import {useNavigate, useSearchParams} from "react-router-dom";
import {toast} from "@/hooks/use-toast.js";
import DeleteConfirmationModal from "@/components/custom/delete-confirmation-modal.jsx";
import {useRef, useState} from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {IconInfoCircle} from "@tabler/icons-react"
import {PaginationControls} from "@/components/custom/pagination-controls.jsx";
import SearchBar from "@/components/custom/search-bar.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {useAuth} from "@/hooks/utils/useAuth.js";
import ROLES from "@/data/roles.js";

const Index = () => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState({})
  const searchRef = useRef()
  const [search, setSearch] = useState("")

  const navigate = useNavigate()

  const reset = () => {
    setDeleteModal(false)
    setSelectedProduct({})
  }

  const handlePageChange = (number) => {
    const params = new URLSearchParams()
    setPage(number)
    params.append("page", number)
    if (searchParams.get("page_size")) params.append("page_size", page_size)
    navigate(`${location.pathname}?${params.toString()}`)
  }

  const {session: {user}} = useAuth()

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

  const productsData = useQuery({
    queryKey: ['getAllProducts', page, page_size, search],
    queryFn: RestaurantProductService.getProducts
  })

  const deleteMutation = useMutation({
    mutationFn: RestaurantProductService.delete,
    onSuccess: async () => {
      toast({
        title: 'OK',
        description: "Muvaffaqiyatli o'zgartirildi"
      })
      await productsData.refetch()
      reset()
    },
    onError: (error) => {
      toast({
        title: "Error",
        variant: "success",
        description: error.message || "Messages.error_occurred"
      })
      reset()
    },
  })

  const handleDelete = (product) => {
    setSelectedProduct(product)
    setDeleteModal(true)
  }

  const approvedMutation = useMutation({
    mutationFn: RestaurantProductService.updatePatch,
    onSuccess: async () => {
      toast({
        title: 'OK',
        variant: "success",
        description: "Muvaffaqiyatli o'zgartirildi"
      })
      await productsData.refetch()
      reset()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Xatolik yuz berdi!"
      })
      reset()
    },
  })

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header/>

      <Layout.Body>
        <div className="mb-2 flex flex-col md:flex-row items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Mahsulotlar</h2>
          </div>
          <div className={"space-x-3"}>
            <Button
              onClick={() => navigate("create")}
            >
              Mahsulot qo`shish
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

          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          {
            !productsData.isLoading ? (
              productsData && productsData.data && productsData.isSuccess && !productsData.isError && productsData.data.result && (
                <div className="rounded-md border min-h-[600px] flex flex-col justify-between">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          Rasm va nomi
                        </TableHead>
                        <TableHead>
                          Kategoriyasi
                        </TableHead>
                        <TableHead>
                          Soni
                        </TableHead>
                        <TableHead>
                          Narhi
                        </TableHead>
                        <TableHead>
                          Chegirmasi
                        </TableHead>
                        <TableHead>
                          Aktivligi
                        </TableHead>
                        <TableHead>
                          Ulush
                        </TableHead>
                        <TableHead className={"text-end"}>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        productsData.data.result.results && productsData.data.result.results.length > 0 ? (
                          productsData.data.result.results.map((product, index) => (
                            <TableRow key={index}
                                      className={product.isApproved ? "bg-secondary" : "bg-orange-100 hover:bg-orange-200"}>
                              <TableCell className={"flex gap-2 items-center overflow-hidden"}>
                                {product.picture ? (
                                  <img
                                    src={product.picture}
                                    alt={"product_image"}
                                    className={"w-[48px] h-[48px] rounded-md object-cover"}
                                  />
                                ) : (
                                  <DefaultImage/>
                                )}
                                <span>{product.name}</span>
                              </TableCell>

                              <TableCell>
                                {
                                  product?.category_name
                                }
                              </TableCell>

                              <TableCell>
                                {
                                  product?.stock_level
                                }
                              </TableCell>

                              <TableCell>
                                {
                                  Formatter.currency(product?.price)
                                }
                              </TableCell>

                              <TableCell>
                                {
                                  Formatter.currency(product?.discount_price)
                                }
                              </TableCell>
                              <TableCell>
                                {
                                  product.is_active ? "Aktiv" : 'Aktiv emas'
                                }
                              </TableCell>

                              <TableCell>
                                {
                                  product.contribution_type === 'percent' ? (
                                    product?.contribution_amount + "%"
                                  ) : (Formatter.currency(product?.contribution_amount))
                                }
                              </TableCell>

                              <TableCell className={"text-end"}>
                                <div className={"w-auto flex justify-end gap-4 items-center"}>
                                  {
                                    !product.isApproved && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger>
                                            <IconInfoCircle/>
                                          </TooltipTrigger>
                                          <TooltipContent className={"p-3 bg-secondary"}>
                                            <p className={"text-black text-sm"}>Qo`shilgan mahsulotlar Fresh jamoasi
                                              tomonidan tasdiqlanadi!</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )
                                  }
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
                                        onClick={() => navigate(`update/${product.id}`)}>Edit</DropdownMenuItem>
                                      {
                                        user && user?.user_role === ROLES.ADMIN && !product?.isApproved && (
                                          <DropdownMenuItem
                                            onClick={() => approvedMutation.mutate({
                                              id: product.id,
                                              formData: {isApproved: true}
                                            })}>
                                            Tasdiqlash
                                          </DropdownMenuItem>
                                        )
                                      }
                                      <DropdownMenuSeparator/>
                                      <DropdownMenuItem
                                        onClick={() => handleDelete(product)}
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
                              colSpan={8}
                              className="h-12 text-center text-rose-500 font-medium"
                            >
                              Ma'lumot topilmadi
                            </TableCell>
                          </TableRow>
                        )
                      }

                    </TableBody>
                  </Table>
                  {
                    productsData?.data?.result?.count > 10 &&
                    <div
                      className="pagination flex items-center justify-between bg-white px-6 py-[18px] border-t border-gray-300">
                      <PaginationControls
                        total={productsData?.data?.result?.count}
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
                              productsData?.data?.result?.count > 10 && <SelectItem value={"20"}>20</SelectItem>
                            }
                            {
                              productsData?.data?.result?.count > 20 && <SelectItem value={"30"}>30</SelectItem>
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