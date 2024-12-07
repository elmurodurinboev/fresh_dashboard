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
import {Input} from "@/components/ui/input"
import {Button} from "@/components/custom/button"
import {PasswordInput} from "@/components/custom/password-input"
import {cn} from "@/lib/utils"
import {useNavigate, useSearchParams} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {AuthService} from "@/services/auth.service.js";
import {toast} from "@/hooks/use-toast.js";

const formSchema = z.object({
  phone_number: z
    .string()
    .min(13, {message: "Please enter your number"})
    .max(13, {message: "Please enter the real number"}),
  password: z
    .string()
    .min(1, {
      message: "Please enter your password"
    })
    .min(7, {
      message: "Password must be at least 7 characters long"
    })
})

export function UserAuthForm({className, ...props}) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: ""
    }
  })

  const [searchParams] = useSearchParams()
  const [globalError, setGlobalError] = useState()
  const navigate = useNavigate()


  const mutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      console.log(data)

      setIsLoading(false)
      setGlobalError()

      AuthService.setAuthSession(data)

      if (searchParams.has(`callbackUrl`)) {
        navigate(searchParams.get(`callbackUrl`))
        return
      }
      navigate("/")
    },
    onError: error => {
      setIsLoading(false)

      console.log(error)
      toast(({
        variant: 'destructive',
        title: "Error",
        description: error && error.message ? error.message : "Something went wrong"
      }))
    }
  })


  function onSubmit(data) {
    console.log("data===", data)
    setIsLoading(true)

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
              render={({field}) => (
                <FormItem className="space-y-1">
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder="998900000000" {...field} />
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
            {/*{globalError && (*/}
            {/*  <p>{globalError}</p>*/}
            {/*)}*/}
            <Button className="mt-2" loading={isLoading} disabled={mutation.isPending}>
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
