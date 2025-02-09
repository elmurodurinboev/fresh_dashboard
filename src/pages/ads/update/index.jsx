import {Layout} from "@/components/custom/layout.jsx";
import {Button} from "@/components/custom/button.jsx";
import {useForm, Controller} from "react-hook-form";
import {useMutation, useQuery} from "@tanstack/react-query";
import {toast} from "@/hooks/use-toast.js";
import {IconPhoto, IconPlus, IconX} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Label} from "@/components/ui/label.jsx";
import AdsService from "@/services/ads.service.js";

const Index = () => {
  const [isDragged, setIsDragged] = useState(false);
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      image: null
    },
  });


  const mutation = useMutation({
    mutationFn: AdsService.updatePatch,
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
        title: "Error",
        variant: "destructive",
        description: error.message || "Messages.error_occurred",
      });
    },
    onSuccess: () => {
      toast({
        variant: "success",
        title: "OK",
        description: "Muvaffaqiyatli o'zgartirildi",
      });
      form.reset();
      navigate("/ads");
    },
  });
  const params = useParams()

  const adsData = useQuery({
    queryKey: ['getOneAds', params.id],
    queryFn: AdsService.getOne,
    enabled: !!params && !!params.id
  })

  useEffect(() => {
    const {isSuccess, data} = adsData;
    if (isSuccess && data?.result !== 0) {
      form.reset({
        image: data.result.image && data.result.image,
      });
    }
  }, [adsData.isSuccess, adsData.data?.result]);

  const onSubmit = (data) => {
    const formData = new FormData();
    const imgType = typeof data?.image
    data.image && imgType === 'object' && formData.append("image", data.image)
    mutation.mutate({formData, id: params.id});
  };

  return (
    <Layout>
      <Layout.Body>
        <div className="mb-2 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Reklamani Yangilash
            </h2>
          </div>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={"grid grid-cols-12 gap-4"}
          >
            {/*Product Image*/}
            <div className={"col-span-12 flex flex-col gap-3"}>
              <div className={"flex flex-col bg-white rounded-2xl shadow p-6"}>
                <Controller
                  name="image"
                  control={form.control}
                  rules={{required: "Bu maydon to'ldirilishi shart!"}}
                  render={({
                             field: {onChange, value, ...field},
                             fieldState: {error},
                           }) => (
                    <div>
                      <Label className={"text-[#667085]"}>Reklama rasmi</Label>
                      <>
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
                            {...field}
                            type="file"
                            id={"imageField"}
                            className={"hidden"}
                            accept={
                              "image/png, image/jpeg, image/jpg, image/heic"
                            }
                            value={value?.fileName}
                            onChange={(e) => onChange(e.target.files[0])}
                          />
                          {value ? (
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
                                className={
                                  "w-1/2 h-10 py-[10px] px-3 font-medium text-brand bg-secondary border-none flex items-center transition-all justify-center gap-2 rounded-md cursor-pointer"
                                }
                              >
                                Almashtirish
                              </label>
                            </div>
                          ) : (
                            <label
                              htmlFor={"imageField"}
                              className={
                                "h-10 py-[10px] px-3 font-medium text-green-600 bg-green-50 border-none flex items-center hover:bg-green-500 hover:text-white transition-all justify-center gap-2 rounded-md cursor-pointer"
                              }
                            >
                              <IconPlus className={"w-5 h-5"}/>
                              Rasm qo‘shish
                            </label>
                          )}
                        </div>
                      </>
                      {error && <p className="text-red-500">{error.message}</p>}
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
                onClick={() => navigate("/ads")}
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
