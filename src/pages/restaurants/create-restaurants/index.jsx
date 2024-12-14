import {Layout} from "@/components/custom/layout.jsx";
import {Button} from "@/components/custom/button.jsx";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Input} from "@/components/ui/input.jsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/hooks/use-toast.js";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {IconPhoto, IconPlus, IconX} from "@tabler/icons-react";
import CountryService from "@/services/country.service.js";
import RestaurantService from "@/services/restaurant.service.js";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Switch} from "@/components/ui/switch.jsx";


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
    .boolean()
})

const Index = () => {
  const [isDragged, setIsDragged] = useState(false)
  const navigate = useNavigate()
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
      is_active: false
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

  const mutation = useMutation({
    mutationFn: RestaurantService.create,
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
        variant: "success",
        title: 'OK',
        description: "Successfully added"
      })
      form.reset()
    }
  })

  const onSubmit = (data) => {
    console.log(data)
    const formData = new FormData()
    Object.keys(data).forEach(item => formData.append(item, data[item]))

    formData.append("image", data.image ? data.image[0] : "")
    mutation.mutate(formData)
  }

  return (
    <Layout>
      <Layout.Body>
        <div className="mb-2 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Restaran yaratish</h2>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={"grid grid-cols-12 gap-4"}>
              <div className={"col-span-12 lg:col-span-8 flex flex-col gap-4"}>
                <div className={"w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"}>
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
                                      owners.data.result.map((item, index) => (
                                        <SelectItem value={item.id}
                                                    key={index}>{item.first_name} {item.last_name}</SelectItem>
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
                    name="name"
                    render={({field}) => (
                      <FormItem className="space-y-1">
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
                    name="delivery_time"
                    render={({field}) => (
                      <FormItem className="space-y-1">
                        <FormLabel className={"text-[#667085]"}>Yetkazib berish vaqti</FormLabel>
                        <FormControl>
                          <Input placeholder="10" {...field} />
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

                    <FormField
                      control={form.control}
                      name="is_active"
                      render={({field}) => (
                        <FormItem className="flex  gap-2">
                          <FormLabel className={"text-[#667085] flex items-center"}>Aktivligi</FormLabel>
                          <FormControl>
                            <Switch {...field} />
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />
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
                        <img src={URL.createObjectURL(value)} alt="Selected Image" width={"100"} height={"100"}
                             className="w-full object-center object-contain"/>
                      </span>) : (
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