import {Layout} from "@/components/custom/layout.jsx";
import {Button} from "@/components/custom/button.jsx";
import {IconPhoto, IconPlus, IconX} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {Input} from "@/components/ui/input.jsx";
import {zodResolver} from "@hookform/resolvers/zod";
import RestaurantProductService from "@/services/restaurant-product.service.js";
import {toast} from "@/hooks/use-toast.js";
import {Textarea} from "@/components/ui/textarea.jsx";
import RestaurantCategoryService from "@/services/restaurant-category.service.js";
import {Switch} from "@/components/ui/switch.jsx";


const formSchema = z.object({
  name: z
    .string()
    .min(3, {message: 'Name must be at least 3'}),
  picture:
    z.any(),
  description: z
    .string()
    .min(5, {message: "This field is required and its length must be greater or equal 5"}),
  stock_level: z
    .number()
    .min(1),
  price: z
    .number()
    .min(3),
  discount_price: z
    .number()
    .min(3),
  is_active: z
    .boolean(),
  category: z
    .number(),
  volume: z
    .number()
})

const Index = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [isDragged, setIsDragged] = useState(false)
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      picture: '',
      description: '',
      price: 0,
      discount_price: 0,
      category: null,
      volume: 0,
      is_active: false,
      stock_level: 0
    }
  })

  const productData = useQuery({
    queryKey: ['getProduct', params.id],
    queryFn: RestaurantProductService.getOne,
    enabled: !!params && !!params.id
  })

  useEffect(() => {
    const {isSuccess, data} = productData;

    if (isSuccess && data?.result !== 0) {
      form.reset({
        name: data.result.name && data.result.name,
        picture: data.result.picture && data.result.picture,
        description: data.result.description && data.result.description,
        volume: data.result.volume && +data.result.volume,
        price: data.result.price && data.result.price,
        discount_price: data.result.discount_price && data.result.discount_price,
        category: data.result.category && data.result.category,
        is_active: data.result.is_active && data.result.is_active,
        stock_level: data.result.stock_level && data.result.stock_level,
      });
    }
  }, [productData.isSuccess, productData.data?.result]);

  const mutation = useMutation({
    mutationFn: RestaurantProductService.updatePatch,
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
      navigate("/restaurant-products")
    }
  })

  const onSubmit = (data) => {
    console.log(data)
    const formData = new FormData()
    Object.keys(data).forEach(item => item !== 'picture' && formData.append(item, data[item]))
    const imgType = typeof data?.picture
    data.picture && imgType === 'object' && formData.append("picture", data.picture ? data.picture[0] : productData?.picture)
    mutation.mutate({formData, id: params.id})
  }

  const categoryData = useQuery({
    queryKey: ["getAllCategory"],
    queryFn: RestaurantCategoryService.getAll
  })


  return (
    <Layout>
      <Layout.Body>
        <div className="mb-2 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Update Products</h2>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={"grid grid-cols-12 gap-4"}>
              <div className={"col-span-12 lg:col-span-8 flex flex-col gap-4"}>
                <div className={"w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"}>
                  <div className={"w-full grid grid-cols-12 gap-4 items-center"}>
                    {
                      !categoryData.isLoading ? (
                        !categoryData.isError && categoryData.data && categoryData.isSuccess && categoryData.data.result && categoryData.data.result.results ? (
                          <FormField
                            control={form.control}
                            name="category"
                            render={({field}) => (
                              <FormItem className="col-span-9 space-y-1">
                                <FormLabel className={"text-[#667085]"}>Kategoriya nomi</FormLabel>
                                <FormControl>
                                  <Select value={+field.value} onValueChange={(val) => field.onChange(+val)}>
                                    <SelectTrigger className="w-full text-black">
                                      <SelectValue placeholder="Select subcategory"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {
                                        categoryData.data.result.results.map((item, index) => (
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
                        <Skeleton className={"col-span-9 h-9 rounded-md"}/>
                      )
                    }

                    <FormField
                      control={form.control}
                      name="is_active"
                      render={({field}) => (
                        <FormItem className="flex flex-col gap-1 col-span-3 pt-3 items-end">
                          <FormLabel className={"text-[#667085] flex items-center"}>Aktivligi</FormLabel>
                          <FormControl>
                            <Switch {...field} onCheckedChange={val => field.onChange(val)} />
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />
                  </div>

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

                  <FormField
                    control={form.control}
                    name="volume"
                    render={({field}) => (
                      <FormItem className="space-y-1">
                        <FormLabel className={"text-[#667085]"}>Volume</FormLabel>
                        <FormControl>
                          <Input placeholder="10" {...field} onChange={e => field.onChange(+e.target.value)}  />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />


                  <FormField
                    control={form.control}
                    name="price"
                    render={({field}) => (
                      <FormItem className="space-y-1">
                        <FormLabel className={"text-[#667085]"}>Mahsulot narhi</FormLabel>
                        <FormControl>
                          <Input placeholder="10" {...field} onChange={e => field.onChange(+e.target.value)}  />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discount_price"
                    render={({field}) => (
                      <FormItem className="space-y-1">
                        <FormLabel className={"text-[#667085]"}>Mahsulotdan chegirmasi</FormLabel>
                        <FormControl>
                          <Input placeholder="1000" {...field} onChange={e => field.onChange(+e.target.value)}  />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock_level"
                    render={({field}) => (
                      <FormItem className="space-y-1">
                        <FormLabel className={"text-[#667085]"}>Stock level</FormLabel>
                        <FormControl>
                          <Input placeholder="1000" {...field} onChange={e => field.onChange(+e.target.value)}  />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({field}) => (
                      <FormItem className="space-y-1">
                        <FormLabel className={"text-[#667085]"}>Mahsulot tavsifi</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Go'sh, hamir" className={"resize-none"} {...field} rows={5} />
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
                          <FormLabel className={"text-[#667085]"}>Mahsulot rasmi</FormLabel>
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
                                )
                              }
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
                  save
                </Button>

                <Button
                  size={"xl"}
                  type={"reset"}
                  variant={"outline"}
                  onClick={() => navigate("/restaurant-products")}
                  className={"w-full gap-2 items-center"}
                >
                  <IconX className={"w-5 h-5"}/>
                  cancel
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