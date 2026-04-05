import React, { useEffect, useState } from 'react'
import Loader from '@/components/loader';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useDebounce } from '@/hooks/useDebounce';
import { setCurrentPage, setTotalItems, setTotalPages } from '@/redux/slices/paginationSlice';
import Paggination from '@/components/pagination-component';
import { FormInput } from '@/components/form-input';
import { useGetAdminCompaniesForInvoice } from '../apis/queries';
import AdminInvoiceCompanyTable from '../components/admin-invoice-company-table';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminInvoiceCompanyPage: React.FC = () => {

    const dispatch = useAppDispatch()
    const { currentPage, itemPerPage, totalPages } = useAppSelector((state) => state.pagination)


    const [search, setSearch] = useState("")
    const debouncedSearch = useDebounce(search, 500)


    useEffect(() => {
        dispatch(setCurrentPage(1))
    }, [debouncedSearch, dispatch])


    const { data, isLoading } = useGetAdminCompaniesForInvoice(currentPage, itemPerPage, debouncedSearch)

    useEffect(() => {
        if (data?.count == null) return
        const pages = Math.max(1, Math.ceil(data.count / itemPerPage))
        dispatch(setTotalPages(pages))
    }, [dispatch, data?.count, itemPerPage])

    const list = data?.data ?? []

    const getContent = () => {
        if (isLoading) return <Loader />

        return (
            <>

                <AdminInvoiceCompanyTable
                    data={list}
                    emptyText={debouncedSearch ? "No matching company found" : "No records found"}
                />

                <div className="flex">
                    <h1 className="text-sm font-bold">Total : {data?.count}</h1>
                    <Paggination
                        currentPage={currentPage}
                        totalPages={totalPages || 1}
                        setCurrentPage={(page: number) => dispatch(setCurrentPage(page))}
                    />
                    <div>
                        <Select defaultValue={itemPerPage.toString()} onValueChange={(value: string) => dispatch(setTotalItems(Number(value)))}>
                            <SelectTrigger className="min-w-15">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="15">15</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className="flex flex-col gap-5">
            <div className='grid grid-cols-2 items-center'>
                <h1 className=" text-xl font-bold">All Companies List For Invoices</h1>
                <div className="flex justify-end items-center">
                    <FormInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search company, address, contact, state, city, zip..."
                        className="max-w-sm"
                    />
                </div>
            </div>

            {getContent()}


        </div>
    )
}

export default AdminInvoiceCompanyPage