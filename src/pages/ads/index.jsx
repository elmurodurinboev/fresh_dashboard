import {Layout} from "@/components/custom/layout.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {Button} from "@/components/custom/button.jsx";
import {DotsHorizontalIcon} from "@radix-ui/react-icons";
import {useNavigate} from "react-router-dom";
import DefaultImage from "@/components/custom/default-image.jsx";
import AdsService from "@/services/ads.service.js";
import DeleteConfirmationModal from "@/components/custom/delete-confirmation-modal.jsx";
import {useState} from "react";
import {toast} from "@/hooks/use-toast.js";

const Index = () => {

  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedAds, setSelectedAds] = useState({})
  const adsData = useQuery({
    queryKey: ['getAllAds'],
    queryFn: AdsService.getAll
  })

  const deleteMutation = useMutation({
    mutationFn: AdsService.delete,
    onSuccess: async () => {
      toast({
        variant: 'success',
        title: 'OK',
        description: "Muvaffaqiyatli o`chirildi"
      })
      setDeleteModal(false)
      setSelectedAds({})
      await adsData.refetch()
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

  const navigate = useNavigate()


  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header/>

      <Layout.Body>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Reklamalar</h2>
          </div>
          <div>
            <Button
              onClick={() => navigate("create")}
            >
              Reklama qo`shish
            </Button>
          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          {
            !adsData.isLoading ? (
              adsData && adsData.data && adsData.isSuccess && !adsData.isError && (
                <div className="rounded-md border min-h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          Reklama rasmi
                        </TableHead>
                        <TableHead className={"text-end"}>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        adsData.data.results.length > 0 ? (
                          adsData.data.results.map((ads, index) => (
                            <TableRow key={index} className={"bg-secondary"}>
                              <TableCell className={"flex gap-2 items-center overflow-hidden"}>
                                {ads.image ? (
                                  <img
                                    src={ads.image}
                                    alt={"product_image"}
                                    className={"w-[48px] h-[48px] rounded-md object-cover"}
                                  />
                                ) : (
                                  <DefaultImage/>
                                )}
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
                                      <DropdownMenuItem onClick={() => navigate(`update/${ads.id}`)}>Edit</DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => {
                                        setSelectedAds(ads);
                                        setDeleteModal(true)
                                      }}>Delete</DropdownMenuItem>
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
          loading={deleteMutation.isPending}
          setOpen={setDeleteModal}
          handleDelete={() => deleteMutation.mutate(selectedAds.id)}
          handleClose={() => {
            setDeleteModal(false)
            setSelectedAds({})
          }}
        />
      </Layout.Body>
    </Layout>
  )
};

export default Index;