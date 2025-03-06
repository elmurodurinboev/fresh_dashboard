import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {useMutation, useQuery} from "@tanstack/react-query";
import {toast} from "@/hooks/use-toast.js";
import {Layout} from "@/components/custom/layout.jsx";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Switch} from "@/components/ui/switch.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {IconPhoto, IconPlus, IconX} from "@tabler/icons-react";
import {Button} from "@/components/custom/button.jsx";
import RestaurantService from "@/services/restaurant.service.js";
import CountryService from "@/services/country.service.js";
import {Label} from "@/components/ui/label.jsx";
import PhoneInput from "@/components/custom/phone-input.jsx";
import InputWithFormat from "@/components/custom/input-with-format.jsx";
import LocationPicker from "@/components/custom/location-picker.jsx";
import SelectComponent from "@/components/custom/select-component.jsx";


const Index = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [withMap, setWithMap] = useState(false)
  const [isDragged, setIsDragged] = useState(false)
  const form = useForm({
    defaultValues: {
      name: "",
      delivery_time: "",
      country: "",
      owner: "",
      picture: null,
      description: "",
      rating: "",
      is_active: false,
      latitude: "41.55039",
      longitude: "60.6315",
      opening_time: "",
      closing_time: "",
      contractor: "",
      address: "",
      phone_number: "",
      legal_address: "",
      director_number: "",
      bank_account_number: "",
      stir: ""
    },
  })

  const restaurantData = useQuery({
    queryKey: ['getRestaurantData', params.id],
    queryFn: RestaurantService.getOne,
    enabled: !!params && !!params.id
  })

  useEffect(() => {
    const {isSuccess, data} = restaurantData;

    if (isSuccess && data?.result !== 0) {
      console.log(data?.result?.owner?.id)
      form.reset({
        name: data?.result?.name && data?.result?.name,
        delivery_time: data?.result?.delivery_time && data?.result?.delivery_time,
        country: data?.result?.country && data?.result?.country,
        owner: data?.result?.owner && data?.result?.owner?.id,
        picture: data?.result?.picture && data?.result?.picture,
        description: data?.result?.description && data?.result?.description,
        rating: data?.result?.rating && data?.result?.rating,
        is_active: data?.result?.is_active && data?.result?.is_active,
        address: data?.result?.address && data?.result?.address,
        contractor: data?.result?.contractor && data?.result?.contractor,
        latitude: data?.result?.latitude && data?.result?.latitude,
        longitude: data?.result?.longitude && data?.result?.longitude,
        opening_time: data?.result?.opening_time && data?.result?.opening_time,
        closing_time: data?.result?.closing_time && data?.result?.closing_time,
        phone_number: data?.result?.phone_number && data?.result?.phone_number,
        director_number: data?.result?.director_number && data?.result?.director_number,
        legal_address: data?.result?.legal_address && data?.result?.legal_address,
        bank_account_number: data?.result?.bank_account_number && data?.result?.bank_account_number,
        stir: data?.result?.stir && data?.result?.stir,
      });
    }
  }, [restaurantData.isSuccess, restaurantData.data?.result]);

  const mutation = useMutation({
    mutationFn: RestaurantService.updatePatch,
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
        description: "Muvaffaqiyatli o'zgartirildi!"
      })
      form.reset()
      navigate("/restaurants")
    }
  })


  const setSelectedLocation = (lat, lng) => {
    form.reset({
      ...form.getValues(),
      latitude: lat,
      longitude: lng
    })
  }


  const country = useQuery({
    queryKey: ['GetCountry'],
    queryFn: CountryService.getAll
  })

  const ownersData = useQuery({
    queryKey: ['getAllResOwners'],
    queryFn: RestaurantService.getOwners
  })

  const onSubmit = (data) => {
    Object.keys(data).forEach(item => {
      if (data[item] === null || data[item] === undefined) {
        data[item] = ""
      }
    })
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      key !== 'picture' && formData.append(key, value ?? "");
    });
    const imgType = typeof data?.picture
    data.picture && imgType === 'object' && formData.append("picture", data.picture)
    mutation.mutate({formData, id: params.id})
  }
  return (
    <Layout>
      <Layout.Body>
        <div className="mb-2 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Restaranni o`zgartirish</h2>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"grid grid-cols-12 gap-4"}>
            <div className={"col-span-12 lg:col-span-8 flex flex-col gap-4"}>
              <div
                className={"w-full p-6 bg-white rounded-2xl shadow flex flex-col gap-4"}
              >
                <div className={"flex items-center justify-between gap-3"}>
                  <Controller
                    control={form.control}
                    name="name"
                    rules={{required: "Bu maydon to'ldirilishi shart!"}}
                    render={({field, fieldState: {error}}) => (
                      <div className="space-y-1 flex-1">
                        <Label className={"text-[#667085]"}>
                          Restaran nomi
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
                    name="is_active"
                    render={({field, fieldState: {error}}) => (
                      <div className="flex flex-col gap-1 items-end pt-2">
                        <Label className={"text-[#667085] flex items-center"}>
                          Aktivligi
                        </Label>
                        <>
                          <Switch
                            {...field}
                            checked={field.value}
                            onCheckedChange={(val) => field.onChange(val)}
                          />
                        </>
                        {error && (
                          <p className="text-red-500">{error.message}</p>
                        )}
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
                          <span className="absolute left-2.5 top-[9px] text-sm">
                            +998
                          </span>
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

                <Controller
                  control={form.control}
                  name="director_number"
                  rules={{required: "Bu maydon to'ldirilishi shart!"}}
                  render={({field, fieldState: {error}}) => (
                    <div className="space-y-1">
                      <Label>Direktor telefon raqami</Label>
                      <>
                        <div className="relative flex items-center">
                          <span className="absolute left-2.5 top-[9px] text-sm">
                            +998
                          </span>
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

                {!ownersData.isLoading && !restaurantData.isLoading ? (
                  !ownersData.isError &&
                  ownersData.data &&
                  ownersData.isSuccess &&
                  ownersData.data &&
                  ownersData.data.results ? (
                    <Controller
                      name="owner"
                      control={form.control}
                      defaultValue={""}
                      rules={{required: "Bu maydon to'ldirilishi shart"}} // Add validation rules here
                      render={({field, fieldState: {error}}) => (
                        <div className="flex-1">
                          <label className="text-[#667085]">
                            Restoran egasi
                          </label>
                          <SelectComponent
                            value={field.value}
                            onChange={field.onChange}
                            options={ownersData?.data?.results}
                            hasError={!!error}
                            labelName={"full_name"}
                          />
                          {error && (
                            <p className="text-red-500 text-sm">
                              {error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  ) : (
                    <span className={"text-rose-500"}>
                        Nimadir xato ketdi!
                      </span>
                  )
                ) : (
                  <Skeleton className={"col-span-9 h-9 rounded-md"}/>
                )}
                {!country.isLoading ? (
                  !country.isError &&
                  country.data &&
                  country.isSuccess &&
                  country.data &&
                  country.data.result ? (
                    <Controller
                      name="country"
                      control={form.control}
                      defaultValue={""}
                      rules={{required: "Bu maydon to'ldirilishi shart"}} // Add validation rules here
                      render={({field, fieldState: {error}}) => (
                        <div className="flex-1">
                          <label className="text-[#667085]">
                            Hudud
                          </label>
                          <SelectComponent value={field.value} onChange={field.onChange} options={country?.data?.result}
                                           hasError={!!error}/>
                          {error && (
                            <p className="text-red-500 text-sm">
                              {error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  ) : (
                    <span className={"text-rose-500"}>
                        Nimadir xato ketdi!
                    </span>
                  )
                ) : (
                  <Skeleton className={"col-span-9 h-9 rounded-md"}/>
                )}

                <Controller
                  control={form.control}
                  name="legal_address"
                  rules={{required: "Bu maydon to'ldirilishi shart!"}}
                  render={({field, fieldState: {error}}) => (
                    <div className="space-y-1 flex-1">
                      <Label className={"text-[#667085]"}>
                        Yuridik shaxs manzili
                      </Label>
                      <>
                        <Input placeholder="......" {...field} />
                      </>
                      {error && (
                        <p className="text-red-500">{error.message}</p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  control={form.control}
                  name="bank_account_number"
                  rules={{required: "Bu maydon to'ldirilishi shart!"}}
                  render={({field, fieldState: {error}}) => (
                    <div className="space-y-1 flex-1">
                      <Label className={"text-[#667085]"}>
                        Bank hisob raqami
                      </Label>
                      <>
                        <Input placeholder="22012312031941012" type={"number"}  {...field} />
                      </>
                      {error && (
                        <p className="text-red-500">{error.message}</p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  control={form.control}
                  name="stir"
                  rules={{required: "Bu maydon to'ldirilishi shart!"}}
                  render={({field, fieldState: {error}}) => (
                    <div className="space-y-1 flex-1">
                      <Label className={"text-[#667085]"}>
                        STIR
                      </Label>
                      <>
                        <Input placeholder="1231231" type={"number"}  {...field} />
                      </>
                      {error && (
                        <p className="text-red-500">{error.message}</p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  control={form.control}
                  name="address"
                  render={({field, fieldState: {error}}) => (
                    <div className="space-y-1">
                      <Label className={"text-[#667085]"}>Manzil</Label>
                      <>
                        <Input
                          placeholder="Hazorasp"
                          {...field}
                          type={"text"}
                        />
                      </>
                      {error && <p className="text-red-500">{error.message}</p>}
                    </div>
                  )}
                />

                <Controller
                  control={form.control}
                  name="contractor"
                  render={({field, fieldState: {error}}) => (
                    <div className="space-y-1">
                      <Label className={"text-[#667085]"}>Contractor</Label>
                      <>
                        <Input placeholder="Evos" {...field} />
                      </>
                      {error && <p className="text-red-500">{error.message}</p>}
                    </div>
                  )}
                />
                <div className={"flex items-center justify-between gap-4"}>
                  <Controller
                    control={form.control}
                    name="rating"
                    rules={{required: "Bu maydon to'ldirilishi shart!"}}
                    render={({field, fieldState: {error}}) => (
                      <div className="space-y-1 flex-1">
                        <Label className={"text-[#667085]"}>
                          Restor reytinggi
                        </Label>
                        <InputWithFormat
                          placeholder="5"
                          value={field.value}
                          onValueChange={(e) => field.onChange(e)}
                        />
                        {error && (
                          <p className="text-red-500">{error.message}</p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <div className={"grid grid-cols-12 items-center gap-3"}>
                  <div className={"col-span-6 flex justify-between"}>
                    <Controller
                      control={form.control}
                      name="opening_time"
                      render={({field, fieldState: {error}}) => (
                        <div className="space-y-1">
                          <Label className={"text-[#667085]"}>
                            Ochilish vaqti
                          </Label>
                          <>
                            <Input
                              placeholder="30"
                              {...field}
                              type={"time"}
                              className={"w-auto"}
                            />
                          </>
                          {error && (
                            <p className="text-red-500">{error.message}</p>
                          )}
                        </div>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name="closing_time"
                      render={({field, fieldState: {error}}) => (
                        <div className="space-y-1">
                          <Label className={"text-[#667085]"}>
                            Yopilish vaqti
                          </Label>
                          <>
                            <Input
                              placeholder="30"
                              {...field}
                              type={"time"}
                              className={"w-auto"}
                            />
                          </>
                          {error && (
                            <p className="text-red-500">{error.message}</p>
                          )}
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
                          <Label className={"text-[#667085]"}>
                            Yetkazib berish vaqti
                          </Label>
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
                          {error && (
                            <p className="text-red-500">{error.message}</p>
                          )}
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
                      <Label className={"text-[#667085]"}>
                        Restoran tavsifi
                      </Label>
                      <>
                        <Textarea
                          placeholder="Go'sh, hamir"
                          className={"resize-none"}
                          {...field}
                          rows={5}
                        />
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
                      <LocationPicker onLocationSelect={setSelectedLocation}/>
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
            </div>

            {/*Product Image*/}
            <div className={"col-span-12 lg:col-span-4 flex flex-col gap-3"}>
              <div className={"flex flex-col bg-white rounded-2xl shadow p-6"}>
                <Controller
                  name="picture"
                  control={form.control}
                  rules={{required: "Bu maydon to'ldirilishi shart!"}}
                  render={
                    ({field: {onChange, value, ...field}, fieldState: {error}}) => (
                      <div>
                        <Label className={"text-[#667085]"}>Restoran rasmi</Label>
                        <>
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
                                    <img
                                      src={typeof value === "string" ? value : URL.createObjectURL(value)}
                                      alt="Selected Image"
                                      width={"100"}
                                      height={"100"}
                                      className="w-full object-center object-contain"
                                    />
                                  </span>
                              ) : (
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
                        </>
                        {error && <p className="text-red-500">{error.message}</p>}
                      </div>
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
                onClick={() => navigate("/restaurants")}
                className={"w-full gap-2 items-center"}
              >
                <IconX className={"w-5 h-5"}/>
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