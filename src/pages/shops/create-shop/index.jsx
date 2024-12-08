import {Layout} from "@/components/custom/layout.jsx";
import {Button} from "@/components/custom/button.jsx";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {useMutation} from "@tanstack/react-query";
import {Input} from "@/components/ui/input.jsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/hooks/use-toast.js";
import ShopService from "@/services/shop.service.js";


const formSchema = z.object({
  name: z
    .string()
    .min(3, {message: 'Name must be at least 3'}),
})

const Index = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    }
  })

  const mutation = useMutation({
    mutationFn: ShopService.create,
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
    }
  })

  const onSubmit = (data) => {
    mutation.mutate(data)
  }

  return (
    <Layout>
      <Layout.Body>
        <div className="mb-2 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Do`kon yaratish</h2>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={"flex gap-4"}>
              <div className={"w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({field}) => (
                    <FormItem className="space-y-1">
                      <FormLabel className={"text-[#667085]"}>Do`kon nomi</FormLabel>
                      <FormControl>
                        <Input placeholder="Evos" {...field} />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
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

                  >
                    Bekor qilish
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </Layout.Body>
    </Layout>
  );
};

export default Index;