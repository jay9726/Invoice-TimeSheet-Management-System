import React, { useEffect, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { companySchema, type companySchemaPayload } from "../../schemas/companySchema"
import { companyDefaultValues } from "../../schemas/companyDefaultValues"
import { FormInput } from "@/components/form-input"
import { useGetCompanyById } from "../../apis/queries"
import Loader from "@/components/loader"
import { useUpdateCompany } from "../../apis/mutation"
import { useToast } from "@/hooks/useToast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Country, State, City } from "country-state-city"

interface updateCompanyFormProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    companyId: string
}

const UpdateCompanyForm: React.FC<updateCompanyFormProps> = ({ setOpen, companyId }) => {
    const toast = useToast()

    const { handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm<companySchemaPayload>({
        resolver: zodResolver(companySchema),
        defaultValues: companyDefaultValues,
    })

    const { data, isPending } = useGetCompanyById(companyId)
    const { mutate: updateCompany, isPending: isUpdatePending } = useUpdateCompany()

    const countries = useMemo(() => Country.getAllCountries(), [])
    const selectedCountry = watch("country")
    const selectedState = watch("state")

    const states = useMemo(() => {
        if (!selectedCountry) return []
        return State.getStatesOfCountry(selectedCountry)
    }, [selectedCountry])

    const cities = useMemo(() => {
        if (!selectedCountry || !selectedState) return []
        return City.getCitiesOfState(selectedCountry, selectedState)
    }, [selectedCountry, selectedState])

    const apiCountryRef = useRef<string>("")
    const apiStateRef = useRef<string>("")
    const apiCityRef = useRef<string>("")

    useEffect(() => {
        const d = data?.data
        if (!d) return

        apiCountryRef.current = d.country ?? ""
        apiStateRef.current = d.state ?? ""
        apiCityRef.current = d.city ?? ""

        reset({
            companyName: d.companyName ?? "",
            addressLine1: d.addressLine1 ?? "",
            zip: d.zip ?? "",
            isActive: d.isActive ?? true,
            country: "",
            state: "",
            city: "",
        })

        setValue("country", apiCountryRef.current, { shouldValidate: true })
    }, [data?.data, reset, setValue])

    useEffect(() => {
        if (!selectedCountry) return
        const apiState = apiStateRef.current
        if (!apiState) return

        const exists = states.some(s => s.isoCode === apiState)
        if (!exists) return

        setValue("state", apiState, { shouldValidate: true })
    }, [selectedCountry, states, setValue])

    useEffect(() => {
        if (!selectedCountry || !selectedState) return
        const apiCity = apiCityRef.current
        if (!apiCity) return

        const exists = cities.some(c => c.name === apiCity)
        if (!exists) return

        setValue("city", apiCity, { shouldValidate: true })
    }, [selectedCountry, selectedState, cities, setValue])

    const onSubmit = (formData: companySchemaPayload) => {
        const fd = new FormData();
        fd.append("companyName", formData.companyName);
        fd.append("addressLine1", formData.addressLine1);
        fd.append("country", formData.country);
        fd.append("state", formData.state);
        fd.append("city", formData.city);
        fd.append("zip", formData.zip);
        fd.append("isActive", String(formData.isActive ?? true));

        if (formData.logoFile) fd.append("logoFile", formData.logoFile);

        updateCompany(
            { companyId, payload: fd as any },
            {
                onSuccess: () => {
                    toast.success("Company Updated Successfully")
                    setOpen(false)
                },
            }
        )
    }

    const showLoader = isPending || isUpdatePending

    return (
        <>
            {showLoader && <Loader />}

            <form onSubmit={handleSubmit(onSubmit)} className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Company Logo */}
                <div className="flex flex-col gap-2 md:col-span-2">
                    <div className="flex gap-1">
                        <Label>Company Logo</Label>
                        <span className="text-red-500">*</span>
                    </div>

                    <Controller
                        name="logoFile"
                        control={control}
                        render={({ field }) => (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => field.onChange(e.target.files?.[0])}
                                className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white"
                            />
                        )}
                    />
                </div>

                {/* Company Name */}
                <div className="flex flex-col gap-2 md:col-span-2">
                    <div className="flex gap-1">
                        <Label>Company Name</Label><span className="text-red-500">*</span>
                    </div>
                    <Controller
                        name="companyName"
                        control={control}
                        render={({ field }) => <FormInput {...field} placeholder="Enter Company Name" />}
                    />
                    <p className="text-sm text-red-500">{errors.companyName?.message}</p>
                </div>


                {/* Address */}
                <div className="flex flex-col gap-2 md:col-span-4">
                    <div className="flex gap-1">
                        <Label>Company Address</Label><span className="text-red-500">*</span>
                    </div>
                    <Controller
                        name="addressLine1"
                        control={control}
                        render={({ field }) => <Textarea {...field} placeholder="Street address" className="resize-none" />}
                    />
                    <p className="text-sm text-red-500">{errors.addressLine1?.message}</p>
                </div>

                {/* Country */}
                <div className="flex flex-col gap-2">
                    <div className="flex gap-1">
                        <Label>Country</Label><span className="text-red-500">*</span>
                    </div>
                    <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value || ""}
                                onValueChange={(val) => {
                                    field.onChange(val)
                                    setValue("state", "")
                                    setValue("city", "")
                                }}
                            >
                                <SelectTrigger className="h-10 w-full px-3">
                                    <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map((c) => (
                                        <SelectItem key={c.isoCode} value={c.isoCode}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <p className="text-sm text-red-500">{errors.country?.message}</p>
                </div>

                {/* State */}
                <div className="flex flex-col gap-2">
                    <div className="flex gap-1">
                        <Label>State</Label><span className="text-red-500">*</span>
                    </div>
                    <Controller
                        name="state"
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value || ""}
                                onValueChange={(val) => {
                                    field.onChange(val)
                                    setValue("city", "")
                                }}
                                disabled={!selectedCountry}
                            >
                                <SelectTrigger className="h-10 w-full px-3">
                                    <SelectValue placeholder="Select State" />
                                </SelectTrigger>
                                <SelectContent>
                                    {states.map((s) => (
                                        <SelectItem key={s.isoCode} value={s.isoCode}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <p className="text-sm text-red-500">{errors.state?.message}</p>
                </div>

                {/* City */}
                <div className="flex flex-col gap-2">
                    <div className="flex gap-1">
                        <Label>City</Label><span className="text-red-500">*</span>
                    </div>
                    <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value || ""}
                                onValueChange={field.onChange}
                                disabled={!selectedState}
                            >
                                <SelectTrigger className="h-10 w-full px-3">
                                    <SelectValue placeholder="Select City" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cities.map((c) => (
                                        <SelectItem key={c.name} value={c.name}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <p className="text-sm text-red-500">{errors.city?.message}</p>
                </div>

                {/* Zip */}
                <div className="flex flex-col gap-2">
                    <div className="flex gap-1">
                        <Label>Zip</Label><span className="text-red-500">*</span>
                    </div>
                    <Controller
                        name="zip"
                        control={control}
                        render={({ field }) => <FormInput {...field} placeholder="Enter Zip" />}
                    />
                    <p className="text-sm text-red-500">{errors.zip?.message}</p>
                </div>

                {/* Actions */}
                <div className="md:col-span-4 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {isUpdatePending ? "Updating..." : "Update Company"}
                    </Button>
                </div>
            </form>
        </>
    )
}

export default UpdateCompanyForm

