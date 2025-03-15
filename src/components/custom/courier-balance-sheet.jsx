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
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "@/hooks/use-toast.js";
import {IconWallet} from "@tabler/icons-react";
import {useState} from "react";
import {useAuth} from "@/hooks/utils/useAuth.js";
import ROLES from "@/data/roles.js";
import CourierService from "@/services/courier.service.js";
import SelectComponent from "@/components/custom/select-component.jsx";

const RestaurantBalanceSheet = () => {
  const {session: {user}} = useAuth()
  const [open, setOpen] = useState(false)
  const [transactionType, setTransactionType] = useState("plus")
  const form = useForm({
    defaultValues: {
      courier: '',
      amount: '',
      description: ''
    }
  })

  const queryClient = useQueryClient()

  const mutationPlus = useMutation({
    mutationFn: CourierService.transactionPlus,
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
      queryClient.invalidateQueries(['getAllCourierTransactions']).then(r => r)
      form.reset()
      setOpen(false)
    }
  })

  const mutationMinus = useMutation({
    mutationFn: CourierService.transactionMinus,
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
      queryClient.invalidateQueries(['getAllCourierTransactions']).then(r => r)
      form.reset()
      setOpen(false)
    }
  })

  const couriersData = useQuery({
    queryKey: ['getCouriers', 1, 500],
    queryFn: CourierService.getAll
  })


  const onSubmit = (data) => {
    data.amount = Number(data.amount)
    if (transactionType && transactionType === 'plus') return mutationPlus.mutate(data)
    else return mutationMinus.mutate(data)
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
      <SheetTrigger className={"bg-primary px-3 py-2 text-white rounded-md"}>
        <IconWallet size={24}/>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Kuryer balans amallari</SheetTitle>
        </SheetHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className={"w-full flex flex-col gap-4 mt-4"}>
            {!couriersData.isLoading ? (
              !couriersData.isError &&
              couriersData.data &&
              couriersData.isSuccess &&
              couriersData.data.results ? (
                <Controller
                  name="courier"
                  control={form.control}
                  defaultValue={""}
                  rules={{required: "Kuryer tanlanishi shart!"}} // Add validation rules here
                  render={({field, fieldState: {error}}) => (
                    <div className="flex-1">
                      <label className="text-[#667085]">
                        Kuryerni tanlang
                      </label>
                      <SelectComponent
                        hasError={!!error}
                        value={field.value}
                        onChange={field.onChange}
                        options={couriersData?.data?.results}
                        labelName={"full_name"}
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

            <div className="flex-1">
              <label className="text-[#667085]">
                Tranzaksiya turi
              </label>
              <Select
                value={transactionType}
                onValueChange={setTransactionType}
              >
                <SelectTrigger className="w-full text-black">
                  <SelectValue placeholder="Restoranni tanlang"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"plus"}>
                    Balansni to'ldirish
                  </SelectItem>
                  <SelectItem value={"minus"}>
                    Balansdan yechish
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

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
              name="description"
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
                loading={mutationMinus.isPending || mutationPlus.isPending}
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