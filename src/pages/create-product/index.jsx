import {Layout} from "@/components/custom/layout.jsx";
import {Button} from "@/components/custom/button.jsx";
import {IconPhoto, IconPlus, IconX} from "@tabler/icons-react";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {useNavigate} from "react-router-dom";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import CategoryService from "@/services/category.service.js";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {Input} from "@/components/ui/input.jsx";
import {zodResolver} from "@hookform/resolvers/zod";
import ProductService from "@/services/product.service.js";
import {toast} from "@/hooks/use-toast.js";


const formSchema = z.object({
  name: z
    .string()
    .min(3, {message: 'Name must be at least 3'}),
  image: z
    .any()
    .optional(),
  descriptions: z
    .string()
    .optional(),
  count: z
    .string()
    .min(1, {message: 'Min value is 1'}),
  price: z
    .string()
    .min(3, {message: 'Min value is 3'}),
  discount_price: z
    .string()
    .min(3, {message: 'Min value is 3'}),
  subcategory: z
    .string()
})

const Index = () => {
  const navigate = useNavigate()
  const [isDragged, setIsDragged] = useState(false)
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      image: '',
      descriptions: '',
      count: '',
      price: '',
      discount_price: '',
      subcategory: null
    }
  })

  const mutation = useMutation({
    mutationFn: ProductService.create,
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
    const formData = new FormData()
    Object.keys(data).forEach(item => formData.append(item, data[item]))

    formData.append("image", data.image ? data.image[0] : "")
    mutation.mutate(formData)
  }

  const subCategoryData = useQuery({
    queryKey: ["getAllCategory"],
    queryFn: CategoryService.getAllSub
  })


  return (
    <Layout>
      <Layout.Body>
        <div className="mb-2 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Create Products</h2>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={"flex gap-4"}>
              <div className={"w-2/3 flex flex-col gap-4"}>
                <div className={"w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"}>
                  <h2 className={"text-primary-text text-base font-semibold"}>Kategoriya</h2>
                  {
                    !subCategoryData.isLoading ? (
                      !subCategoryData.isError && subCategoryData.data && subCategoryData.isSuccess && subCategoryData.data.result ? (
                        <FormField
                          control={form.control}
                          name="subcategory"
                          render={({field}) => (
                            <FormItem className="space-y-1">
                              <FormLabel className={"text-[#667085]"}>Kategoriya nomi</FormLabel>
                              <FormControl>
                                <Select value={+field.value} onValueChange={(val) => field.onChange(val)}>
                                  <SelectTrigger className="w-full text-black">
                                    <SelectValue placeholder="Select subcategory"/>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {
                                      subCategoryData.data.result.map((item, index) => (
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

                <div className={"w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"}>
                  <h2 className={"text-primary-text text-base font-semibold"}>Mahsulot nomi</h2>
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
                </div>

                <div className={"w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"}>
                  <h2 className={"text-primary-text text-base font-semibold"}>Mahsulot tavsifi</h2>
                  <FormField
                    control={form.control}
                    name="descriptions"
                    render={({field}) => (
                      <FormItem className="space-y-1">
                        <FormLabel className={"text-[#667085]"}>Mahsulot tavsifi</FormLabel>
                        <FormControl>
                          <Input placeholder="Go'sh, hamir" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                </div>

                <div className={"w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"}>
                  <h2 className={"text-primary-text text-base font-semibold"}>Mahsulot soni</h2>
                  <FormField
                    control={form.control}
                    name="count"
                    render={({field}) => (
                      <FormItem className="space-y-1">
                        <FormLabel className={"text-[#667085]"}>Mahsulot soni</FormLabel>
                        <FormControl>
                          <Input placeholder="10" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                </div>

                <div className={"w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"}>
                  <h2 className={"text-primary-text text-base font-semibold"}>Mahsulot narhi</h2>
                  <FormField
                    control={form.control}
                    name="price"
                    render={({field}) => (
                      <FormItem className="space-y-1">
                        <FormLabel className={"text-[#667085]"}>Mahsulot narhi</FormLabel>
                        <FormControl>
                          <Input placeholder="10" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                </div>

                <div className={"w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"}>
                  <h2 className={"text-primary-text text-base font-semibold"}>Mahsulot chegirmasi</h2>
                  <FormField
                    control={form.control}
                    name="discount_price"
                    render={({field}) => (
                      <FormItem className="space-y-1">
                        <FormLabel className={"text-[#667085]"}>Mahsulot chegirmasi</FormLabel>
                        <FormControl>
                          <Input placeholder="10" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                </div>

              </div>
              {/*TOTAL*/}
              <div className={"w-1/3 flex flex-col gap-3"}>
                <div className={"flex flex-col rounded-md p-4 shadow-xl"}>
                  <h3 className={"text-primary-text text-base font-semibold mb-4"}>add_product_img</h3>
                  <span className={"text-gray-400 text-sm font-normal mb-1"}>picture</span>
                  <FormField
                    name="image"
                    control={form.control}
                    render={
                      ({field: {onChange, value, ...field}}) => (
                        <FormItem>
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
                        className={"flex items-center justify-center rounded-full w-9 h-9 bg-brandbg text-brand p-2"}>
                        <IconPhoto className={"icon"}/>
                      </span>
                                    <p className={"text-center text-gray-400 text-sm font-normal"}>
                                      drag_img
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
                                        delete
                                      </Button>
                                      <label
                                        htmlFor={"imageField"}
                                        className={"w-1/2 h-10 py-[10px] px-3 font-medium text-brand bg-secondary border-none flex items-center transition-all justify-center gap-2 rounded-md cursor-pointer"}
                                      >
                                        replacement
                                      </label>
                                    </div>) :
                                  (
                                    <label
                                      htmlFor={"imageField"}
                                      className={"h-10 py-[10px] px-3 font-medium text-brand bg-brandbg border-none flex items-center hover:bg-brand hover:text-white transition-all justify-center gap-2 rounded-md cursor-pointer"}
                                    >
                                      <IconPlus className={"icon-sm"}/>
                                      add_img
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
                  save
                </Button>

                <Button
                  size={"xl"}
                  type={"reset"}
                  onClick={() => navigate("/products")}
                  className={"w-full gap-2 bg-neutral-50 text-gray-600"}
                >
                  <IconX className={"icon-sm"}/>
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