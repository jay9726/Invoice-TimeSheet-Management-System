import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Loader from '@/components/loader';
import { useGetClientByCompanyId } from '../apis/queries';
import { Button } from '@/components/ui/button';
import Icon from '@/components/icon';
import { SessionAuthentication } from '@/modules/auth/guards/SessisonAuthentication';
import { useToast } from '@/hooks/useToast';
import { useGenerateInvoice } from '../apis/mutation';
import Paggination from '@/components/pagination-component';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setCurrentPage, setTotalPages } from '@/redux/slices/paginationSlice';
import { useDebounce } from '@/hooks/useDebounce';
import { FormInput } from '@/components/form-input';
import { InvoiceStatusBadge } from '@/modules/admin-invoice/components/invoice-status-badge';
import { decompressFromEncodedURIComponent } from 'lz-string';



type invoiceItemsType = {
    quantity: number,
    description: string,
    rate: number,
    fromDate: string,
    toDate: string,
    amount: number
}

export type createInvoiceType = {
    companyId: number,
    clientId: number,
    invoiceDate: string,
    poNumber: string,
    paymentTerms: string,
    totalAmount: number,
    status: string,
    items: invoiceItemsType[]
}




const ClientInvoiceListPage: React.FC = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const session = SessionAuthentication.getSession();
    const decrpyEmployeeId = decompressFromEncodedURIComponent(session?.id as string);

    const dispatch = useAppDispatch()
    const { currentPage, itemPerPage, totalPages } = useAppSelector((state: any) => state.pagination)


    const [search, setSearch] = useState("")
    const debouncedSearch = useDebounce(search, 500)
    const { data: clientData, isPending: isClientPending } = useGetClientByCompanyId(id as string, currentPage, itemPerPage, debouncedSearch)

    useEffect(() => {
        dispatch(setCurrentPage(1))
    }, [debouncedSearch, dispatch])


    useEffect(() => {
        if (clientData?.count == null) return
        const pages = Math.max(1, Math.ceil(clientData.count / itemPerPage))
        dispatch(setTotalPages(pages))
    }, [dispatch, clientData?.count, itemPerPage])


    const { mutate, isPending: isCreatingInvoice } = useGenerateInvoice()

    const generateInvoice = (clientId: string) => {
        mutate({ userId: decrpyEmployeeId, clientId: clientId }, {
            onSuccess: (res) => {
                if (res.data.isCreated === true) {
                    navigate(`/accountuser/invoice/${clientId}/preview/${res.data.invoiceId}`)
                    toast.success("Invoice Is Alredy Created All The Data Is Updated")
                } else {
                    navigate(`/accountuser/invoice/${clientId}/preview/${res.data.invoiceId}`)
                    toast.success("Invoice Generated Successfully")
                }
            }
        })
    }


    const getContent = () => {

        if (isClientPending || isCreatingInvoice) {
            return <Loader />
        } else if (clientData?.count == 0) {
            return (
                <TableRow>
                    <TableCell colSpan={3} className="h-32 text-center text-slate-500">
                        <p className="font-medium">No Client's Found.</p>
                    </TableCell>
                </TableRow>
            )
        } else {
            return (
                clientData?.data.map((client: any) => {
                    return (
                        <TableRow
                            key={client.companyId}
                            className="group border-b transition-colors hover:bg-slate-50/80 data-[state=selected]:bg-slate-100"
                        >
                            <TableCell className="p-2 text-center text-sm text-slate-700">
                                {client.clientName ?? "-"}
                            </TableCell>

                            <TableCell className="p-2 text-center text-sm text-slate-700">
                                <InvoiceStatusBadge status={client.invoiceStatus ? client.invoiceStatus : "NOT_GENERATED"} />
                            </TableCell>
                            <TableCell className="p-2 text-center text-sm text-slate-700">
                                <Button
                                    variant='link'
                                    className='cursor-pointer'
                                    disabled={client.invoiceStatus == "SUBMITTED" || client.invoiceStatus == "PAID" || client.invoiceStatus == "FINALIZED"}
                                    onClick={() => generateInvoice(client.clientId)}>
                                    Generate Invoice
                                </Button>
                            </TableCell>
                        </TableRow >
                    )
                })
            )
        }
    }

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex justify-between items-center'>
                <h1 className="text-xl font-bold text-secondary">Company's Client/Invoices</h1>
                <Button onClick={() => navigate('/accountuser/invoice')}> <Icon name='leftArrow' /> Back</Button>
            </div>
            <FormInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Client..."
                className="max-w-sm"
            />
            <div className="rounded-md border border-slate-200 bg-white shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase  tracking-wider">
                                Client Name
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Invoice Status
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase  tracking-wider">
                                Generate Invoice
                            </TableHead>

                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {getContent()}
                    </TableBody>
                </Table>
            </div>
            <div className="flex">
                <h1 className="text-sm font-bold">Total : {clientData?.count}</h1>
                <Paggination
                    currentPage={currentPage}
                    totalPages={totalPages || 1}
                    setCurrentPage={(page: number) => dispatch(setCurrentPage(page))}
                />
            </div>
        </div>
    )
}

export default ClientInvoiceListPage
