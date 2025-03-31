import {Layout} from "@/components/custom/layout.jsx";
import {Button} from "@/components/custom/button.jsx";
import {IconPhoto, IconPlus} from "@tabler/icons-react";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {useNavigate} from "react-router-dom";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {useMutation} from "@tanstack/react-query";
import {Input} from "@/components/ui/input.jsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/hooks/use-toast.js";
import PhoneInput from "@/components/custom/phone-input.jsx";
import {PasswordInput} from "@/components/custom/password-input.jsx";
import CourierService from "@/services/courier.service.js";


const formSchema = z.object({
  full_name: z
    .string()
    .min(3, {message: 'Name must be at least 3'}),
  image: z
    .any(),
  phone_number: z
    .string()
    .min(9, {message: "Telefon raqaminggizni to`liq kiriting"}),
  birth_date: z
    .string(),
  gender: z
    .string(),
  password: z
    .string()
    .min(8, {message: "Parol kamida 8 ta belgidan iborat bo'lishi zarur"}),
  car_name: z
    .string()
    .min(3, {message: "Mashina nomi to'ldirilishi shart. Kamida 3ta harf"}),
  car_number: z
    .string()
    .min(3, {message: "Mashina raqami to'ldirilishi shart. Kamida 3ta harf"}),
  address: z
    .string()
    .min(3, {message: "Manzil to'ldirilishi shart. Kamida 3ta harf"}),
  jshir: z
    .string()
    .min(3, {message: "JSHSHIR to'ldirilishi shart. Kamida 3ta harf"}),
  bag_number: z
    .string()
    .min(3, {message: "Sumka raqami to'ldirilishi shart. Kamida 3ta harf"}),
  driver_license: z
    .string()
    .min(3, {message: "Ruhsatnoma raqami to'ldirilishi shart. Kamida 3ta harf"}),
  driver_license_date: z
    .string()
})

const Index = () => {
  const navigate = useNavigate()
  const [isDragged, setIsDragged] = useState(false)
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      image: null,
      phone_number: '',
      birth_date: '',
      gender: "",
      password: '',
      car_name: "",
      car_number: "",
      address: "",
      jshir: "",
      bag_number: "",
      driver_license: "",
      driver_license_date: ""
    }
  })

  const mutation = useMutation({
    mutationFn: CourierService.create,
    onError: (error) => {
      console.log(error)
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
      navigate("/courier")
    }
  })

  const onSubmit = (data) => {
    console.log(data)
    data.phone_number = (`+998${data.phone_number}`).toString().trim()
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });
    mutation.mutate(formData)
  }


  return (
    <Layout>
      <Layout.Body>
        <div className="mb-2 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Kuryer yaratish</h2>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={"grid grid-cols-12 gap-4"}>
              <div className={"col-span-12 lg:col-span-8 flex flex-col gap-4"}>
                <div className={"w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"}>

                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({field}) => (
                      <FormItem className="space-y-1">
                        <FormLabel className={"text-[#667085]"}>Kuryer to`liq ismi</FormLabel>
                        <FormControl>
                          <Input placeholder="John doe" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jshir"
                    render={({field}) => (
                      <FormItem className="space-y-1">
                        <FormLabel className={"text-[#667085]"}>JSHSHIR</FormLabel>
                        <FormControl>
                          <Input placeholder="58012015670042" type={"number"} {...field} />
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
                        <FormLabel>Parol</FormLabel>
                        <FormControl>
                          <PasswordInput placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({field}) => (
                      <FormItem className="space-y-1">
                        <FormLabel className={"text-[#667085]"}>Yashash manzili</FormLabel>
                        <FormControl>
                          <Input placeholder="Urganch shahri" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

                  <div className={"grid grid-cols-12 gap-4"}>

                    <div className={"col-span-6"}>
                      <FormField
                        control={form.control}
                        name="phone_number"
                        render={({field}) => (
                          <FormItem className="space-y-1">
                            <FormLabel>Telefon raqam</FormLabel>
                            <FormControl>
                              <div className="relative flex items-center">
                                <span className="absolute left-2 text-sm">+99 8</span>
                                <PhoneInput
                                  {...field}
                                  onChange={() => {
                                  }}
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
                    </div>
                    <div className={"col-span-6"}>
                      <FormField
                        control={form.control}
                        name="bag_number"
                        render={({field}) => (
                          <FormItem className="space-y-1">
                            <FormLabel className={"text-[#667085]"}>Sumka raqami</FormLabel>
                            <FormControl>
                              <Input placeholder="UZ1215" type={"text"} {...field} />
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>


                  <div className={"grid grid-cols-12 gap-4"}>
                    <div className={"col-span-6"}>
                      <FormField
                        control={form.control}
                        name="driver_license"
                        render={({field}) => (
                          <FormItem className="flex flex-col gap-1">
                            <FormLabel>Haydovchilik ruhsatnomasi raqami</FormLabel>
                            <FormControl>
                              <Input placeholder={"AD123123"} {...field} />
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className={"col-span-6"}>
                      <FormField
                        control={form.control}
                        name="driver_license_date"
                        render={({field}) => (
                          <FormItem className="space-y-1">
                            <FormLabel>Haydovchili ruhsatnoma berilgan sana</FormLabel>
                            <FormControl>
                              <Input placeholder="1999-22-12" type={'date'} {...field} className={"w-auto"}/>
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className={"grid grid-cols-12 gap-3"}>
                    <div className={"col-span-6"}>
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({field}) => (
                          <FormItem className="space-y-1">
                            <FormLabel>Jins</FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={val => field.onChange(val)}>
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
                    </div>
                    <div className={"col-span-6"}>
                      <FormField
                        control={form.control}
                        name="birth_date"
                        render={({field}) => (
                          <FormItem className="space-y-1">
                            <FormLabel>Tug`ilgan sana</FormLabel>
                            <FormControl>
                              <Input placeholder="1999-22-12" type={'date'} {...field} className={"w-auto"}/>
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className={"grid grid-cols-12 gap-4"}>
                    <div className={"col-span-6"}>
                      <FormField
                        control={form.control}
                        name="car_name"
                        render={({field}) => (
                          <FormItem className="flex flex-col gap-1">
                            <FormLabel>Mashina modeli</FormLabel>
                            <FormControl>
                              <Input placeholder={"Chevrolet Gentra"} {...field} />
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className={"col-span-6"}>
                      <FormField
                        control={form.control}
                        name="car_number"
                        render={({field}) => (
                          <FormItem className="flex flex-col gap-1">
                            <FormLabel>Mashina raqami</FormLabel>
                            <FormControl>
                              <Input placeholder={"01A123AC"} {...field} />
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/*Product Image*/}
              <div className={"col-span-12 lg:col-span-4 flex flex-col gap-3"}>
                <div className={"flex flex-col bg-white rounded-2xl shadow p-6"}>
                  <FormField
                    name="image"
                    control={form.control}
                    render={
                      ({field: {onChange, value, ...field}}) => (
                        <FormItem>
                          <FormLabel className={"text-[#667085]"}>Foydalanuvchi rasmi</FormLabel>
                          <FormControl>
                            <div
                              className={`w-full border-2 border-dashed flex p-4 flex-col items-center justify-center rounded-md cursor-pointer gap-4 ${isDragged ? 'border-primary' : ''}`}
                              onDragEnter={(e) => {
                                e.preventDefault();
                                setIsDragged(true);
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragged(true);
                              }}
                              onDragLeave={() => {
                                setIsDragged(false);
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                setIsDragged(false);
                                onChange(e.dataTransfer.files[0]);
                              }}
                            >
                              {
                                value ? (
                                  <span className={"w-full min-h-max rounded-md overflow-hidden"}>
                        <img src={URL.createObjectURL(value)} alt="Selected Image" width={"100"} height={"100"}
                             className="w-full object-center object-contain"/>
                      </span>) : (
                                  <div className={"w-full flex flex-col justify-center items-center gap-4"}>
                      <span
                        className={"flex items-center justify-center rounded-full w-9 h-9 bg-green-100 text-green-600 p-2"}>
                        <IconPhoto className={"icon"}/>
                      </span>
                                    <p className={"text-center text-gray-400 text-sm font-normal"}>
                                      Rasmni bu yerga sudrab tashlang yoki rasm qo`shish tugmasini bosing
                                    </p>
                                  </div>
                                )}
                              <input
                                {...field}
                                type="file"
                                id={"imageField"}
                                className={"hidden"}
                                accept={"image/png, image/jpeg, image/jpg, image/heic"}
                                value={value?.fileName}
                                onChange={(e) => onChange(e.target.files[0])}
                              />
                              {
                                value ? (
                                    <div className={"w-full flex gap-4 items-center"}>
                                      <Button
                                        type={"button"}
                                        variant={"danger"}
                                        className={"w-1/2"}
                                        onClick={() => onChange(null)} // This line clears the selected image
                                      >
                                        O`chirish
                                      </Button>
                                      <label
                                        htmlFor={"imageField"}
                                        className={"w-1/2 h-10 py-[10px] px-3 font-medium text-brand bg-secondary border-none flex items-center transition-all justify-center gap-2 rounded-md cursor-pointer"}
                                      >
                                        Almashtirish
                                      </label>
                                    </div>) :
                                  (
                                    <label
                                      htmlFor={"imageField"}
                                      className={"h-10 py-[10px] px-3 font-medium text-green-600 bg-green-50 border-none flex items-center hover:bg-green-500 hover:text-white transition-all justify-center gap-2 rounded-md cursor-pointer"}
                                    >
                                      <IconPlus className={"w-5 h-5"}/>
                                      Rasm qo‘shish
                                    </label>)}
                            </div>
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )
                    }
                  />
                </div>
                <Button
                  size={"xl"}
                  type={"submit"}
                  className={"w-full"}
                  loading={mutation.isPending}
                >
                  Saqlash
                </Button>

                <Button
                  size={"xl"}
                  type={"reset"}
                  variant={"outline"}
                  onClick={() => navigate("/users")}
                  className={"w-full gap-2 items-center"}
                >
                  Bekor qilish
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Layout.Body>
    </Layout>
  );
};

export default Index;