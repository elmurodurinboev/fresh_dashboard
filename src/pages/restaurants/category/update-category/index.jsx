import {Layout} from "@/components/custom/layout.jsx";
import {Button} from "@/components/custom/button.jsx";
import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Input} from "@/components/ui/input.jsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/hooks/use-toast.js";
import RestaurantCategoryService from "@/services/restaurant-category.service.js";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import RestaurantService from "@/services/restaurant.service.js";


const formSchema = z.object({
  name: z
    .string()
    .min(3, {message: 'Name must be at least 3'}),
  restaurant: z
    .string()
})

const Index = () => {
  const params = useParams()
  const navigate = useNavigate()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      restaurant: "",
    }
  })

  const categoryData = useQuery({
    queryKey: ['getOneCategory', params.id],
    queryFn: RestaurantCategoryService.getOne,
    enabled: !!params && !!params.id
  })

  useEffect(() => {
    if (categoryData && categoryData.data && categoryData.isSuccess && categoryData.data.result && !categoryData.isError) {
      form.reset({
        name: categoryData.data.result.name && categoryData.data.result.name,
        restaurant: categoryData.data.result.restaurant && categoryData.data.result.restaurant,
      })
    }
  }, [categoryData.isSuccess, categoryData.data?.result]);


  const mutation = useMutation({
    mutationFn: RestaurantCategoryService.updatePatch,
    onError: (error) => {
      const {result: {errors: serverErrors}, status} = error.response;
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
        description: error.message || "Messages.error_occurred"
      })
    },
    onSuccess: () => {
      toast({
        title: 'OK',
        variant: "success",
        description: "O'zgartirildi!"
      })
      form.reset()
      navigate("/restaurant-category")
    }
  })

  const onSubmit = (data) => {
    const formData = new FormData()
    formData.append("id", params.id)
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });
    mutation.mutate(formData)
  }


  const restaurantsData = useQuery({
    queryKey: ['getRestaurants'],
    queryFn: RestaurantService.getAll
  })

  return (
    <Layout>
      <Layout.Header/>

      <Layout.Body>
        <div className="mb-2 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Restoran kategoriyasini yangilash</h2>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={"grid grid-cols-12 gap-4"}>
              <div className={"col-span-12 lg:col-span-8 flex flex-col gap-4"}>
                <div className={"w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"}>

                  {
                    !restaurantsData.isLoading ? (
                      !restaurantsData.isError && restaurantsData.data && restaurantsData.isSuccess && restaurantsData.data.results ? (
                        <FormField
                          control={form.control}
                          name="restaurant"
                          render={({field}) => (
                            <FormItem className="space-y-1">
                              <FormLabel className={"text-[#667085]"}>Restoran</FormLabel>
                              <FormControl>
                                <Select value={field?.value?.toString()} onValueChange={field.onChange}>
                                  <SelectTrigger className="w-full text-black">
                                    <SelectValue placeholder="Restoranni tanlang"/>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {
                                      restaurantsData.data.results.map((item, index) => (
                                        <SelectItem value={item.id.toString()} key={index}>{item.name}</SelectItem>
                                      ))
                                    }
                                  </SelectContent>
                                </Select>
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
                        <FormLabel className={"text-[#667085]"}>Mahsulot nomi</FormLabel>
                        <FormControl>
                          <Input placeholder="Lavash" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <div className={"flex items-center gap-3"}>
                    <Button
                      size={"xl"}
                      type={"submit"}
                      loading={mutation.isPending}
                    >
                      Saqlash
                    </Button>

                    <Button
                      size={"xl"}
                      type={"reset"}
                      variant={"outline"}
                      onClick={() => navigate("/restaurant-category")}
                    >
                      Bekor qilish
                    </Button>
                  </div>
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