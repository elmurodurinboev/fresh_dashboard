import {Layout} from "@/components/custom/layout.jsx";
import {Button} from "@/components/custom/button.jsx";
import {IconPhoto, IconPlus, IconX} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import {useForm, Controller} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {Input} from "@/components/ui/input.jsx";
import RestaurantProductService from "@/services/restaurant-product.service.js";
import {toast} from "@/hooks/use-toast.js";
import RestaurantService from "@/services/restaurant.service.js";
import {useAuth} from "@/hooks/utils/useAuth.js";
import ROLES from "@/data/roles.js";
import SelectComponent from "@/components/custom/select-component.jsx";

const Index = () => {
  const navigate = useNavigate();
  const [isDragged, setIsDragged] = useState(false);
  const form = useForm({
    defaultValues: {
      name: "",
      logo: "",
      video_url: "",
      restaurant: "",
    },
  });

  const {session: {user}} = useAuth()


  const mutation = useMutation({
    mutationFn: RestaurantProductService.bestProductCreate,
    onError: (error) => {
      const {
        data: {errors: serverErrors},
        status,
      } = error.response;
      if (status === 422) {
        Object.entries(serverErrors).forEach(([key, value]) => {
          form.setError(key, {
            type: "server",
            message: value[0],
          });
        });
        return;
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Messages.error_occurred",
      });
    },
    onSuccess: () => {
      toast({
        title: 'OK',
        variant: "success",
        description: "Muvaffaqiyatli Qo'shildi"
      })
      form.reset();
      navigate("/best-products")
    },
  });

  const onSubmit = (data) => {
    console.log(data)
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });
    mutation.mutate(formData);
  };

  const restaurantData = useQuery({
    queryKey: ["getAllRestaurant"],
    queryFn: RestaurantService.getAll,
  });

  useEffect(() => {
    const {isSuccess, data} = restaurantData;

    if (isSuccess && data?.results?.length !== 0 && user?.user_role === ROLES.RESTAURANT_OWNER) {
      form.reset({restaurant: `${restaurantData.data.results[0]?.id}`});
    }
  }, [restaurantData.isSuccess, restaurantData.data?.results]);

  return (
    <Layout>
      <Layout.Body>
        <div className="mb-2 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Eng yaxshi mahsulot
            </h2>
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
                      rules={{required: "Restoran tanlanishi shart!"}}
                      render={({field, fieldState: {error}}) => (
                        <div className="flex-1">
                          <label className="text-[#667085]">Restoran</label>
                          <SelectComponent
                            hasError={!!error}
                            value={field.value}
                            onChange={field.onChange}
                            options={restaurantData?.data?.results}
                          />
                          {error && <p className="text-red-500 text-sm">{error.message}</p>}
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
                  rules={{ required: "Video is required" }}
                  render={({ field: { onChange }, fieldState: { error } }) => (
                    <div>
                      <label className="text-[#667085]">Video</label>
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => onChange(e.target.files[0])}
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
                                    <img src={URL.createObjectURL(value)} alt="Selected Image" width={"100"}
                                         height={"100"}
                                         className="w-full object-center object-contain"/>
                                  </span>
                          ) : (
                            <div className={"w-full flex flex-col justify-center items-center gap-4"}>
                                    <span
                                      className={"flex items-center justify-center rounded-full w-9 h-9 bg-green-100 text-green-600 p-2"}>
                                      <IconPhoto className={"icon"}/>
                                    </span>
                              <p className={"text-center text-gray-400 text-sm font-normal"}>
                                Logotip rasmni bu yerga sudrab tashlang yoki rasm qo`shish tugmasini bosing
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
                                Logotip rasmini qo‘shish
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
