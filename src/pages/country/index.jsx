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
import CountryService from "@/services/country.service.js";

const Index = () => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedcountry, setSelectedcountry] = useState({})


  const navigate = useNavigate()

  const deleteMutation = useMutation({
    mutationFn: CountryService.delete,
    onSuccess: async () => {
      toast({
        title: 'OK',
        variant: 'success',
        description: "Muvaffaqiyatli o'chirildi"
      })
      setDeleteModal(false)
      setSelectedcountry({})
      await countryData.refetch()
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
    setSelectedcountry(product)
    setDeleteModal(true)
  }

  const countryData = useQuery({
    queryKey: ['getAllCountry'],
    queryFn: CountryService.getAll
  })


  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header/>

      <Layout.Body>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Hududlar</h2>
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
            !countryData.isLoading ? (
              countryData && countryData.data && countryData.isSuccess && !countryData.isError && countryData.data && (
                <div className="rounded-md border min-h-[600px] flex flex-col justify-between">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          Hudud nomi
                        </TableHead>
                        <TableHead className={"text-end"}>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        countryData.data.result && countryData.data.result.length > 0 ? (
                          countryData.data.result.map((country, index) => (
                            <TableRow key={index} className={"bg-secondary"}>
                              <TableCell>
                                {country.name}
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
                                        onClick={() => navigate(`/country/update/${country.id}`)}>Edit</DropdownMenuItem>
                                      <DropdownMenuSeparator/>
                                      <DropdownMenuItem
                                        onClick={() => handleDelete(country)}
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
          handleDelete={() => deleteMutation.mutate(selectedcountry.id)}
          handleClose={() => {
            setDeleteModal(false)
            setSelectedcountry({})
          }}
        />
      </Layout.Body>
    </Layout>
  )
};

export default Index;