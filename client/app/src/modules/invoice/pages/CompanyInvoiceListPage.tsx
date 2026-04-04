import React from 'react'
import { useEffect, useState } from "react"
import Loader from "@/components/loader"
import { FormInput } from "@/components/form-input"
import { useDebounce } from "@/hooks/useDebounce"
import CompanyCard, { type companyObjectType } from '../components/company-card'
import { useGetCompaniesForInvoice } from '../apis/queries'

const CompanyInvoiceListPage: React.FC = () => {

    const [search, setSearch] = useState("")
    const debouncedSearch = useDebounce(search, 500)

    useEffect(() => {
    }, [debouncedSearch])

    const { data, isLoading } = useGetCompaniesForInvoice(debouncedSearch);

    useEffect(() => {
        if (data?.count == null) return
    }, [data?.count])


    const getContent = () => {
        if (isLoading) {
            return <Loader />
        } else if (data?.count == 0) {
            return (
                <div className="rounded-2xl border bg-background p-8 text-center text-muted-foreground">
                    No companies found.
                </div>
            )

        } else {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data?.data.map((company: companyObjectType) => (
                        <CompanyCard data={company} />))
                    }
                </div>
            )
        }
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="grid sm:grid-cols-2 items-center">
                <h1 className="text-xl font-bold text-secondary">All Companies For Invoices</h1>
                <div className="flex justify-end items-center gap-2">
                    <FormInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search company, address, city, state, zip..."
                        className="max-w-sm"
                    />
                </div>
            </div>

            {getContent()}

        </div>
    )
}

export default CompanyInvoiceListPage
