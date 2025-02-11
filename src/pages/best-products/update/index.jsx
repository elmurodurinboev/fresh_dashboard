import {Layout} from "@/components/custom/layout.jsx";
import {Button} from "@/components/custom/button.jsx";
import {IconPhoto, IconPlus, IconX} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import {useForm, Controller} from "react-hook-form";
import {useNavigate, useParams} from "react-router-dom";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {Input} from "@/components/ui/input.jsx";
import RestaurantProductService from "@/services/restaurant-product.service.js";
import {toast} from "@/hooks/use-toast.js";
import RestaurantService from "@/services/restaurant.service.js";

const Index = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [isDragged, setIsDragged] = useState(false)
  const form = useForm({
    defaultValues: {
      name: "",
      logo: "",
      video_url: "",
      restaurant: "",
    },
  });

  const productData = useQuery({
    queryKey: ['getProduct', params.id],
    queryFn: RestaurantProductService.getOneBest,
    enabled: !!params && !!params.id
  })

  useEffect(() => {
    const {isSuccess, data} = productData;

    if (isSuccess && data?.result !== 0) {
      form.reset({
        name: data?.result?.name && data.result.name,
        logo: data?.result?.logo && data.result.logo,
        video_url: data?.result?.video_url && data.result.video_url,
        restaurant: data?.result?.restaurant && +data.result.restaurant
      });
    }
  }, [productData.isSuccess, productData.data?.result]);

  const mutation = useMutation({
    mutationFn: RestaurantProductService.updatePatchBest,
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
      navigate("/best-products")
    }
  })

  const onSubmit = (data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      key !== 'logo' && formData.append(key, value ?? "");
    });
    const imgType = typeof data?.logo
    data.logo && imgType === 'object' && formData.append("logo", data.logo ? data.logo[0] : productData?.data.result.logo)
    mutation.mutate({formData, id: params.id})
  }

  const restaurantData = useQuery({
    queryKey: ["getAllCategory"],
    queryFn: RestaurantService.getAll
  })


  return (
    <Layout>
      <Layout.Body>
        <div className="mb-2 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Yangilash</h2>
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
                {!restaurantData.isLoading ? (
                  !restaurantData.isError &&
                  restaurantData.data &&
                  restaurantData.isSuccess &&
                  restaurantData.data.results &&
                  restaurantData.data.results ? (
                    <Controller
                      name="restaurant"
                      control={form.control}
                      defaultValue={""}
                      rules={{required: "Restaurant is required"}} // Add validation rules here
                      render={({field, fieldState: {error}}) => (
                        <div className="flex-1">
                          <label className="text-[#667085]">
                            Restoran
                          </label>
                          <Select
                            value={+field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full text-black">
                              <SelectValue placeholder="Select subcategory"/>
                            </SelectTrigger>
                            <SelectContent>
                              {restaurantData.data.results.map(
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
                  name="video_url"
                  control={form.control}
                  rules={{required: "Video is required"}}
                  render={({field, fieldState: {error}}) => (
                    <div>
                      <label className="text-[#667085]">Video url</label>
                      <Input placeholder="https://video.com/lavash" {...field} type={"url"}/>
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
                  name="logo"
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
                Saqlash
              </Button>

              <Button
                size={"xl"}
                type={"reset"}
                variant={"outline"}
                onClick={() => navigate("/best-products")}
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