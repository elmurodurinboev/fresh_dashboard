import {useState} from "react"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {Button} from "@/components/custom/button"
import {PasswordInput} from "@/components/custom/password-input"
import {cn} from "@/lib/utils"
import {useNavigate, useSearchParams} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {AuthService} from "@/services/auth.service.js";
import {toast} from "@/hooks/use-toast.js";
import PhoneInput from "@/components/custom/phone-input.jsx";

const formSchema = z.object({
  phone_number: z
    .string()
    .min(9, {message: "Yaroqli telefon raqam kiriting!"}),
  password: z
    .string()
    .min(8, {
      message: "Yaroqli parol kiriting"
    })
})

export function UserAuthForm({className, ...props}) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone_number: "",
      password: ""
    }
  })

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()


  const mutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      setIsLoading(false)
      AuthService.setAuthSession(data)

      if (searchParams.has(`callbackUrl`)) {
        navigate(searchParams.get(`callbackUrl`))
        return
      }
      navigate("/")
    },
    onError: error => {
      setIsLoading(false)
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
        variant: "destructive",
        title: "Error",
        description: error.message || "Xatolik yuz berdi!"
      })
    }
  })

  function onSubmit(data) {
    setIsLoading(true)
    data.phone_number = `+998${data.phone_number}`
    mutation.mutate(data)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <span className="absolute left-2 text-sm">+99 8</span>
                      <PhoneInput
                        {...field}
                        onChange={() => {}}
                        mask="00 000 0000"
                        className={"pl-12 flex h-9"}
                        placeholder="90 000 0000"
                        onAccept={(val, mask) => {
                          field.onChange(mask._unmaskedValue);
                        }}
                      />
                    </div>
                    
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem className="space-y-1">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <Button className="mt-2" loading={isLoading} disabled={mutation.isPending}>
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
