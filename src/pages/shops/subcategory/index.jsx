import {Layout} from "@/components/custom/layout.jsx";
import ThemeSwitch from "@/components/theme-switch.jsx";
import {UserNav} from "@/components/user-nav.jsx";
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
import {useNavigate} from "react-router-dom";
import {toast} from "@/hooks/use-toast.js";
import DeleteConfirmationModal from "@/components/custom/delete-confirmation-modal.jsx";
import {useState} from "react";
import {format} from "date-fns";
import SubcategoryService from "@/services/subcategory.service.js";

const Index = () => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState({})
  const categoryData = useQuery({
    queryKey: ['getAllCategories'],
    queryFn: SubcategoryService.getAllSub
  })


  const navigate = useNavigate()

  const deleteMutation = useMutation({
    mutationFn: SubcategoryService.delete,
    onSuccess: async () => {
      toast({
        variant: "success",
        title: 'OK',
        description: "Successfully Deleted"
      })
      setDeleteModal(false)
      setSelectedCategory({})
      await categoryData.refetch()
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
    setSelectedCategory(product)
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
            <h2 className="text-2xl font-bold tracking-tight">Sub Kategoriyalar</h2>
          </div>
          <div>
            <Button
              onClick={() => navigate("create")}
            >
              Sub kategoriya qo`shish
            </Button>
          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          {
            !categoryData.isLoading ? (
              categoryData && categoryData.data && categoryData.isSuccess && !categoryData.isError && (
                <div className="rounded-md border min-h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          Nomi
                        </TableHead>
                        <TableHead>
                          Yaratilgan sana
                        </TableHead>
                        <TableHead className={"text-end"}>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        categoryData.data.result.length > 0 ? (
                          categoryData.data.result.map((category, index) => (
                            <TableRow key={index} className={"bg-secondary"}>
                              <TableCell>
                                {category.name}
                              </TableCell>

                              <TableCell>
                                {
                                  format(category?.created_at, 'yyyy-MM-dd')
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
                                      <DropdownMenuItem onClick={() => navigate(`/subcategory/update/${category.id}`)}>Edit</DropdownMenuItem>
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
                </div>
              )
            ) : (
              <Skeleton className={"rounded-md border h-[500px]"}/>
            )
          }
        </div>
        <DeleteConfirmationModal
          loading={deleteMutation.isPending}
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