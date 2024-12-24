import {Layout} from "@/components/custom/layout.jsx";
import {Button} from "@/components/custom/button.jsx";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Input} from "@/components/ui/input.jsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/hooks/use-toast.js";
import ShopService from "@/services/shop.service.js";
import {useNavigate} from "react-router-dom";
import {Switch} from "@/components/ui/switch.jsx";
import CountryService from "@/services/country.service.js";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";


const formSchema = z.object({
  name: z
    .string()
    .min(3, {message: 'Name must be at least 3'}),
  address: z
    .string(),
  delivery_time: z
    .string(),
  description: z
    .string(),
  opening_time: z
    .string(),
  closing_time: z
    .string(),
  latitude: z
    .string(),
  longitude: z
    .string(),
  is_active: z
    .boolean(),
  owner: z
    .number(),
  country: z
    .number(),
})

const Index = () => {
  const navigate = useNavigate()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      delivery_time: '',
      description: '',
      opening_time: '',
      closing_time: '',
      latitude: '',
      longitude: '',
      is_active: true,
      owner: null,
      country: null
    }
  })

  const mutation = useMutation({
    mutationFn: ShopService.create,
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
        title: "Error",
        description: error.message || "Messages.error_occurred"
      })
    },
    onSuccess: () => {
      toast({
        title: 'OK',
        description: "Successfully added"
      })
      form.reset()
    }
  })

  const onSubmit = (data) => {
    console.log('data:', data)
    data.delivery_time = `${data.delivery_time} min`
    mutation.mutate(data)
  }

  const ownersData = useQuery({
    queryKey: ["getOwners"],
    queryFn: ShopService.getOwners
  })

  const countryData = useQuery({
    queryKey: ["getCountries"],
    queryFn: CountryService.getAll
  })

  return (
    <Layout>
      <Layout.Body>
        <div className="mb-2 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Do`kon yaratish</h2>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={"flex gap-4"}>
              <div className={"w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"}>
                <div className={"flex justify-between gap-3"}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                      <FormItem className="space-y-1 flex-1">
                        <FormLabel className={"text-[#667085]"}>Do`kon nomi</FormLabel>
                        <FormControl>
                          <Input placeholder="Evos" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({field}) => (
                      <FormItem className="flex flex-col gap-1 pt-3 items-end">
                        <FormLabel className={"text-[#667085] flex items-center"}>Aktivligi</FormLabel>
                        <FormControl>
                          <Switch {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                </div>

                <div className={"grid grid-cols-12 gap-3"}>
                  <div className={"col-span-6"}>
                    {
                      !countryData.isLoading ? (
                        !countryData.isError && countryData.data && countryData.isSuccess && countryData.data.result ? (
                          <FormField
                            control={form.control}
                            name="country"
                            render={({field}) => (
                              <FormItem className="space-y-1">
                                <FormLabel className={"text-[#667085]"}>Hudud</FormLabel>
                                <FormControl>
                                  <Select value={+field.value} onValueChange={(val) => field.onChange(+val)}>
                                    <SelectTrigger className="w-full text-black">
                                      <SelectValue placeholder="Select country"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {
                                        countryData.data.result.map((item, index) => (
                                          <SelectItem value={item.id} key={index}>{item.name}</SelectItem>
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
                  </div>

                  <div className={"col-span-6"}>
                    {
                      !ownersData.isLoading ? (
                        !ownersData.isError && ownersData.data && ownersData.isSuccess && ownersData.data.result && ownersData.data.result.results ? (
                          <FormField
                            control={form.control}
                            name="owner"
                            render={({field}) => (
                              <FormItem className="space-y-1">
                                <FormLabel className={"text-[#667085]"}>Do`kon egasi</FormLabel>
                                <FormControl>
                                  <Select value={+field.value} onValueChange={(val) => field.onChange(+val)}>
                                    <SelectTrigger className="w-full text-black">
                                      <SelectValue placeholder="Select owner"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {
                                        ownersData.data.result.results && ownersData.data.result.results.map((item, index) => (
                                          <SelectItem value={item.id} key={index}>{item.full_name}</SelectItem>
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
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({field}) => (
                    <FormItem className="space-y-1">
                      <FormLabel className={"text-[#667085]"}>Manzil</FormLabel>
                      <FormControl>
                        <Input placeholder="Hazorasp" {...field} type={"text"}/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />

                <div className={"grid grid-cols-12 items-center gap-3"}>
                  <div className={"col-span-6 flex justify-between"}>
                    <FormField
                      control={form.control}
                      name="opening_time"
                      render={({field}) => (
                        <FormItem className="space-y-1">
                          <FormLabel className={"text-[#667085]"}>Ochilish vaqti</FormLabel>
                          <FormControl>
                            <Input placeholder="30" {...field} type={"time"} className={"w-auto"}/>
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="closing_time"
                      render={({field}) => (
                        <FormItem className="space-y-1">
                          <FormLabel className={"text-[#667085]"}>Ochilish vaqti</FormLabel>
                          <FormControl>
                            <Input placeholder="30" {...field} type={"time"} className={"w-auto"}/>
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className={"col-span-6"}>
                    <FormField
                      control={form.control}
                      name="delivery_time"
                      render={({field}) => (
                        <FormItem className="space-y-1 flex-1">
                          <FormLabel className={"text-[#667085]"}>Yetkazib berish vaqti</FormLabel>
                          <FormControl>
                            <div className={"flex items-center gap-2"}>
                              <Input placeholder="30" {...field} type={"number"}/>
                              <span>daqiqa</span>
                            </div>
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({field}) => (
                    <FormItem className="space-y-1">
                      <FormLabel className={"text-[#667085]"}>Mahsulot tavsifi</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Go'sh, hamir" className={"resize-none"} {...field} rows={5}/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />

                <div className={"grid grid-cols-12 gap-3"}>
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({field}) => (
                      <FormItem className="space-y-1 col-span-6">
                        <FormLabel className={"text-[#667085]"}>Latitude</FormLabel>
                        <FormControl>
                          <Input placeholder="41.1" {...field} type={"text"}/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({field}) => (
                      <FormItem className="space-y-1 col-span-6">
                        <FormLabel className={"text-[#667085]"}>Longitude</FormLabel>
                        <FormControl>
                          <Input placeholder="61.1" {...field} type={"text"}/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

                </div>

                <div className={"space-x-4"}>
                  <Button
                    type={'submit'}
                    size={"lg"}
                    loading={mutation.isPending}
                  >
                    Qo`shish
                  </Button>
                  <Button
                    variant={'outline'}
                    size={"lg"}
                    type={"button"}
                    onClick={() => navigate("/shops")}
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