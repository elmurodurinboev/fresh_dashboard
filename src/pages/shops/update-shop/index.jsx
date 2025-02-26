import {Layout} from "@/components/custom/layout.jsx";
import {Button} from "@/components/custom/button.jsx";
import {Controller, useForm} from "react-hook-form";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Input} from "@/components/ui/input.jsx";
import {toast} from "@/hooks/use-toast.js";
import ShopService from "@/services/shop.service.js";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import CountryService from "@/services/country.service.js";
import {Switch} from "@/components/ui/switch.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {Label} from "@/components/ui/label.jsx";
import PhoneInput from "@/components/custom/phone-input.jsx";
import InputWithFormat from "@/components/custom/input-with-format.jsx";
import LocationPicker from "@/components/custom/location-picker.jsx";

const Index = () => {
  const navigate = useNavigate()
  const params = useParams()
  const [withMap, setWithMap] = useState(false)

  const form = useForm({
    defaultValues: {
      name: '',
      delivery_time: '',
      country: null,
      owner: null,
      description: '',
      is_active: false,
      latitude: "",
      longitude: "",
      opening_time: "",
      closing_time: "",
      address: '',
      phone_number: "",
    }
  })
  const shopData = useQuery({
    queryKey: ['getOne', params.id],
    queryFn: ShopService.getOne,
    enabled: !!params.id
  })


  useEffect(() => {
    const {isSuccess, data} = shopData;

    if (isSuccess && data?.result !== 0) {
      form.reset({
        name: data.result.name ? data.result.name : '',
        delivery_time: data.result.delivery_time ? data.result.delivery_time.match(/\d+/)[0] : null,
        country: data.result.country ? +data.result.country.id : null,
        owner: data.result.owner ? +data.result.owner.id : null,
        description: data.result.description ? data.result.description : '',
        is_active: data.result.is_active ? data.result.is_active : false,
        latitude: data.result.latitude ? data.result.latitude : '',
        longitude: data.result.longitude ? data.result.longitude : '',
        opening_time: data.result.opening_time ? data.result.opening_time : '',
        closing_time: data.result.closing_time ? data.result.closing_time : '',
        address: data.result.address ? data.result.address : '',
        phone_number: data.result.phone_number ? data.result.phone_number : '',
      });
    }
  }, [shopData.isSuccess, shopData.data?.result]);

  const mutation = useMutation({
    mutationFn: ShopService.update,
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
      navigate("/shops")
    }
  })

  const setSelectedLocation = (lat, lng) => {
    form.reset({
      ...form.getValues(),
      latitude: lat,
      longitude: lng
    })
  }

  const onSubmit = (data) => {
    data.id = params.id
    mutation.mutate(data)
  }

  const owners = useQuery({
    queryKey: ["getOwners"],
    queryFn: ShopService.getOwners
  })

  const country = useQuery({
    queryKey: ["getCountries"],
    queryFn: CountryService.getAll
  })

  return (
    <Layout>
      <Layout.Body>
        <div className="mb-2 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Do`konni o`zgartirish</h2>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"w-full gap-4"}>
            <div className={"w-full flex flex-col gap-4"}>
              <div className={"w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"}>
                <div className={"flex items-center justify-between gap-3"}>
                  <Controller
                    control={form.control}
                    name="name"
                    rules={{required: "Bu maydon to'ldirilishi shart!"}}
                    render={({field, fieldState: {error}}) => (
                      <div className="space-y-1 flex-1">
                        <Label className={"text-[#667085]"}>Restaran nomi</Label>
                        <>
                          <Input placeholder="Evos" {...field} />
                        </>
                        {error && <p className="text-red-500">{error.message}</p>}
                      </div>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="is_active"
                    render={({field, fieldState: {error}}) => (
                      <div className="flex flex-col gap-1 items-end pt-2">
                        <Label
                          className={"text-[#667085] flex items-center"}>Aktivligi</Label>
                        <>
                          <Switch {...field} checked={field.value}
                                  onCheckedChange={val => field.onChange(val)}/>
                        </>
                        {error && <p className="text-red-500">{error.message}</p>}
                      </div>
                    )}
                  />
                </div>
                <Controller
                  control={form.control}
                  name="phone_number"
                  rules={{required: "Bu maydon to'ldirilishi shart!"}}
                  render={({field, fieldState: {error}}) => (
                    <div className="space-y-1">
                      <Label>Telefon raqam</Label>
                      <>
                        <div className="relative flex items-center">
                          <span
                            className="absolute left-2.5 top-[9px] text-sm">+998</span>
                          <PhoneInput
                            {...field}
                            onChange={() => {
                            }}
                            mask="00 000 0000"
                            className={"pl-12 flex h-9 items-center"}
                            placeholder="90 000 0000"
                            onAccept={(val, mask) => {
                              field.onChange(mask._unmaskedValue);
                            }}
                          />
                        </div>

                      </>
                      {error && <p className="text-red-500">{error.message}</p>}
                    </div>
                  )}
                />
                {
                  !owners.isLoading ? (
                    !owners.isError && owners.data && owners.isSuccess && owners.data.result ? (
                      <Controller
                        control={form.control}
                        name="owner"
                        rules={{required: "Bu maydon to'ldirilishi shart!"}}
                        render={({field, fieldState: {error}}) => (
                          <div className="space-y-1">
                            <Label className={"text-[#667085]"}>Do`kon
                              egasi</Label>
                            <>
                              <Select
                                value={field?.value?.toString()}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-full text-black">
                                  <SelectValue placeholder="Do'kon egasini tanlang"/>
                                </SelectTrigger>
                                <SelectContent>
                                  {
                                    owners.data.result.results.map((item, index) => (
                                      <SelectItem value={item.id.toString()}
                                                  key={index}>{item.full_name}</SelectItem>
                                    ))
                                  }
                                </SelectContent>
                              </Select>
                            </>
                            {error && <p className="text-red-500">{error.message}</p>}
                          </div>
                        )
                        }
                      />
                    ) : (
                      <span className={"text-rose-500"}>Nimadir xato ketdi!</span>
                    )
                  ) : (
                    <Skeleton className={"w-full h-9 rounded-md"}/>
                  )
                }
                {
                  !country.isLoading ? (
                    !country.isError && country.data && country.isSuccess && country.data.result ? (
                      <Controller
                        control={form.control}
                        name="country"
                        rules={{required: "Bu maydon to'ldirilishi shart!"}}
                        render={({field, fieldState: {error}}) => (
                          <div className="space-y-1">
                            <Label className={"text-[#667085]"}>Hudud</Label>
                            <>
                              <Select
                                value={field?.value?.toString()}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-full text-black">
                                  <SelectValue placeholder="Tumanni tanlang"/>
                                </SelectTrigger>
                                <SelectContent>
                                  {
                                    country.data.result.map((item, index) => (
                                      <SelectItem value={item.id.toString()}
                                                  key={index}>{item.name}</SelectItem>
                                    ))
                                  }
                                </SelectContent>
                              </Select>
                            </>
                            {error && <p className="text-red-500">{error.message}</p>}
                          </div>
                        )
                        }
                      />
                    ) : (
                      <span className={"text-rose-500"}>Nimadir xato ketdi!</span>
                    )
                  ) : (
                    <Skeleton className={"w-full h-9 rounded-md"}/>
                  )
                }

                <Controller
                  control={form.control}
                  name="address"
                  render={({field, fieldState: {error}}) => (
                    <div className="space-y-1">
                      <Label className={"text-[#667085]"}>Manzil</Label>
                      <>
                        <Input placeholder="Hazorasp" {...field} type={"text"}/>
                      </>
                      {error && <p className="text-red-500">{error.message}</p>}
                    </div>
                  )}
                />

                <div className={"grid grid-cols-12 items-center gap-3"}>
                  <div className={"col-span-6 flex justify-between"}>
                    <Controller
                      control={form.control}
                      name="opening_time"
                      rules={{required: "Bu maydon to'ldirilishi shart!"}}
                      render={({field, fieldState: {error}}) => (
                        <div className="space-y-1">
                          <Label className={"text-[#667085]"}>Ochilish
                            vaqti</Label>
                          <>
                            <Input placeholder="30"  {...field} type={"time"}
                                   className={"w-auto"}/>
                          </>
                          {error && <p className="text-red-500">{error.message}</p>}
                        </div>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name="closing_time"
                      rules={{required: "Bu maydon to'ldirilishi shart!"}}
                      render={({field, fieldState: {error}}) => (
                        <div className="space-y-1">
                          <Label className={"text-[#667085]"}>Yopilish
                            vaqti</Label>
                          <>
                            <Input placeholder="30" {...field} type={"time"}
                                   className={"w-auto"}/>
                          </>
                          {error && <p className="text-red-500">{error.message}</p>}
                        </div>
                      )}
                    />
                  </div>
                  <div className={"col-span-6"}>
                    <Controller
                      control={form.control}
                      name="delivery_time"
                      rules={{required: "Bu maydon to'ldirilishi shart!"}}
                      render={({field, fieldState: {error}}) => (
                        <div className="space-y-1 flex-1">
                          <Label className={"text-[#667085]"}>Yetkazib berish
                            vaqti</Label>
                          <>
                            <div className={"flex items-center gap-2"}>
                              <InputWithFormat
                                placeholder="10"
                                value={field.value}
                                onValueChange={(e) => field.onChange(e)}
                              />
                              <span>daqiqa</span>
                            </div>
                          </>
                          {error && <p className="text-red-500">{error.message}</p>}
                        </div>
                      )}
                    />
                  </div>
                </div>

                <Controller
                  control={form.control}
                  name="description"
                  render={({field, fieldState: {error}}) => (
                    <div className="space-y-1">
                      <Label className={"text-[#667085]"}>Dokon tavsifi</Label>
                      <>
                        <Textarea placeholder="Go'sh, hamir"
                                  className={"resize-none"} {...field} rows={5}/>
                      </>
                      {error && <p className="text-red-500">{error.message}</p>}
                    </div>
                  )}
                />

                {
                  withMap ? (
                    <div className={"w-full space-y-2"}>
                      <div className={"w-full flex justify-between rounded-md overflow-hidden"}>
                        <h3 className={"text-xl font-medium"}>Joylashuv</h3>
                        <Button variant={"link"} onClick={() => setWithMap(false)} type={"button"}>
                          Qo`lda kiritish
                        </Button>
                      </div>
                      <LocationPicker onLocationSelect={setSelectedLocation}
                                      loc={form.getValues(["latitude", "longitude"])[0] !== undefined && form.getValues(["latitude", "longitude"])}/>
                    </div>
                  ) : (
                    <div className={"grid grid-cols-12 gap-3"}>
                      <div className={"col-span-12 flex justify-between"}>
                        <h3 className={"text-xl font-medium"}>Joylashuv</h3>
                        <Button variant={"link"} onClick={() => setWithMap(true)} type={"button"}>
                          Xaritadan tanlash
                        </Button>
                      </div>
                      <Controller
                        control={form.control}
                        name="latitude"
                        render={({field, fieldState: {error}}) => (
                          <div className="space-y-1 col-span-6">
                            <Label className={"text-[#667085]"}>Latitude</Label>
                            <>
                              <Input placeholder="41.1" {...field} type={"text"}/>
                            </>
                            {error && (
                              <p className="text-red-500">{error.message}</p>
                            )}
                          </div>
                        )}
                      />
                      <Controller
                        control={form.control}
                        name="longitude"
                        render={({field, fieldState: {error}}) => (
                          <div className="space-y-1 col-span-6">
                            <Label className={"text-[#667085]"}>Longitude</Label>
                            <>
                              <Input placeholder="61.1" {...field} type={"text"}/>
                            </>
                            {error && (
                              <p className="text-red-500">{error.message}</p>
                            )}
                          </div>
                        )}
                      />
                    </div>
                  )
                }
              </div>
              <div className={"space-x-4 mt-4"}>
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
                  type={"button"}
                  onClick={() => navigate("/shops")}
                >
                  Bekor qilish
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Layout.Body>
    </Layout>
  );
};

export default Index;