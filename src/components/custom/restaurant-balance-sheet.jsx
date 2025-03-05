import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet"
import {Controller, useForm} from "react-hook-form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import InputWithFormat from "@/components/custom/input-with-format.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {Button} from "@/components/custom/button.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import CashFlowService from "@/services/cash-flow.service.js";
import {toast} from "@/hooks/use-toast.js";
import RestaurantService from "@/services/restaurant.service.js";
import {IconWallet} from "@tabler/icons-react";
import {useState} from "react";
import {useAuth} from "@/hooks/utils/useAuth.js";
import ROLES from "@/data/roles.js";

const RestaurantBalanceSheet = () => {
  const {session: {user}} = useAuth()
  const [open, setOpen] = useState(false)
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
        variant: "success",
        description: "Muvaffaqiyatli yaratildi"
      })
      form.reset()
      setOpen(false)
    }
  })

  const restaurantsData = useQuery({
    queryKey: ['getRestaurants', 1, 500],
    queryFn: RestaurantService.getAll
  })


  const onSubmit = (data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });
    mutation.mutate(formData)
  }

  if (user.user_role !== ROLES.ADMIN)
    return


  return (
    <Sheet
      open={open}
      onOpenChange={open => {
        if (!open) form.reset()
        setOpen(open)
      }}
    >
      <SheetTrigger>
        <IconWallet size={24}/>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Restoran balans amallari</SheetTitle>
        </SheetHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className={"w-full flex flex-col gap-4 mt-4"}>
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
                        value={field?.value?.toString()}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full text-black">
                          <SelectValue placeholder="Restoranni tanlang"/>
                        </SelectTrigger>
                        <SelectContent>
                          {restaurantsData.data.results.map(
                            (item, index) => (
                              <SelectItem value={item.id.toString()} key={index}>
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
                    value={field?.value?.toString()}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full text-black">
                      <SelectValue placeholder="Amal turini tanlang"/>
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

            {
              form.watch("finance_flow_type") === 'proceeds' && (
                <Controller
                  name="payment_method"
                  control={form.control}
                  defaultValue={"cash"}
                  render={({field, fieldState: {error}}) => (
                    <div className="flex-1">
                      <label className="text-[#667085]">
                        To'lov turi
                      </label>
                      <Select
                        value={field?.value?.toString()}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full text-black">
                          <SelectValue placeholder="Amal turini tanlang"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={"cash"}>
                            Naqd pul
                          </SelectItem>
                          <SelectItem value={"payme"}>
                            Plastik karta
                          </SelectItem>
                          <SelectItem value={"account"} disabled>
                            Restoran hisob raqamidan
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
              )
            }

            <Controller
              name="amount"
              control={form.control}
              rules={{required: "Amount is required"}}
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
            <div className={"flex gap-4"}>
              <Button
                type={'submit'}
                size={"lg"}
                loading={mutation.isPending}
              >
                Yaratish
              </Button>
              <SheetClose
                className={"py-2 px-5 rounded-md border"}
              >
                Bekor qilish
              </SheetClose>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default RestaurantBalanceSheet;