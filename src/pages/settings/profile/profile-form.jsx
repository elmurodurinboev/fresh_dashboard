import { useNavigate} from "react-router-dom"
import {useForm} from "react-hook-form"
import {Button} from "@/components/custom/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"

import {toast} from "@/hooks/use-toast.js"
import {useAuth} from "@/hooks/utils/useAuth.js";
import {Formatter} from "@/utils/formatter.js";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {UserTypes} from "@/data/user-types.jsx";
import {useMutation} from "@tanstack/react-query";
import {AuthService} from "@/services/auth.service.js";


export default function ProfileForm() {
  const {session} = useAuth()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      full_name: session?.user?.full_name,
      phone_number: session?.user?.phone_number && Formatter.formatPhoneNumber(session.user.phone_number),
      user_role: session?.user?.user_role,
      gender: session?.user?.gender
    }
  })


  function onSubmit() {

  }

  const mutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: AuthService.logoutAuth,
    onSuccess: () => {
      navigate("/auth/login")
      toast({
        description: "Logged Out"
      })
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="full_name"
          render={({field}) => (
            <FormItem>
              <FormLabel>Ism</FormLabel>
              <FormControl>
                <Input placeholder="User" readOnly {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone_number"
          render={({field}) => (
            <FormItem>
              <FormLabel>Telefon raqam</FormLabel>
              <FormControl>
                <Input placeholder="Tel" readOnly {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="user_role"
          render={({field}) => (
            <FormItem className="space-y-1">
              <FormLabel>User rol</FormLabel>
              <FormControl>
                <Select {...field} disabled>
                  <SelectTrigger>
                    <SelectValue placeholder={"Tanlang"}/>
                  </SelectTrigger>
                  <SelectContent>
                    {
                      UserTypes && UserTypes.length > 0 && (
                        UserTypes.map((item, index) => (
                          <SelectItem
                            key={index}
                            value={item.user_role}
                          >
                            {item.name}
                          </SelectItem>
                        ))
                      )
                    }
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({field}) => (
            <FormItem className="space-y-1">
              <FormLabel>Jins</FormLabel>
              <FormControl>
                <Select value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder={'Tanlang'}/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"male"}>Erkak</SelectItem>
                    <SelectItem value={"female"}>Ayol</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <div className={"space-x-4"}>
          <Button type="submit" disabled>Saqlash</Button>
          <Button
            type="button"
            variant={"destructive"}
            loading={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            Chiqish
          </Button>
        </div>
      </form>
    </Form>
  )
}
