import {Layout} from "@/components/custom/layout.jsx";
import {Button} from "@/components/custom/button.jsx";
import {IconPhoto, IconPlus, IconX, IconCash, IconPercentage} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import {useForm, Controller} from "react-hook-form";
import {useNavigate, useParams} from "react-router-dom";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {Input} from "@/components/ui/input.jsx";
import RestaurantProductService from "@/services/restaurant-product.service.js";
import {toast} from "@/hooks/use-toast.js";
import {Textarea} from "@/components/ui/textarea.jsx";
import RestaurantCategoryService from "@/services/restaurant-category.service.js";
import {Switch} from "@/components/ui/switch.jsx";
import InputWithFormat from "@/components/custom/input-with-format.jsx";


const Index = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [isDragged, setIsDragged] = useState(false)
  const [contributionType, setContributionType] = useState('percent')
  const form = useForm({
    defaultValues: {
      name: "",
      picture: "",
      description: "",
      price: "",
      discount_price: "",
      category: "",
      volume: "",
      is_active: false,
      stock_level: "",
      contribution_amount: "",
      contribution_type: contributionType,
    },
  });

  const productData = useQuery({
    queryKey: ['getProduct', params.id],
    queryFn: RestaurantProductService.getOne,
    enabled: !!params && !!params.id
  })

  useEffect(() => {
    const {isSuccess, data} = productData;

    if (isSuccess && data?.result !== 0) {
      setContributionType(data?.result?.contribution_type ? data.result.contribution_type : 'percent')
      form.reset({
        name: data?.result?.name && data.result.name,
        picture: data?.result?.picture && data.result.picture,
        description: data?.result?.description && data.result.description,
        volume: data?.result?.volume && +data.result.volume,
        price: data?.result?.price && data.result.price,
        discount_price: data?.result?.discount_price && data.result.discount_price,
        category: data?.result?.category && data.result.category,
        is_active: data?.result?.is_active && data.result.is_active,
        stock_level: data?.result?.stock_level && data.result.stock_level,
        contribution_amount: data?.result?.contribution_amount && data.result.contribution_amount,
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
    data.contribution_type = contributionType
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={"grid grid-cols-12 gap-4"}
          >
            <div className={"col-span-12 lg:col-span-8 flex flex-col gap-4"}>
              <div
                className={
                  "w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"
                }
              >
                <div className={"flex gap-3 items-center"}>
                  {!categoryData.isLoading ? (
                    !categoryData.isError &&
                    categoryData.data &&
                    categoryData.isSuccess &&
                    categoryData.data.result &&
                    categoryData.data.result.results ? (
                      <Controller
                        name="category"
                        control={form.control}
                        defaultValue={""}
                        rules={{required: "Category is required"}} // Add validation rules here
                        render={({field, fieldState: {error}}) => (
                          <div className="flex-1">
                            <label className="text-[#667085]">
                              Kategoriya nomi
                            </label>
                            <Select
                              value={+field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full text-black">
                                <SelectValue placeholder="Select subcategory"/>
                              </SelectTrigger>
                              <SelectContent>
                                {categoryData.data.result.results.map(
                                  (item, index) => (
                                    <SelectItem value={item.id} key={index}>
                                      {item.name}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            {error && (
                              <p className="text-red-500 text-sm">
                                {error.message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    ) : (
                      <span className={"text-rose-500"}>
                        Nimadir xato ketdi!
                      </span>
                    )
                  ) : (
                    <Skeleton className={"col-span-9 h-9 rounded-md"}/>
                  )}

                  <Controller
                    name="is_active"
                    control={form.control}
                    rules={{required: "This field is required"}}
                    render={({field, fieldState: {error}}) => (
                      <div className="flex flex-col">
                        <label className="text-[#667085]">Aktivligi</label>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        {error && (
                          <p className="text-red-500 text-sm">
                            {error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <Controller
                  name="name"
                  control={form.control}
                  rules={{required: "Name is required"}}
                  render={({field, fieldState: {error}}) => (
                    <div>
                      <label className="text-[#667085]">Mahsulot nomi</label>
                      <Input placeholder="Lavash" {...field} />
                      {error && (
                        <p className="text-red-500 text-sm">{error.message}</p>
                      )}
                    </div>
                  )}
                />

                <div className="grid grid-cols-12 gap-3">
                  <Controller
                    name="volume"
                    control={form.control}
                    rules={{required: "Volume is required"}}
                    render={({field, fieldState: {error}}) => (
                      <div className="col-span-6">
                        <label className="text-[#667085]">Volume</label>
                        <InputWithFormat
                          placeholder="10"
                          value={field.value}
                          onValueChange={(e) => field.onChange(e)}
                        />
                        {error && (
                          <p className="text-red-500 text-sm">
                            {error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    name="stock_level"
                    control={form.control}
                    rules={{required: "Stock level is required"}}
                    render={({field, fieldState: {error}}) => (
                      <div className="col-span-6">
                        <label className="text-[#667085]">Stock level</label>
                        <InputWithFormat
                          placeholder="10"
                          value={field.value}
                          onValueChange={(e) => field.onChange(e)}
                        />
                        {error && (
                          <p className="text-red-500 text-sm">
                            {error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <Controller
                  name="price"
                  control={form.control}
                  rules={{required: "Price is required"}}
                  render={({field, fieldState: {error}}) => (
                    <div>
                      <label className="text-[#667085]">Mahsulot narhi</label>
                      <InputWithFormat
                        placeholder="10 000"
                        value={field.value}
                        onValueChange={(e) => field.onChange(e)}
                      />
                      {error && (
                        <p className="text-red-500 text-sm">{error.message}</p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="discount_price"
                  control={form.control}
                  rules={{required: "Discount price is required"}}
                  render={({field, fieldState: {error}}) => (
                    <div>
                      <label className="text-[#667085]">
                        Chegirma
                      </label>
                      <InputWithFormat
                        placeholder="10 000"
                        value={field.value}
                        onValueChange={(e) => field.onChange(e)}
                      />
                      {error && (
                        <p className="text-red-500 text-sm">{error.message}</p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="contribution_amount"
                  control={form.control}
                  rules={{required: "contribution amount is required"}}
                  render={({field, fieldState: {error}}) => (
                    <div className={"flex flex-col gap-1"}>
                      <label className="text-[#667085]">
                        Mahsulotdan olinadigan ulush ({contributionType === 'price' ? "so`m" : "% foiz"})
                      </label>
                      <div className={"flex justify-between gap-2"}>
                        <InputWithFormat
                          placeholder={contributionType === 'price' ? "10 000" : '10%'}
                          value={field.value}
                          onValueChange={(e) => field.onChange(e)}
                          className={"flex-1"}
                        />
                        <Button
                          size={"icon"}
                          variant={"outline"}
                          type="button"
                          onClick={() => {
                            field.onChange("")
                            setContributionType(prevState => prevState === 'price' ? 'percent' : 'price')
                          }}
                        >
                          {
                            contributionType === 'price' ? <IconCash size={20}/> : <IconPercentage size={20}/>
                          }
                        </Button>
                      </div>

                      {error && (
                        <p className="text-red-500 text-sm">{error.message}</p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="description"
                  control={form.control}
                  rules={{required: "Description is required"}}
                  render={({field, fieldState: {error}}) => (
                    <div>
                      <label className="text-[#667085]">Mahsulot tavsifi</label>
                      <Textarea
                        placeholder="Go'sh, hamir"
                        className={"resize-none"}
                        {...field}
                        rows={5}
                      />
                      {error && (
                        <p className="text-red-500 text-sm">{error.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            {/*Product Image*/}
            <div className={"col-span-12 lg:col-span-4 flex flex-col gap-3"}>
              <div className={"flex flex-col bg-white rounded-2xl shadow p-6"}>
                <Controller
                  name="picture"
                  control={form.control}
                  rules={{required: "Image is required"}}
                  render={({
                             field: {onChange, value},
                             fieldState: {error},
                           }) => (
                    <div>
                      <div
                        className={`w-full border-2 border-dashed flex p-4 flex-col items-center justify-center rounded-md cursor-pointer gap-4 ${
                          isDragged ? "border-primary" : ""
                        }`}
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
                      {error && (
                        <p className="text-red-500 text-sm">{error.message}</p>
                      )}
                    </div>
                  )}
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
        </div>
      </Layout.Body>
    </Layout>
  );
};

export default Index;