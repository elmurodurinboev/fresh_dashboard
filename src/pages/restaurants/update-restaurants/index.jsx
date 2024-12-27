import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQuery} from "@tanstack/react-query";
import {toast} from "@/hooks/use-toast.js";
import {z} from "zod";
import {Layout} from "@/components/custom/layout.jsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Switch} from "@/components/ui/switch.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {IconPhoto, IconPlus, IconX} from "@tabler/icons-react";
import {Button} from "@/components/custom/button.jsx";
import RestaurantService from "@/services/restaurant.service.js";
import CountryService from "@/services/country.service.js";

const formSchema = z.object({
  name: z
    .string()
    .min(3, {message: 'Name must be at least 3'}),
  delivery_time: z
    .string()
    .min(2, {message: "Bu maydon bo'sh bo'lmasligi kerak"}),
  country: z
    .number(),
  owner: z
    .number(),
  picture: z
    .any(),
  description: z
    .string(),
  rating: z
    .number(),
  is_active: z
    .boolean(),
  latitude: z
    .string(),
  longitude: z
    .string(),
  opening_time: z
    .string(),
  closing_time: z
    .string(),
  contractor: z
    .string(),
  address: z
    .string(),
})

const Index = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [isDragged, setIsDragged] = useState(false)
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      delivery_time: '',
      country: null,
      owner: null,
      picture: null,
      description: '',
      rating: "",
      is_active: false,
      latitude: "",
      longitude: "",
      opening_time: "",
      closing_time: "",
      contractor: "",
      address: '',
    }
  })

  const restaurantData = useQuery({
    queryKey: ['getRestaurantData', params.id],
    queryFn: RestaurantService.getOne,
    enabled: !!params && !!params.id
  })

  useEffect(() => {
    const {isSuccess, data} = restaurantData;

    if (isSuccess && data?.result !== 0) {
      form.reset({
        name: data.result.name && data.result.name,
        delivery_time: data.result.delivery_time && data.result.delivery_time,
        country: data.result.country && data.result.country,
        owner: data.result.owner && data.result.owner,
        picture: data.result.picture && data.result.picture,
        description: data.result.description && data.result.description,
        rating: data.result.rating && data.result.rating,
        is_active: data.result.is_active && data.result.is_active,
        address: data.result.address && data.result.address,
        contractor: data.result.contractor && data.result.contractor,
        latitude: data.result.latitude && data.result.latitude,
        longitude: data.result.longitude && data.result.longitude,
        opening_time: data.result.opening_time && data.result.opening_time,
        closing_time: data.result.closing_time && data.result.closing_time,
      });
    }
  }, [restaurantData.isSuccess, restaurantData.data?.result]);

  const mutation = useMutation({
    mutationFn: RestaurantService.updatePatch,
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
      navigate("/restaurants")
    }
  })

  const country = useQuery({
    queryKey: ['GetCountry'],
    queryFn: CountryService.getAll
  })

  const owners = useQuery({
    queryKey: ['GetOwners'],
    queryFn: RestaurantService.getOwners
  })

  const onSubmit = (data) => {
    console.log(data)
    const formData = new FormData()
    Object.keys(data).forEach(item => item !== 'picture' && formData.append(item, data[item]))
    const imgType = typeof data?.picture
    data.picture && imgType === 'object' && formData.append("picture", data.picture)
    mutation.mutate({formData, id: params.id})
  }
  return (
    <Layout>
      <Layout.Body>
        <div className="mb-2 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Restaranni o`zgartirish</h2>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={"grid grid-cols-12 gap-4"}>
              <div className={"col-span-12 lg:col-span-8 flex flex-col gap-4"}>
                <div className={"w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"}>
                  <div className={"flex items-center justify-between gap-3"}>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({field}) => (
                        <FormItem className="space-y-1 flex-1">
                          <FormLabel className={"text-[#667085]"}>Restaran nomi</FormLabel>
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
                        <FormItem className="flex flex-col gap-1 items-end pt-2">
                          <FormLabel className={"text-[#667085] flex items-center"}>Aktivligi</FormLabel>
                          <FormControl>
                            <Switch {...field} checked={field.value} onCheckedChange={val => field.onChange(val)} />
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />
                  </div>
                  {
                    !owners.isLoading ? (
                      !owners.isError && owners.data && owners.isSuccess && owners.data.result ? (
                        <FormField
                          control={form.control}
                          name="owner"
                          render={({field}) => (
                            <FormItem className="space-y-1">
                              <FormLabel className={"text-[#667085]"}>Restaran egasi</FormLabel>
                              <FormControl>
                                <Select value={+field.value} onValueChange={(val) => field.onChange(+val)}>
                                  <SelectTrigger className="w-full text-black">
                                    <SelectValue placeholder="Select Owner"/>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {
                                      owners.data.result.results.map((item, index) => (
                                        <SelectItem value={item.id}
                                                    key={index}>{item.full_name}</SelectItem>
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
                  {
                    !country.isLoading ? (
                      !country.isError && country.data && country.isSuccess && country.data.result ? (
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
                                      country.data.result.map((item, index) => (
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


                  <FormField
                    control={form.control}
                    name="contractor"
                    render={({field}) => (
                      <FormItem className="space-y-1">
                        <FormLabel className={"text-[#667085]"}>Contractor</FormLabel>
                        <FormControl>
                          <Input placeholder="Evos" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <div className={"flex items-center justify-between gap-4"}>
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({field}) => (
                        <FormItem className="space-y-1 flex-1">
                          <FormLabel className={"text-[#667085]"}>Restor reytinggi</FormLabel>
                          <FormControl>
                            <Input placeholder="10" {...field} onChange={e => field.onChange(+e.target.value)}/>
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className={"grid grid-cols-12 items-center gap-3"}>
                    <div className={"col-span-6 flex justify-between"}>
                      <FormField
                        control={form.control}
                        name="opening_time"
                        render={({field}) => (
                          <FormItem className="space-y-1">
                            <FormLabel className={"text-[#667085]"}>Ochilish vaqti</FormLabel>
                            <FormControl>
                              <Input placeholder="30"  {...field} type={"time"} className={"w-auto"}/>
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
                        <FormLabel className={"text-[#667085]"}>Restoran tavsifi</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Go'sh, hamir" className={"resize-none"} {...field} rows={5}/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

                  <div className={"grid grid-cols-12 gap-3"}>
                    <div className={"col-span-12"}>
                      <h3 className={"text-xl font-medium"}>Joylashuv</h3>
                    </div>
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
                </div>
              </div>

              {/*Product Image*/}
              <div className={"col-span-12 lg:col-span-4 flex flex-col gap-3"}>
                <div className={"flex flex-col bg-white rounded-2xl shadow p-6"}>
                  <FormField
                    name="picture"
                    control={form.control}
                    render={
                      ({field: {onChange, value, ...field}}) => (
                        <FormItem>
                          <FormLabel className={"text-[#667085]"}>Restoran rasmi</FormLabel>
                          <FormControl>
                            <div
                              className={`w-full border-2 border-dashed flex p-4 flex-col items-center justify-center rounded-md cursor-pointer gap-4 ${isDragged ? 'border-primary' : ''}`}
                              onDragEnter={(e) => {
                                e.preventDefault();
                                setIsDragged(true);
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragged(true);
                              }}
                              onDragLeave={() => {
                                setIsDragged(false);
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                setIsDragged(false);
                                onChange(e.dataTransfer.files[0]);
                              }}
                            >
                              {
                                value ? (
                                  <span className={"w-full min-h-max rounded-md overflow-hidden"}>
                                    <img
                                      src={typeof value === "string" ? value : URL.createObjectURL(value)}
                                      alt="Selected Image"
                                      width={"100"}
                                      height={"100"}
                                      className="w-full object-center object-contain"
                                    />
                                  </span>
                                ) : (
                                  <div className={"w-full flex flex-col justify-center items-center gap-4"}>
                                    <span
                                      className={"flex items-center justify-center rounded-full w-9 h-9 bg-green-100 text-green-600 p-2"}>
                                      <IconPhoto className={"icon"}/>
                                    </span>
                                    <p className={"text-center text-gray-400 text-sm font-normal"}>
                                      Rasmni bu yerga sudrab tashlang yoki rasm qo`shish tugmasini bosing
                                    </p>
                                  </div>
                                )}
                              <input
                                {...field}
                                type="file"
                                id={"imageField"}
                                className={"hidden"}
                                accept={"image/png, image/jpeg, image/jpg, image/heic"}
                                value={value?.fileName}
                                onChange={(e) => onChange(e.target.files[0])}
                              />
                              {
                                value ? (
                                    <div className={"w-full flex gap-4 items-center"}>
                                      <Button
                                        type={"button"}
                                        variant={"danger"}
                                        className={"w-1/2"}
                                        onClick={() => onChange(null)} // This line clears the selected image
                                      >
                                        O`chirish
                                      </Button>
                                      <label
                                        htmlFor={"imageField"}
                                        className={"w-1/2 h-10 py-[10px] px-3 font-medium text-brand bg-secondary border-none flex items-center transition-all justify-center gap-2 rounded-md cursor-pointer"}
                                      >
                                        Almashtirish
                                      </label>
                                    </div>) :
                                  (
                                    <label
                                      htmlFor={"imageField"}
                                      className={"h-10 py-[10px] px-3 font-medium text-green-600 bg-green-50 border-none flex items-center hover:bg-green-500 hover:text-white transition-all justify-center gap-2 rounded-md cursor-pointer"}
                                    >
                                      <IconPlus className={"w-5 h-5"}/>
                                      Rasm qo‘shish
                                    </label>)}
                            </div>
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )
                    }
                  />
                </div>
                <Button
                  size={"xl"}
                  type={"submit"}
                  className={"w-full"}
                  loading={mutation.isPending}
                >
                  Saqlash
                </Button>

                <Button
                  size={"xl"}
                  type={"reset"}
                  variant={"outline"}
                  onClick={() => navigate("/restaurants")}
                  className={"w-full gap-2 items-center"}
                >
                  <IconX className={"w-5 h-5"}/>
                  Bekor qilish
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Layout.Body>
    </Layout>
  );
};

export default Index;