import {Layout} from "@/components/custom/layout.jsx";
import {Button} from "@/components/custom/button.jsx";
import {Controller, useForm} from "react-hook-form";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Input} from "@/components/ui/input.jsx";
import {toast} from "@/hooks/use-toast.js";
import SubcategoryService from "@/services/subcategory.service.js";
import {useNavigate} from "react-router-dom";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import ShopCategoryService from "@/services/shop-category.service.js";
import {Label} from "@/components/ui/label.jsx";


const Index = () => {
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      name: '',
      category: ''
    }
  })

  const mutation = useMutation({
    mutationFn: SubcategoryService.create,
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
      navigate("/subcategory")
    }
  })

  const onSubmit = (data) => {
    mutation.mutate(data)
  }
  const categoryData = useQuery({
    queryKey: ['getAllCategories'],
    queryFn: ShopCategoryService.getAllSub
  })


  return (
    <Layout>
      <Layout.Body>
        <div className="mb-2 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Sub Kategoriya yaratish</h2>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"flex gap-4"}>
            <div className={"w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"}>
              {!categoryData.isLoading ? (
                !categoryData.isError &&
                categoryData.data &&
                categoryData.isSuccess &&
                categoryData.data.result &&
                categoryData.data.result ? (
                  <Controller
                    name="category"
                    control={form.control}
                    defaultValue={""}
                    rules={{required: "Bu maydon tanlanishi shart"}} // Add validation rules here
                    render={({field, fieldState: {error}}) => (
                      <div className="flex-1">
                        <label className="text-[#667085]">
                          Kategoriya
                        </label>
                        <Select
                          value={+field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full text-black">
                            <SelectValue placeholder="Select subcategory"/>
                          </SelectTrigger>
                          <SelectContent>
                            {categoryData.data.result.map(
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
                control={form.control}
                name="name"
                rules={{required: "Bu maydon to'ldirilishi shart!"}} // Add validation rules here
                render={({field, fieldState: {error}}) => (
                  <div className="space-y-1">
                    <Label className={"text-[#667085]"}>Sub Kategoriya nomi</Label>
                    <div>
                      <Input placeholder="Evos" {...field} />
                    </div>
                    {error && (
                      <p className="text-red-500 text-sm">
                        {error.message}
                      </p>
                    )}
                  </div>
                )}
              />
              <div className={"space-x-4"}>
                <Button
                  type={'submit'}
                  size={"lg"}
                  loading={mutation.isPending}
                >
                  Qo`shish
                </Button>
                <Button
                  variant={'outline'}
                  size={"lg"}
                  onClick={() => navigate("/subcategory")}
                >
                  Bekor qilish
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Layout.Body>
    </Layout>
  );
};

export default Index;