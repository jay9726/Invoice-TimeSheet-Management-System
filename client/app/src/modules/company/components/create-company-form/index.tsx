import React, { useMemo } from 'react'
import { companySchema, type companySchemaPayload } from '../../schemas/companySchema'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { companyDefaultValues } from '../../schemas/companyDefaultValues'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FormInput } from '@/components/form-input'
import { useCreateCompany } from '../../apis/mutation'
import { useToast } from '@/hooks/useToast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Country, State, City } from "country-state-city"

interface createCompanyFormProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateCompanyForm: React.FC<createCompanyFormProps> = ({ setOpen }) => {
    const toast = useToast()

    const { handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(companySchema),
        defaultValues: companyDefaultValues
    })

    const { mutate: createCompany, isPending: isCreatingCompany } = useCreateCompany()

    const selectedCountry = watch("country")
    const selectedState = watch("state")

    const countries = useMemo(() => Country.getAllCountries(), [])
    const states = useMemo(() => {
        if (!selectedCountry) return []
        return State.getStatesOfCountry(selectedCountry)
    }, [selectedCountry])

    const cities = useMemo(() => {
        if (!selectedCountry || !selectedState) return []
        return City.getCitiesOfState(selectedCountry, selectedState)
    }, [selectedCountry, selectedState])

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

        createCompany(fd as any, {
            onSuccess: () => {
                toast.success("Company Created Successfully")
                setOpen(false)
            }
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">

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
            <div className="flex flex-col gap-2 md:col-span-2">
                <div className='flex  gap-1'>
                    <Label>Company Name</Label>
                    <span className="text-red-500">*</span>
                </div>
                <Controller
                    name="companyName"
                    control={control}
                    render={({ field }) => <FormInput {...field} placeholder="Enter Company Name" />}
                />
                <p className="text-sm text-red-500">{errors.companyName?.message}</p>
            </div>

            <div className="flex flex-col gap-2 md:col-span-4">
                <div className='flex  gap-1'>
                    <Label>Company Address</Label>
                    <span className="text-red-500">*</span>
                </div>
                <Controller
                    name="addressLine1"
                    control={control}
                    render={({ field }) => <Textarea {...field} placeholder="Street address" className="resize-none" />}
                />
                <p className="text-sm text-red-500">{errors.addressLine1?.message}</p>
            </div>

            <div className="flex flex-col gap-2">
                <div className='flex  gap-1'>
                    <Label>Country</Label>
                    <span className="text-red-500">*</span>
                </div>
                <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={(val) => {
                                field.onChange(val)
                                setValue("state", "")
                                setValue("city", "")
                            }}
                        >
                            <SelectTrigger className='min-w-full'>
                                <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent>
                                {countries.map(c => (
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

            <div className="flex flex-col gap-2">
                <div className='flex  gap-1'>
                    <Label>State</Label>
                    <span className="text-red-500">*</span>
                </div>
                <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={(val) => {
                                field.onChange(val)
                                setValue("city", "")
                            }}
                            disabled={!selectedCountry}
                        >
                            <SelectTrigger className='min-w-full'>
                                <SelectValue placeholder="Select State" />
                            </SelectTrigger>
                            <SelectContent>
                                {states.map(s => (
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

            <div className="flex flex-col gap-2">
                <div className='flex  gap-1'>
                    <Label>City</Label>
                    <span className="text-red-500">*</span>
                </div>
                <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange} disabled={!selectedState}>
                            <SelectTrigger className='min-w-full'>
                                <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                            <SelectContent>
                                {cities.map(city => (
                                    <SelectItem key={city.name} value={city.name}>
                                        {city.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                <p className="text-sm text-red-500">{errors.city?.message}</p>
            </div>

            <div className="flex flex-col gap-2">
                <div className='flex  gap-1'>
                    <Label>Zip</Label>
                    <span className="text-red-500">*</span>
                </div>
                <Controller
                    name="zip"
                    control={control}
                    render={({ field }) => <FormInput {...field} placeholder="Enter Zip" />}
                />
                <p className="text-sm text-red-500">{errors.zip?.message}</p>
            </div>

            <div className="md:col-span-4 flex justify-end gap-3 ">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">{isCreatingCompany ? "Creating..." : "Create Company"}</Button>
            </div>
        </form>
    )
}

export default CreateCompanyForm