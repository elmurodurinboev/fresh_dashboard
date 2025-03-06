import { Layout } from "@/components/custom/layout.jsx";
import { Button } from "@/components/custom/button.jsx";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input.jsx";
import { toast } from "@/hooks/use-toast.js";
import SubcategoryService from "@/services/subcategory.service.js";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import ShopCategoryService from "@/services/shop-category.service.js";
import { Label } from "@/components/ui/label.jsx";
import { IconPhoto, IconPlus, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import ShopService from "@/services/shop.service";
import { useAuth } from "@/hooks/utils/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const [isDragged, setIsDragged] = useState(false);
  const form = useForm({
    defaultValues: {
      name: "",
      category: "",
      image: "",
    },
  });

  const [shopId, setShopId] = useState(null);
  const [filterCategory, setFilteredCategory] = useState([]);

  const mutation = useMutation({
    mutationFn: SubcategoryService.create,
    onError: (error) => {
      const {
        data: { errors: serverErrors },
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
        description: error.message || "Messages.error_occurred",
      });
    },
    onSuccess: () => {
      toast({
        title: "OK",
        variant: "success",
        description: "Muvaffaqiyatli qo'shildi",
      });
      form.reset();
      navigate("/subcategory");
    },
  });

  const { session } = useAuth();

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });
    mutation.mutate(formData);
  };
  const categoryData = useQuery({
    queryKey: ["getAllCategories"],
    queryFn: ShopCategoryService.getAllSub,
  });

  useEffect(() => {
    if (categoryData.isSuccess && categoryData.data?.result) {
      setFilteredCategory(
        shopId ? categoryData.data.result.filter((c) => c.shop === +shopId) : []
      );
    }
  }, [shopId, categoryData.data, categoryData.isSuccess]);

  const shopData = useQuery({
    queryKey: ["getShops"],
    queryFn: ShopService.getAll,
    enabled: !!session?.user?.user_role === "admin",
  });

  return (
    <Layout>
      <Layout.Body>
        <div className="mb-2 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Sub Kategoriya yaratish
            </h2>
          </div>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={"grid grid-cols-12 gap-4"}
          >
            <div
              className={
                "col-span-12 lg:col-span-8 flex flex-col gap-4 justify-start"
              }
            >
              {session?.user?.user_role === "admin" &&
                (shopData.isLoading ? (
                  <Skeleton className={"col-span-9 h-9 rounded-md"} />
                ) : shopData.isError || !shopData.data?.result?.results ? (
                  <span className={"text-rose-500"}>Nimadir xato ketdi!</span>
                ) : (
                  <div
                    className={
                      "w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"
                    }
                  >
                    <label className="text-[#667085]">Do`kon</label>
                    <Select
                      value={+shopId}
                      onValueChange={(val) => setShopId(val)}
                    >
                      <SelectTrigger
                        className={`${
                          shopId ? "text-black" : "!text-gray-500"
                        }`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {shopData.data.result.results.map((item, index) => (
                          <SelectItem value={item.id.toString()} key={index}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}

              {!categoryData.isLoading ? (
                categoryData.isError || !categoryData.data?.result ? (
                  <span className={"text-rose-500"}>Nimadir xato ketdi!</span>
                ) : (
                  <Controller
                    name="category"
                    control={form.control}
                    defaultValue={""}
                    rules={{ required: "Bu maydon tanlanishi shart" }}
                    render={({ field, fieldState: { error } }) => (
                      <div
                        className={
                          "w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"
                        }
                      >
                        <label className="text-[#667085]">Kategoriya</label>
                        <Select
                          value={field?.value?.toString()}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            className={`${
                              field.value ? "text-black" : "!text-gray-500"
                            }`}
                          >
                            <SelectValue placeholder={"Kategoriyani tanlang"} />
                          </SelectTrigger>
                          <SelectContent>
                            {session?.user?.user_role === "admin"
                              ? filterCategory.map((item, index) => (
                                  <SelectItem value={item.id.toString()} key={index}>
                                    {item.name}
                                  </SelectItem>
                                ))
                              : categoryData.data.result.map((item, index) => (
                                  <SelectItem value={item.id.toString()} key={index}>
                                    {item.name}
                                  </SelectItem>
                                ))}
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
                )
              ) : (
                <Skeleton className={"col-span-9 h-9 rounded-md"} />
              )}

              <Controller
                control={form.control}
                name="name"
                rules={{ required: "Bu maydon to'ldirilishi shart!" }} // Add validation rules here
                render={({ field, fieldState: { error } }) => (
                  <div
                    className={
                      "w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"
                    }
                  >
                    <Label className={"text-[#667085]"}>
                      Sub Kategoriya nomi
                    </Label>
                    <div>
                      <Input placeholder="Evos" {...field} />
                    </div>
                    {error && (
                      <p className="text-red-500 text-sm">{error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
            {/*Product Image*/}
            <div className={"col-span-12 lg:col-span-4 flex flex-col gap-3"}>
              <div className={"flex flex-col bg-white rounded-2xl shadow p-6"}>
                <Controller
                  name="image"
                  control={form.control}
                  rules={{
                    required: "Bu maydon to'ldirilishi shart!",
                    validate: (value) => {
                      if (value) {
                        const allowedTypes = [
                          "image/png",
                          "image/jpeg",
                          "image/jpg",
                          "image/heic",
                        ];
                        if (!allowedTypes.includes(value.type)) {
                          return "Faqat PNG, JPEG, JPG yoki HEIC formatidagi rasmlar qo'shish mumkin.";
                        }
                        if (value.size > 5 * 1024 * 1024) {
                          return "Rasm hajmi 5MB dan oshmasligi kerak.";
                        }
                      }
                      return true;
                    },
                  }}
                  render={({
                    field: { onChange, value, ...field },
                    fieldState: { error },
                  }) => (
                    <div>
                      <Label className={"text-[#667085]"}>
                        Kategoriya rasmi
                      </Label>
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
                        {value ? (
                          <span
                            className={
                              "w-full min-h-max rounded-md overflow-hidden"
                            }
                          >
                            <img
                              src={URL.createObjectURL(value)}
                              alt="Selected Image"
                              width={"100"}
                              height={"100"}
                              className="w-full object-center object-contain"
                            />
                          </span>
                        ) : (
                          <div
                            className={
                              "w-full flex flex-col justify-center items-center gap-4"
                            }
                          >
                            <span
                              className={
                                "flex items-center justify-center rounded-full w-9 h-9 bg-green-100 text-green-600 p-2"
                              }
                            >
                              <IconPhoto className={"icon"} />
                            </span>
                            <p
                              className={
                                "text-center text-gray-400 text-sm font-normal"
                              }
                            >
                              Rasmni bu yerga sudrab tashlang yoki rasm qo`shish
                              tugmasini bosing
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
                              onClick={() => onChange(null)}
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
                            <IconPlus className={"w-5 h-5"} />
                            Rasm qo‘shish
                          </label>
                        )}
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
                loading={mutation.isPending}
                className={"w-full"}
              >
                Saqlash
              </Button>

              <Button
                size={"xl"}
                type={"reset"}
                variant={"outline"}
                onClick={() => navigate("/subcategory")}
                className={"w-full gap-2 items-center"}
              >
                <IconX className={"w-5 h-5"} />
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
