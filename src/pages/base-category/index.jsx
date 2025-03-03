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
import {useNavigate} from "react-router-dom";
import {toast} from "@/hooks/use-toast.js";
import DeleteConfirmationModal from "@/components/custom/delete-confirmation-modal.jsx";
import {useState} from "react";
import DefaultImage from "@/components/custom/default-image.jsx";
import BaseCategoryService from "@/services/base-category.service.js";

const Index = () => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState({})


  const navigate = useNavigate()

  const deleteMutation = useMutation({
    mutationFn: BaseCategoryService.delete,
    onSuccess: async () => {
      toast({
        title: 'OK',
        variant: 'success',
        description: "Muvaffaqiyatli o'chirildi"
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

  const categoryData = useQuery({
    queryKey: ['getAllBaseCategories'],
    queryFn: BaseCategoryService.getAll
  })


  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header/>

      <Layout.Body>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Umumiy kategoriyalar</h2>
          </div>
          <div>
            <Button
              onClick={() => navigate("create")}
            >
              Qo'shish
            </Button>
          </div>
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
                          Nomi va rasmi
                        </TableHead>
                        <TableHead className={"text-end"}>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        categoryData.data.result && categoryData.data.result.length > 0 ? (
                          categoryData.data.result.map((category, index) => (
                            <TableRow key={index} className={"bg-secondary"}>
                              <TableCell className={"flex gap-2 items-center overflow-hidden"}>
                                {category.image ? (
                                  <img
                                    src={category.image}
                                    alt={"product_image"}
                                    className={"w-[48px] h-[48px] rounded-md object-cover"}
                                  />
                                ) : (
                                  <DefaultImage/>
                                )}
                                <span>{category.name}</span>
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
                                        onClick={() => navigate(`/base-category/update/${category.id}`)}>Edit</DropdownMenuItem>
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
                              No result.
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