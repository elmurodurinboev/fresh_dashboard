import CreatePolygon from "@/components/custom/create-polygon.jsx";
import {Layout} from "@/components/custom/layout.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import {useMutation, useQuery} from "@tanstack/react-query";
import {toast} from "@/hooks/use-toast.js";
import CountryService from "@/services/country.service.js";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/custom/button.jsx";
import {useEffect} from "react";

const Index = () => {
  const {id} = useParams()
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      name: "",
      boundary: ""
    },
  });

  const mutation = useMutation({
    mutationFn: CountryService.update,
    onError: (error) => {
      const {
        data: {errors: serverErrors},
        status,
      } = error.response;
      if (status === 422) {
        Object.entries(serverErrors).forEach(([key, value]) => {
          form.setError(key, {
            type: "server",
            message: value[0],
          });
        });
        return;
      }
      toast({
        title: "Error",
        variant: "destructive",
        description: error?.message || "Messages.error_occurred",
      });
    },
    onSuccess: () => {
      toast({
        variant: "success",
        title: "OK",
        description: "Muvaffaqiyatli yangilandi",
      });
      form.reset();
      navigate("/country");
    },
  });

  const countryData = useQuery({
    queryKey: ["getCountryData", id],
    queryFn: CountryService.getById,
    enabled: !!id
  })

  useEffect(() => {
    const {isSuccess, data} = countryData;

    if (isSuccess && data?.result !== 0) {
      form.reset({
        name: data?.result?.name && data?.result?.name,
        boundary: data?.result?.boundary && data?.result?.boundary
      });
    }
  }, [countryData.isSuccess, countryData.data?.result]);

  const onSubmit = (data) => {
    data.id = id
    mutation.mutate(data);
  };
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header/>

      <Layout.Body>
        <div className="mb-2 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Hudud yaratish
            </h2>
          </div>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={"flex flex-col gap-4"}
          >
            <Controller
              control={form.control}
              name="name"
              rules={{required: "Bu maydon to'ldirilishi shart!"}}
              render={({field, fieldState: {error}}) => (
                <div className="space-y-1 flex-1">
                  <Label className={"text-[#667085]"}>
                    Hudud nomi
                  </Label>
                  <>
                    <Input placeholder="Evos" {...field} />
                  </>
                  {error && (
                    <p className="text-red-500">{error.message}</p>
                  )}
                </div>
              )}
            />
            <Controller
              control={form.control}
              name="boundary"
              rules={{required: "Bu maydon to'ldirilishi shart!"}}
              render={({field, fieldState: {error}}) => (
                <div className="space-y-1 flex-1 flex flex-col gap-2">
                  <Label className={"text-[#667085]"}>
                    Hududni chizing
                  </Label>
                  <CreatePolygon setValue={field.onChange} value={field.value}/>
                  {error && (
                    <p className="text-red-500">{error.message}</p>
                  )}
                </div>
              )}
            />
            <div className={"flex gap-4"}>
              <Button
                size={"lg"}
                type={"submit"}
                loading={mutation.isPending}
              >
                Saqlash
              </Button>

              <Button
                size={"lg"}
                type={"reset"}
                variant={"outline"}
                onClick={() => navigate("/restaurants")}
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