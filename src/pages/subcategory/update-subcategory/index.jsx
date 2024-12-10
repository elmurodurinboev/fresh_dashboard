import {Layout} from "@/components/custom/layout.jsx";
import {Button} from "@/components/custom/button.jsx";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Input} from "@/components/ui/input.jsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/hooks/use-toast.js";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import SubcategoryService from "@/services/subcategory.service.js";


const formSchema = z.object({
  name: z
    .string()
    .min(3, {message: 'Name must be at least 3'}),
})

const Index = () => {
  const navigate = useNavigate()
  const params = useParams()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    }
  })

  const subData = useQuery({
    queryKey: ['getOne', params.id],
    queryFn: SubcategoryService.getOne,
    enabled: !!params.id
  })


  useEffect(() => {
    const { isSuccess, data } = subData;

    if (isSuccess && data?.result !== 0) {
      form.reset({
        name: data.result.name
      });
    }
  }, [subData.isSuccess, subData.data?.result]);

  const mutation = useMutation({
    mutationFn: SubcategoryService.update,
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
    mutation.mutate({...data, id: params.id})
  }

  return (
    <Layout>
      <Layout.Body>
        <div className="mb-2 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Sub kategoriyani o`zgartirish</h2>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={"flex gap-4"}>
              <div className={"w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"}>
                {
                  !subData.isLoading ? (
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
                  ) : (
                    <Skeleton className={"w-full h-9 rounded-md"} />
                  )
                }
                <div className={"space-x-4"}>
                  <Button
                    type={'submit'}
                    size={"lg"}
                    loading={mutation.isPending}
                  >
                    Saqlash
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