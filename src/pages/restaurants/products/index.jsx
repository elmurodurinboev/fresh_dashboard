import {Layout} from "@/components/custom/layout.jsx";
import ThemeSwitch from "@/components/theme-switch.jsx";
import {UserNav} from "@/components/user-nav.jsx";
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
import {useNavigate} from "react-router-dom";
import {toast} from "@/hooks/use-toast.js";
import DeleteConfirmationModal from "@/components/custom/delete-confirmation-modal.jsx";
import {useState} from "react";

const Index = () => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState({})
  const productsData = useQuery({
    queryKey: ['getAllProducts'],
    queryFn: RestaurantProductService.getProducts
  })

  const navigate = useNavigate()

  const reset = () => {
    setDeleteModal(false)
    setSelectedProduct({})
  }

  const deleteMutation = useMutation({
    mutationFn: RestaurantProductService.delete,
    onSuccess: async () => {
      toast({
        title: 'OK',
        description: "Successfully delted"
      })
      await productsData.refetch()
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

  const handleDelete = (product) => {
    setSelectedProduct(product)
    setDeleteModal(true)
  }

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
            <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          </div>
          <div>
            <Button
              onClick={() => navigate("create")}
            >
              Add product
            </Button>
          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          {
            !productsData.isLoading ? (
              productsData && productsData.data && productsData.isSuccess && !productsData.isError && productsData.data.result &&  (
                <div className="rounded-md border min-h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          Image and name
                        </TableHead>
                        <TableHead>
                          Category
                        </TableHead>
                        <TableHead>
                          Stock level
                        </TableHead>
                        <TableHead>
                          Price
                        </TableHead>
                        <TableHead>
                          Discount price
                        </TableHead>
                        <TableHead>
                          Aktivligi
                        </TableHead>
                        <TableHead className={"text-end"}>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        productsData.data.result.results && productsData.data.result.results.length > 0 ? (
                          productsData.data.result.results.map((product, index) => (
                            <TableRow key={index} className={"bg-secondary"}>
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
                                  product?.category
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
                                      <DropdownMenuItem onClick={() => navigate(`update/${product.id}`)}>Edit</DropdownMenuItem>
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