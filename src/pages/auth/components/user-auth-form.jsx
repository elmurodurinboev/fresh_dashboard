import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/custom/button"
import { PasswordInput } from "@/components/custom/password-input"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  login: z
    .string()
    .min(12, { message: "Please enter your number" })
    .max(12, {message: "Please enter the real number"}),
  password: z
    .string()
    .min(1, {
      message: "Please enter your password"
    })
    .min(7, {
      message: "Password must be at least 7 characters long"
    })
})

export function UserAuthForm({ className, ...props }) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: ""
    }
  })

  function onSubmit(data) {
    setIsLoading(true)
    console.log(data)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="login"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Login</FormLabel>
                  <FormControl>
                    <Input placeholder="998900000000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-2" loading={isLoading}>
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
