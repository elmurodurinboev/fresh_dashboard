import {Layout} from "@/components/custom/layout.jsx";
import ThemeSwitch from "@/components/theme-switch.jsx";
import {UserNav} from "@/components/user-nav.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {useQuery} from "@tanstack/react-query";
import ProductService from "@/services/product.service.js";
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

const Index = () => {

  const productsData = useQuery({
    queryKey: ['getAllProducts'],
    queryFn: ProductService.getProducts
  })

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
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          {
            !productsData.isLoading ? (
              productsData && productsData.data && productsData.isSuccess && !productsData.isError && (
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
                          Count
                        </TableHead>
                        <TableHead>
                          Price
                        </TableHead>
                        <TableHead>
                          Discount price
                        </TableHead>
                        <TableHead className={"text-end"}>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        productsData.data.data.length > 0 ? (
                          productsData.data.data.map((product, index) => (
                            <TableRow key={index} className={"bg-secondary border border-foreground"}>
                              <TableCell className={"flex gap-2 items-center overflow-hidden"}>
                                {product.image ? (
                                  <img
                                    src={product.image}
                                    alt={"product_image"}
                                    className={"max-w-[48px] max-h-[48px] rounded-md"}
                                  />
                                ) : (
                                  <DefaultImage/>
                                )}
                                <span>{product.name}</span>
                              </TableCell>

                              <TableCell>
                                {
                                  product?.subcategory.name
                                }
                              </TableCell>

                              <TableCell>
                                {
                                  product?.count
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

                              <TableCell className={"text-end"}>
                                <div className={"w-auto flex justify-end items-center"}>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                                      >
                                        <DotsHorizontalIcon className="h-4 w-4" />
                                        <span className="sr-only">Open menu</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[160px]">
                                      <DropdownMenuItem>Edit</DropdownMenuItem>
                                      <DropdownMenuItem>Favorite</DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem>
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
                              className="h-24 text-center"
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
  )
};

export default Index;