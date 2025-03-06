import {Layout} from "@/components/custom/layout.jsx";
import {Button} from "@/components/custom/button.jsx";
import {IconCash, IconPercentage, IconPhoto, IconPlus, IconX} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import SubcategoryService from "@/services/subcategory.service.js";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {Input} from "@/components/ui/input.jsx";
import ShopProductService from "@/services/shop-product.service.js";
import {toast} from "@/hooks/use-toast.js";
import {Textarea} from "@/components/ui/textarea.jsx";
import {Switch} from "@/components/ui/switch.jsx";
import InputWithFormat from "@/components/custom/input-with-format.jsx";
import {Checkbox} from "@/components/ui/checkbox.jsx";
import SelectComponent from "@/components/custom/select-component.jsx";

const Index = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [isDragged, setIsDragged] = useState(false)
  const [withDiscount, setWithDiscount] = useState(false)
  const [contributionType, setContributionType] = useState('percent')
  const form = useForm({
    defaultValues: {
      name: "",
      image: "",
      descriptions: "",
      price: "",
      discount_price: "",
      subcategory: "",
      is_active: false,
      stock_level: "",
      contribution_amount: '',
      contribution_type: contributionType,
    },
  });

  const productData = useQuery({
    queryKey: ['getProduct', params.id],
    queryFn: ShopProductService.getOne,
    enabled: !!params && !!params.id
  })

  useEffect(() => {
    const {isSuccess, data} = productData;

    if (isSuccess && data?.result !== 0) {
      setContributionType(data.result.contribution_type ? data.result.contribution_type : "percent")
      setWithDiscount(!!data?.result?.discount_price)
      form.reset({
        name: data?.result?.name && data.result.name,
        image: data?.result?.image && data.result.image,
        descriptions: data?.result?.descriptions && data.result.descriptions,
        price: data?.result?.price && data.result.price,
        discount_price: data?.result?.discount_price && data.result.discount_price,
        subcategory: data?.result?.subcategory?.id && +data.result.subcategory.id,
        is_active: data?.result?.is_active && data.result.is_active,
        stock_level: data?.result?.stock_level && data.result.stock_level,
        contribution_amount: data?.result?.contribution_amount && data.result.contribution_amount,
      });
    }
  }, [productData.isSuccess, productData.data?.result]);

  const mutation = useMutation({
    mutationFn: ShopProductService.updatePatch,
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
      navigate("/shop-products")
    }
  })

  const onSubmit = (data) => {
    data.contribution_type = contributionType
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      key !== 'image' && formData.append(key, value ?? "");
    });
    const imgType = typeof data?.image
    data.image && imgType === 'object' && formData.append("image", data.image ? data.image[0] : productData?.image)
    mutation.mutate({formData, id: params.id})
  }

  const subCategoryData = useQuery({
    queryKey: ["getAllSubCategory"],
    queryFn: SubcategoryService.getAllSub
  })


  return (
    <Layout>
      <Layout.Body>
        <div className="mb-2 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Mahsulotni o`zgartirish</h2>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"grid grid-cols-12 gap-4"}>
            <div className={"col-span-12 lg:col-span-8 flex flex-col gap-4"}>
              <div className={"w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"}>
                <div className={"flex gap-3 items-center"}>

                  {!subCategoryData.isLoading ? (
                    !subCategoryData.isError &&
                    subCategoryData.data &&
                    subCategoryData.isSuccess &&
                    subCategoryData.data.results &&
                    subCategoryData.data.results ? (
                      <Controller
                        name="subcategory"
                        control={form.control}
                        defaultValue={""}
                        rules={{required: "Subkategoriya tanlanishi shart"}} // Add validation rules here
                        render={({field, fieldState: {error}}) => (
                          <div className="flex-1">
                            <label className="text-[#667085]">
                              Kategoriya nomi
                            </label>
                            <SelectComponent
                              hasError={!!error}
                              value={field.value}
                              onChange={field.onChange}
                              options={subCategoryData?.data?.results}
                            />
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
                    rules={{required: false}}
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


                <Controller
                  name="stock_level"
                  control={form.control}
                  rules={{required: "Stock level is required"}}
                  render={({field, fieldState: {error}}) => (
                    <div className="">
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
                  rules={{required: false}}
                  render={({field, fieldState: {error}}) => (
                    <div>
                      <div className={"flex items-center gap-2"}>
                        <label className="text-[#667085]">
                          Chegirma
                        </label>
                        <Checkbox className={"w-5 h-5 rounded-md"} checked={withDiscount} onCheckedChange={val => {
                          field.onChange("")
                          setWithDiscount(val)
                        }} />
                      </div>
                      {
                        withDiscount && (
                          <InputWithFormat
                            placeholder="10 000"
                            value={field.value}
                            onValueChange={(e) => field.onChange(e)}
                          />
                        )
                      }
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
                  name="descriptions"
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
                  name="image"
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
                          )}
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
                Saqlash
              </Button>

              <Button
                size={"xl"}
                type={"reset"}
                variant={"outline"}
                onClick={() => navigate("/shop-products")}
                className={"w-full gap-2 items-center"}
              >
                <IconX className={"w-5 h-5"}/>
                Bekor qilish
              </Button>
            </div>
          </form>
        </div>
      </Layout.Body>
    </Layout>
  );
};

export default Index;