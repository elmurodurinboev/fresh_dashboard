import {Layout} from "@/components/custom/layout.jsx";
import {Button} from "@/components/custom/button.jsx";
import {IconPhoto, IconPlus, IconX} from "@tabler/icons-react";
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
import {UserTypes} from "@/data/user-types.jsx";
import PhoneInput from "@/components/custom/phone-input.jsx";
import {PasswordInput} from "@/components/custom/password-input.jsx";
import {Switch} from "@/components/ui/switch.jsx";
import UserService from "@/services/user.service.js";


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
  user_role: z
    .string()
    .min(3),
  is_active: z
    .boolean()
    .default(false),
  is_staff: z
    .boolean()
    .default(false),
  password: z
    .string()
    .min(8, {message: "Parol kamida 8 ta belgidan iborat bo'lishi zarur"})
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
      gender: null,
      user_role: null,
      is_active: true,
      is_staff: true,
      password: '',
    }
  })

  const mutation = useMutation({
    mutationFn: UserService.create,
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
        description: "Successfully added"
      })
      form.reset()
    }
  })

  const onSubmit = (data) => {
    const formData = new FormData()
    Object.keys(data).forEach(item => formData.append(item, data[item]))
    mutation.mutate(formData)
  }


  return (
    <Layout>
      <Layout.Body>
        <div className="mb-2 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Foydalanuvchi yaratish</h2>
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
                        <FormLabel className={"text-[#667085]"}>Foydalanuvchi to`liq ismi</FormLabel>
                        <FormControl>
                          <Input placeholder="John doe" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

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
                              className="pl-12 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                              mask="00 000 0000"
                              placeholder="90 000 0000"
                              onAccept={(val, mask) => {
                                field.onChange(mask.unmaskedValue);
                              }}
                              autoComplete="off"
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
                    name="user_role"
                    render={({field}) => (
                      <FormItem className="space-y-1">
                        <FormLabel>User rol</FormLabel>
                        <FormControl>
                          <Select {...field} onValueChange={val => field.onChange(val)}>
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
                  <div className={"grid grid-cols-12 gap-3"}>
                    <div className={"col-span-6"}>
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({field}) => (
                          <FormItem className="space-y-1">
                            <FormLabel>Jins</FormLabel>
                            <FormControl>
                              <Select  value={field.value} onValueChange={val => field.onChange(val)} >
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
                  <div className={"grid grid-cols-12"}>
                    <div className={"col-span-6"}>
                      <FormField
                        control={form.control}
                        name="is_active"
                        render={({field}) => (
                          <FormItem className="flex flex-col gap-1">
                            <FormLabel>Aktiv</FormLabel>
                            <FormControl>
                              <Switch {...field} onCheckedChange={val => field.onChange(val)} />
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className={"col-span-6"}>
                      <FormField
                        control={form.control}
                        name="is_stuff"
                        render={({field}) => (
                          <FormItem className="flex flex-col gap-1">
                            <FormLabel>Admin paneldan foydalanish</FormLabel>
                            <FormControl>
                              <Switch {...field} onCheckedChange={val => field.onChange(val)} />
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
                >
                  save
                </Button>

                <Button
                  size={"xl"}
                  type={"reset"}
                  variant={"outline"}
                  onClick={() => navigate("/users")}
                  className={"w-full gap-2 items-center"}
                >
                  <IconX className={"w-5 h-5"}/>
                  cancel
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