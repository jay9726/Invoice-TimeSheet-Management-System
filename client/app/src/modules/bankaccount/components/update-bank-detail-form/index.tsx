import React, { useEffect } from 'react'
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { DialogFooter } from "@/components/ui/dialog"
import { bankDetailSchema, type bankDetailPayload } from '../../schemas/bankDetailSchema'
import { bankDetailDefaultValues } from '../../schemas/bankDetailDefaultValues'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormInput } from '@/components/form-input'
import { useToast } from '@/hooks/useToast'
import { useGetBankDetailById } from '../../apis/queries'
import { useUpdateBankDetail } from '../../apis/mutation'
import Loader from '@/components/loader'
import { useGetCompany } from '@/modules/company/apis/queries'
import type { companyType } from '@/types/company'

interface updateBankDetailProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  bankDetailId: string
}


const UpdateBankDetailFrom: React.FC<updateBankDetailProps> = ({ setOpen, bankDetailId }) => {

  const toast = useToast();

  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: zodResolver(bankDetailSchema),
    defaultValues: bankDetailDefaultValues,
  })

  const { data: allCompanyData, isLoading: isCompanyLoading, isError: isCompanyError } = useGetCompany();
  const { data, isPending } = useGetBankDetailById(bankDetailId);

  const companies = allCompanyData?.data ?? []

  useEffect(() => {
    if (data?.data) {
      console.log(data.data)
      reset({
        companyId: data.data.companyId,
        bankName: data.data.bankName,
        swiftCode: data.data.swiftCode,
        accountName: data.data.accountName,
        accountNumber: data.data.accountNumber,
        routingNumber: data.data.routingNumber
      })
    }
  }, [data?.data, reset, allCompanyData])


  const { mutate: updateBankDetail, isPending: isUpdatePending } = useUpdateBankDetail();


  const onSubmit = (formData: bankDetailPayload) => {
    updateBankDetail({ bankDetailId: bankDetailId, payload: formData }, {
      onSuccess: () => {
        toast.success("Bank Account Update Successfully")
        setOpen(false)
      }
    })
  }

  const showLoader = isPending || isCompanyLoading || isUpdatePending


  return (
    <>
      {showLoader && <Loader />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company — Full Width */}
          <div className="space-y-1.5 sm:col-span-1 md:col-span-1">
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
                  disabled={isCompanyLoading || isCompanyError}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isCompanyLoading ? "Loading companies..." : "Select company"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {isCompanyLoading ? (
                      <div className="p-3">
                        <Loader />
                      </div>
                    ) : isCompanyError ? (
                      <div className="p-3 text-sm text-red-500">
                        Failed to load companies
                      </div>
                    ) : companies.length ? (
                      companies.map((cmp: companyType) => (
                        <SelectItem
                          key={cmp.companyId}
                          value={cmp.companyId as string}
                        >
                          {cmp.companyName}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-3 text-sm text-slate-500">No companies found</div>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            <p className="text-sm text-red-600">{errors.companyId?.message}</p>
          </div>

          {/* Bank Name */}
          <div className="space-y-1.5">
            <div className='flex gap-1'>
              <Label>Bank Name</Label>
              <span className="text-red-500">*</span>
            </div>
            <Controller
              control={control}
              name="bankName"
              render={({ field }) => (
                <FormInput
                  {...field}
                  placeholder="Bank Name"
                />
              )}
            />
            <p className="text-sm text-red-600">{errors.bankName?.message}</p>
          </div>

          {/* Swift Code */}
          <div className="space-y-1.5">
            <div className='flex gap-1'>
              <Label>Swift Code</Label>
              <span className="text-red-500">*</span>
            </div>
            <Controller
              control={control}
              name="swiftCode"
              render={({ field }) => (
                <FormInput
                  {...field}
                  placeholder="Swift Code"
                />
              )}
            />
            <p className="text-sm text-red-600">{errors.swiftCode?.message}</p>
          </div>

          {/* Account Name */}
          <div className="space-y-1.5">
            <div className='flex gap-1'>
              <Label>Account Name</Label>
              <span className="text-red-500">*</span>
            </div>
            <Controller
              control={control}
              name="accountName"
              render={({ field }) => (
                <FormInput
                  {...field}
                  placeholder="Account Name"
                />
              )}
            />
            <p className="text-sm text-red-600">{errors.accountName?.message}</p>
          </div>

          {/* Account Number */}
          <div className="space-y-1.5">
            <div className='flex gap-1'>
              <Label>Account Number</Label>
              <span className="text-red-500">*</span>
            </div>
            <Controller
              control={control}
              name="accountNumber"
              render={({ field }) => (
                <FormInput
                  {...field}
                  inputMode="numeric"
                  placeholder="Account Number"
                />
              )}
            />
            <p className="text-sm text-red-600">{errors.accountNumber?.message}</p>
          </div>

          {/* Routing Number */}
          <div className="space-y-1.5">
            <div className='flex gap-1'>
              <Label>Routing Number</Label>
              <span className="text-red-500">*</span>
            </div>
            <Controller
              control={control}
              name="routingNumber"
              render={({ field }) => (
                <FormInput
                  {...field}
                  inputMode="numeric"
                  placeholder="Routing Number"
                />
              )}
            />
            <p className="text-sm text-red-600">{errors.routingNumber?.message}</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">Update Bank Account</Button>
        </DialogFooter>
      </form>
    </>
  )
}

export default UpdateBankDetailFrom;