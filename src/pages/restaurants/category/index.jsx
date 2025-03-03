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
import RestaurantCategoryService from "@/services/restaurant-category.service.js";
import SearchBar from "@/components/custom/search-bar.jsx";
import {PaginationControls} from "@/components/custom/pagination-controls.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";

const Index = () => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState({})


  const navigate = useNavigate()

  const deleteMutation = useMutation({
    mutationFn: RestaurantCategoryService.delete,
    onSuccess: async () => {
      toast({
        title: 'OK',
        description: "Successfully Deleted"
      })
      setDeleteModal(false)
      setSelectedCategory({})
      await categoryData.refetch()
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Messages.error_occurred"
      })
      setDeleteModal(false)
    },
  })

  const handleDelete = (product) => {
    setSelectedCategory(product)
    setDeleteModal(true)
  }

  // Pagination

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


  const categoryData = useQuery({
    queryKey: ['getAllCategories', page, page_size, search],
    queryFn: RestaurantCategoryService.getAll
  })


  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header/>

      <Layout.Body>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Kategoriyalar</h2>
          </div>
          <div>
            <Button
              onClick={() => navigate("create")}
            >
              Kategoriya qo`shish
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
            !categoryData.isLoading ? (
              categoryData && categoryData.data && categoryData.isSuccess && !categoryData.isError && categoryData.data && (
                <div className="rounded-md border min-h-[600px] flex flex-col justify-between">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          Nomi
                        </TableHead>
                        <TableHead>
                          Restoran
                        </TableHead>
                        <TableHead className={"text-end"}>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        categoryData.data.results && categoryData.data.results.length > 0 ? (
                          categoryData.data.results.map((category, index) => (
                            <TableRow key={index} className={"bg-secondary"}>
                              <TableCell className={"flex gap-2 items-center overflow-hidden"}>
                                {category.name}
                              </TableCell>

                              <TableCell>
                                {
                                  category?.restaurant_name
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
                                        onClick={() => navigate(`/restaurant-category/update/${category.id}`)}>Edit</DropdownMenuItem>
                                      <DropdownMenuSeparator/>
                                      <DropdownMenuItem
                                        onClick={() => handleDelete(category)}
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
                    categoryData?.data?.count > 10 &&
                    <div
                      className="pagination flex items-center justify-between bg-white px-6 py-[18px] border-t border-gray-300">
                      <PaginationControls
                        total={categoryData?.data?.count}
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
                              categoryData?.data?.count > 10 && <SelectItem value={"20"}>20</SelectItem>
                            }
                            {
                              categoryData?.data?.count > 20 && <SelectItem value={"30"}>30</SelectItem>
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
          handleDelete={() => deleteMutation.mutate(selectedCategory.id)}
          handleClose={() => {
            setDeleteModal(false)
            setSelectedCategory({})
          }}
        />
      </Layout.Body>
    </Layout>
  )
};

export default Index;