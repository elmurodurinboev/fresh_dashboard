import {Layout} from "@/components/custom/layout.jsx";
import {Button} from "@/components/custom/button.jsx";
import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Input} from "@/components/ui/input.jsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/hooks/use-toast.js";
import RestaurantCategoryService from "@/services/restaurant-category.service.js";
import RestaurantService from "@/services/restaurant.service.js";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import ROLES from "@/data/roles.js";
import {useAuth} from "@/hooks/utils/useAuth.js";
import SelectComponent from "@/components/custom/select-component.jsx";


const formSchema = z.object({
  name: z
    .string()
    .min(3, {message: 'Name must be at least 3'}),
  restaurant: z
    .number()
})

const Index = () => {
  const navigate = useNavigate()
  const {session: {user}} = useAuth()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      restaurant: null
    }
  })

  const mutation = useMutation({
    mutationFn: RestaurantCategoryService.create,
    onError: (error) => {
      const {data: {errors: serverErrors}, status} = error.response;
      if (status === 422) {
        Object.entries(serverErrors).forEach(([key, value]) => {
          form.setError(key, {
            type: "server", message: value[0]
          })
        })
        return;
      }
      toast({
        variant: 'destructive',
        title: "Error",
        description: error?.message || "Messages.error_occurred"
      })
    },
    onSuccess: () => {
      toast({
        title: 'OK',
        variant: "success",
        description: "Successfully added"
      })
      form.reset()
      navigate("/restaurant-category")
    }
  })

  const restaurantsData = useQuery({
    queryKey: ['getRestaurants'],
    queryFn: RestaurantService.getAll
  })

  useEffect(() => {
    const {isSuccess, data} = restaurantsData;

    if (isSuccess && data?.results?.length !== 0 && user?.user_role === ROLES.RESTAURANT_OWNER) {
      form.reset({restaurant: `${restaurantsData.data.results[0]?.id}`});
    }
  }, [restaurantsData.isSuccess, restaurantsData.data?.results]);


  const onSubmit = (data) => {
    mutation.mutate(data)
  }

  return (
    <Layout>
      <Layout.Header/>
      <Layout.Body>
        <div className="mb-2 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Restoran kategoriyasini yaratish</h2>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className={"w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"}>
                {
                  !restaurantsData.isLoading ? (
                    !restaurantsData.isError && restaurantsData.data && restaurantsData.isSuccess && restaurantsData.data.results ? (
                      <FormField
                        control={form.control}
                        name="restaurant"
                        render={({field, fieldState: {error}}) => (
                          <FormItem className="space-y-1">
                            <FormLabel className={"text-[#667085]"}>Restoran</FormLabel>
                            <FormControl>
                              <SelectComponent
                                hasError={!!error}
                                value={field.value}
                                onChange={field.onChange}
                                options={restaurantsData?.data?.results}
                              />
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                        )
                        }
                      />
                    ) : (
                      <span className={"text-rose-500"}>Nimadir xato ketdi!</span>
                    )
                  ) : (
                    <Skeleton className={"w-full h-9 rounded-md"}/>
                  )
                }
                <FormField
                  control={form.control}
                  name="name"
                  render={({field}) => (
                    <FormItem className="space-y-1">
                      <FormLabel className={"text-[#667085]"}>Kategoriya nomi</FormLabel>
                      <FormControl>
                        <Input placeholder="Lavash" {...field} />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <div className={"flex justify-start items-center gap-3"}>
                  <Button
                    size={"lg"}
                    type={"submit"}
                    loading={mutation.isPending}
                  >
                    Saqlash
                  </Button>

                  <Button
                    size={"lg"}
                    type={"reset"}
                    variant={"outline"}
                    onClick={() => navigate("/restaurant-category")}
                  >
                    Bekor qilish
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </Layout.Body>
    </Layout>
  );
};

export default Index;