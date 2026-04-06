import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useGetInvoicePreviewByinvoiceId } from '../apis/queries';
import Loader from '@/components/loader';
import { InvoicePreviewA4 } from '../components/invoice-preview';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import { useSubmitInvoice } from '../apis/mutation';

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

const InvoicePreviewPage: React.FC = () => {

    const {invoiceId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const { data, isPending } = useGetInvoicePreviewByinvoiceId(invoiceId as string)

    const { mutate: submitInvoice, isPending: isSubmittiingInvoice } = useSubmitInvoice()

    const generateInvoice = () => {
        submitInvoice({ invoiceId: invoiceId as string }, {
            onSuccess: () => {
                toast.success("Invoice Submitted Successfully")
                navigate(-1)
            }
        })
    }

    if (isPending || isSubmittiingInvoice) return <Loader />
  
    return (
        <div className='flex flex-col gap-2'>
            <InvoicePreviewA4 data={data?.data} />
            <div className='flex gap-2 justify-end fixed bottom-2 right-2'>
                <Button
                    variant='outline'
                    onClick={() => navigate(-1)}
                >
                    Cancel
                </Button>
                <Button onClick={() => generateInvoice()}>
                    Submit Invoice
                </Button>
            </div>
        </div>
    )
}

export default InvoicePreviewPage