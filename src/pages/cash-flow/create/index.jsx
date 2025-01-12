import {Layout} from "@/components/custom/layout.jsx";
import {Button} from "@/components/custom/button.jsx";
import {Controller, useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import {toast} from "@/hooks/use-toast.js";
import RestaurantService from "@/services/restaurant.service.js";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import CashFlowService from "@/services/cash-flow.service.js";
import InputWithFormat from "@/components/custom/input-with-format.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";

const Index = () => {
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      restaurant: null,
      amount: '',
      finance_flow_type: "proceeds",
      comment: ''
    }
  })

  const mutation = useMutation({
    mutationFn: CashFlowService.create,
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
        variant: 'destructive',
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

  const restaurantsData = useQuery({
    queryKey: ['getRestaurants'],
    queryFn: RestaurantService.getAll
  })

  console.log(restaurantsData.data)


  const onSubmit = (data) => {
    const formData = new FormData()
    Object.keys(data).forEach(item => item !== 'image' && formData.append(item, data[item]))

    data.image && formData.append("image", data.image)
    mutation.mutate(formData)
  }

  return (
    <Layout>
      <Layout.Body>
        <div className="mb-2 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Kirim chiqim yaratish</h2>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"grid grid-cols-12 gap-4"}>
            <div className={"col-span-12 lg:col-span-8 flex flex-col gap-4"}>
              <div className={"w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"}>
                {!restaurantsData.isLoading ? (
                  !restaurantsData.isError &&
                  restaurantsData.data &&
                  restaurantsData.isSuccess &&
                  restaurantsData.data.results ? (
                    <Controller
                      name="restaurant"
                      control={form.control}
                      defaultValue={""}
                      rules={{required: "Restoran tanlanishi shart!"}} // Add validation rules here
                      render={({field, fieldState: {error}}) => (
                        <div className="flex-1">
                          <label className="text-[#667085]">
                            Restoranni tanlang
                          </label>
                          <Select
                            value={+field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full text-black">
                              <SelectValue placeholder="Select subcategory"/>
                            </SelectTrigger>
                            <SelectContent>
                              {restaurantsData.data.results.map(
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
                  name="finance_flow_type"
                  control={form.control}
                  defaultValue={"proceeds"}
                  rules={{required: "Turi tanlanishi shart!"}} // Add validation rules here
                  render={({field, fieldState: {error}}) => (
                    <div className="flex-1">
                      <label className="text-[#667085]">
                        Turi
                      </label>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full text-black">
                          <SelectValue placeholder="Select type"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={"proceeds"}>
                            Balansni to`ldirish
                          </SelectItem>
                          <SelectItem value={"expense"}>
                            Naqd pul qilish
                          </SelectItem>
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

                <Controller
                  name="amount"
                  control={form.control}
                  rules={{required: "Price is required"}}
                  render={({field, fieldState: {error}}) => (
                    <div>
                      <label className="text-[#667085]">Miqdori</label>
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
                  name="comment"
                  control={form.control}
                  rules={{required: false}}
                  render={({field, fieldState: {error}}) => (
                    <div>
                      <label className="text-[#667085]">Sharh</label>
                      <Textarea placeholder="..." className={"resize-none"} {...field} rows={5}/>
                      {error && (
                        <p className="text-red-500 text-sm">{error.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
            <div className={"flex gap-4"}>
              <Button
                type={'submit'}
                size={"lg"}
                loading={mutation.isPending}
              >
                Qo`shish
              </Button>
              <Button
                type={"button"}
                variant={'outline'}
                size={"lg"}
                onClick={() => navigate("/cash-flow")}
              >
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