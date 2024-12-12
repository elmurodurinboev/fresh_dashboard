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
import ShopService from "@/services/restaurant.service.js";
import RestaurantService from "@/services/restaurant.service.js";
import DefaultImage from "@/components/custom/default-image.jsx";

const Index = () => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState({})
  const restaurantsData = useQuery({
    queryKey: ['getAllRestaurants'],
    queryFn: RestaurantService.getAll
  })


  const navigate = useNavigate()

  const deleteMutation = useMutation({
    mutationFn: ShopService.delete,
    onSuccess: async () => {
      toast({
        title: 'OK',
        description: "Successfully Deleted"
      })
      setDeleteModal(false)
      setSelectedRestaurant({})
      await restaurantsData.refetch()
    },
    onError: (error) => {
      toast({
        variant: 'success',
        title: "Error",
        description: error.message || "Messages.error_occurred"
      })
      setDeleteModal(false)
    },
  })

  const handleDelete = (product) => {
    setSelectedRestaurant(product)
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
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          {
            !restaurantsData.isLoading ? (
              restaurantsData && restaurantsData.data && restaurantsData.isSuccess && !restaurantsData.isError && (
                <div className="rounded-md border min-h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          Nomi va rasmi
                        </TableHead>
                        <TableHead>
                          Holati
                        </TableHead>
                        <TableHead className={"text-end"}>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        restaurantsData.data.result.length > 0 ? (
                          restaurantsData.data.result.map((restaurant, index) => (
                            <TableRow key={index} className={"bg-secondary"}>
                              <TableCell className={"flex gap-2 items-center overflow-hidden"}>
                                {restaurant.image ? (
                                  <img
                                    src={restaurant.image}
                                    alt={"product_image"}
                                    className={"w-[48px] h-[48px] rounded-md object-cover"}
                                  />
                                ) : (
                                  <DefaultImage/>
                                )}
                                <span>{restaurant.name}</span>
                              </TableCell>

                              <TableCell>
                                {
                                  restaurant.is_active
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
                                      <DropdownMenuItem onClick={() => navigate(`/shops/update/${restaurant.id}`)}>Edit</DropdownMenuItem>
                                      <DropdownMenuSeparator/>
                                      <DropdownMenuItem
                                        onClick={() => handleDelete(restaurant)}
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
          loading={deleteMutation.isPending}
          setOpen={setDeleteModal}
          handleDelete={() => deleteMutation.mutate(selectedRestaurant.id)}
          handleClose={() => {
            setDeleteModal(false)
            setSelectedRestaurant({})
          }}
        />
      </Layout.Body>
    </Layout>
  )
};

export default Index;