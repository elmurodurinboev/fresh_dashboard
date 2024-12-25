import { Layout } from "@/components/custom/layout.jsx";
import { Button } from "@/components/custom/button.jsx";
import { IconPhoto, IconPlus, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.jsx";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Input } from "@/components/ui/input.jsx";
import RestaurantProductService from "@/services/restaurant-product.service.js";
import { toast } from "@/hooks/use-toast.js";
import { Textarea } from "@/components/ui/textarea.jsx";
import RestaurantCategoryService from "@/services/restaurant-category.service.js";
import { Switch } from "@/components/ui/switch.jsx";
import InputWithFormat from "@/components/custom/input-with-format";

const Index = () => {
  const navigate = useNavigate();
  const [isDragged, setIsDragged] = useState(false);
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
    },
  });

  const mutation = useMutation({
    mutationFn: RestaurantProductService.create,
    onError: (error) => {
      console.log(error);
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
        variant: "destructive",
        title: "Error",
        description: error.message || "Messages.error_occurred",
      });
    },
    onSuccess: () => {
      toast({
        title: "OK",
        description: "Successfully added",
      });
      form.reset();
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((item) => formData.append(item, data[item]));

    formData.append("image", data.image ? data.image[0] : "");
    mutation.mutate(formData);
  };

  const categoryData = useQuery({
    queryKey: ["getAllCategory"],
    queryFn: RestaurantCategoryService.getAll,
  });

  return (
    <Layout>
      <Layout.Body>
        <div className="mb-2 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Create Products
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
                        rules={{ required: "Category is required" }} // Add validation rules here
                        render={({ field, fieldState: { error } }) => (
                          <div className="flex-1">
                            <label className="text-[#667085]">
                              Kategoriya nomi
                            </label>
                            <Select
                              value={+field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full text-black">
                                <SelectValue placeholder="Select subcategory" />
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
                    <Skeleton className={"col-span-9 h-9 rounded-md"} />
                  )}

                  <Controller
                    name="is_active"
                    control={form.control}
                    rules={{ required: "This field is required" }}
                    render={({ field, fieldState: { error } }) => (
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
                  rules={{ required: "Name is required" }}
                  render={({ field, fieldState: { error } }) => (
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
                    rules={{ required: "Volume is required" }}
                    render={({ field, fieldState: { error } }) => (
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
                    rules={{ required: "Stock level is required" }}
                    render={({ field, fieldState: { error } }) => (
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
                  rules={{ required: "Price is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <label className="text-[#667085]">Mahsulot narhi</label>
                      <Input
                        placeholder="10"
                        {...field}
                        onChange={(e) => field.onChange(+e.target.value)}
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
                  rules={{ required: "Discount price is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <label className="text-[#667085]">
                        Mahsulotdan ulush
                      </label>
                      <Input
                        placeholder="1000"
                        {...field}
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
                      {error && (
                        <p className="text-red-500 text-sm">{error.message}</p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="description"
                  control={form.control}
                  rules={{ required: "Description is required" }}
                  render={({ field, fieldState: { error } }) => (
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
                  rules={{ required: "Image is required" }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
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
                        {value ? (
                          <img
                            src={URL.createObjectURL(value)}
                            alt="Selected Image"
                            className="w-full object-center object-contain"
                          />
                        ) : (
                          <p className="text-center text-gray-400 text-sm font-normal">
                            Drag and drop an image here or click to upload
                          </p>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => onChange(e.target.files[0])}
                        />
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
                <IconX className={"w-5 h-5"} />
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
