import React, { useEffect, useMemo } from "react"
import { clientSchema, type clientPayload } from "../../schemas/clientSchema"
import { clientDefaultValues } from "../../schemas/clientDefaultValues"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FormInput } from "@/components/form-input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/useToast"
import { useGetClientById } from "../../apis/queries"
import { useUpdateClient } from "../../apis/mutation"
import Loader from "@/components/loader"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Country, State, City } from "country-state-city"
import { useGetCompany } from "@/modules/company/apis/queries"
import type { companyType } from "@/types/company"

interface updateClientForm {
    clientId: string
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const UpdateClientForm: React.FC<updateClientForm> = ({ setOpen, clientId }) => {
    const toast = useToast()

    const { data: companyData, isLoading, isError } = useGetCompany()


    const company = companyData?.data ?? []

    const { handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm<clientPayload>({
        resolver: zodResolver(clientSchema),
        defaultValues: clientDefaultValues,
    })

    const { data, isPending } = useGetClientById(clientId)
    const { mutate: updateClient, isPending: isUpdatePending } = useUpdateClient()

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

    useEffect(() => {
        if (!data?.data) return

        reset({
            clientName: data.data.clientName,
            addressLine1: data.data.addressLine1,
            companyId: data.data.companyId,
            contactNumber: data.data.contactNumber,
            country: data.data.country,
            state: data.data.state,
            city: data.data.city,
            zip: data.data.zip,
            isActive: data.data.isActive,
        })
    }, [data?.data, reset])

    const onSubmit = (formData: clientPayload) => {
        updateClient(
            { clientId, payload: formData },
            {
                onSuccess: () => {
                    toast.success("Client Update Successfully")
                    setOpen(false)
                },
            }
        )
    }

    return (
        <>
            {(isPending || isUpdatePending) && <Loader />}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Client Name */}
                    <div className="space-y-1.5">
                        <div className="flex gap-1">
                            <Label>Client Name</Label>
                            <span className="text-red-500">*</span>
                        </div>
                        <Controller
                            name="clientName"
                            control={control}
                            render={({ field }) => <FormInput {...field} placeholder="Client Name" />}
                        />
                        <p className="text-sm text-red-600">{errors.clientName?.message}</p>
                    </div>

                    {/* Contact */}
                    <div className="space-y-1.5">
                        <div className="flex gap-1">
                            <Label>Contact</Label>
                            <span className="text-red-500">*</span>
                        </div>
                        <Controller
                            name="contactNumber"
                            control={control}
                            render={({ field }) => (
                                <FormInput
                                    {...field}
                                    type="number"
                                    inputMode="numeric"
                                    placeholder="Contact Number"
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(e.target.value.toString())}
                                />
                            )}
                        />
                        <p className="text-sm text-red-600">{errors.contactNumber?.message}</p>
                    </div>

                    {/* Client Dropdown (with loader) */}
                    <div className="space-y-1.5">
                        <div className='flex gap-1'>
                            <Label>Company</Label>
                            <span className="text-red-500">*</span>
                        </div>
                        <Controller
                            control={control}
                            name="companyId"
                            render={({ field }) => (
                                <Select
                                    value={field.value ? String(field.value) : ""}
                                    onValueChange={field.onChange}
                                    disabled={isLoading || isError}
                                >
                                    <SelectTrigger id="clientId" className="w-full">
                                        <SelectValue placeholder={isLoading ? "Loading company..." : "Select Company"} />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {isLoading ? (
                                            <div className="p-3">
                                                <Loader />
                                            </div>
                                        ) : isError ? (
                                            <div className="p-3 text-sm text-red-500">Failed to load Copmpany</div>
                                        ) : company.length ? (
                                            company.map((c: companyType) => (
                                                <SelectItem
                                                    key={c.companyId ?? c.companyId}
                                                    value={c.companyId as string}
                                                >
                                                    {c.companyName}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="p-3 text-sm text-slate-500">No company found</div>
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />

                        <p className="text-sm text-red-600">{errors.companyId?.message}</p>
                    </div>

                    {/* Address */}
                    <div className="flex flex-col gap-2 md:col-span-3">
                        <div className="flex gap-1">
                            <Label>Address</Label>
                            <span className="text-red-500">*</span>
                        </div>
                        <Controller
                            name="addressLine1"
                            control={control}
                            render={({ field }) => <Textarea {...field} placeholder="Street address" />}
                        />
                        <p className="text-sm text-red-500">{errors.addressLine1?.message}</p>
                    </div>

                    {/* Country / State / City / Zip */}
                    <div className="grid grid-cols-1 gap-4 md:col-span-4 md:grid-cols-4">
                        {/* Country */}
                        <div className="space-y-1.5">
                            <div className="flex gap-1">
                                <Label>Country</Label>
                                <span className="text-red-500">*</span>
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
                            <p className="text-sm text-red-600">{(errors).country?.message}</p>
                        </div>

                        {/* State */}
                        <div className="space-y-1.5">
                            <div className="flex gap-1">
                                <Label>State</Label>
                                <span className="text-red-500">*</span>
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
                            <p className="text-sm text-red-600">{errors.state?.message}</p>
                        </div>

                        {/* City */}
                        <div className="space-y-1.5">
                            <div className="flex gap-1">
                                <Label>City</Label>
                                <span className="text-red-500">*</span>
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
                            <p className="text-sm text-red-600">{errors.city?.message}</p>
                        </div>

                        {/* Zip */}
                        <div className="space-y-1.5">
                            <div className="flex gap-1">
                                <Label>Zip</Label>
                                <span className="text-red-500">*</span>
                            </div>
                            <Controller
                                name="zip"
                                control={control}
                                render={({ field }) => <FormInput {...field} placeholder="Pincode" />}
                            />
                            <p className="text-sm text-red-600">{errors.zip?.message}</p>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-3 flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {isUpdatePending ? "Updating Client..." : "Update Client"}
                    </Button>
                </div>
            </form>
        </>
    )
}

export default UpdateClientForm