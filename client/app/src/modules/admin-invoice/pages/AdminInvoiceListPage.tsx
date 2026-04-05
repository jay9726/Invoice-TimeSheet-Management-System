import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useNavigate, useParams } from 'react-router-dom'
import { useGetAdminClientInvoice } from '../apis/queries'
import { EyeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InvoiceStatusBadge } from '../components/invoice-status-badge'
import Loader from '@/components/loader'
import InvoiceDecisionDialog from '../components/invoice-dialog'
import Icon from '@/components/icon'
import { useDebounce } from '@/hooks/useDebounce'
import { FormInput } from '@/components/form-input'
import { useInvoicePreview } from '@/modules/invoice/apis/mutation'
import { InvoicePreviewA4, type InvoicePreviewResponse } from '@/modules/invoice/components/invoice-preview'
import { reactNodeToPdfBlobUrl } from '../components/invoice-component-to-pdf'
import ReportPdfViewer from '@/preview/ReportPdfViewer'
import { useToast } from '@/hooks/useToast'
import { openPdfInNewTab } from '@/preview/open-pdf-in-tab'
import ToolTips from '@/components/custome-tooltip'

type invoiceType = {
    invoiceId: string
    companyId: string
    clientId: string
    clientName: string
    totalAmount: number
    status: string
    invoiceDate: string
    invoiceNumber: string
    poNumber: string
}

const AdminInvoiceListPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const toast = useToast()

    const [search, setSearch] = useState("")
    const debouncedSearch = useDebounce(search, 500)

    const { data, isPending } = useGetAdminClientInvoice(id as string, debouncedSearch);


    useEffect(() => {
    }, [debouncedSearch])

    const [open, setOpen] = useState(false)
    const [invoiceId, setInvoiceId] = useState<string>("")


    const [pdfState, setPdfState] = useState<{ blobUrl: string; fileName: string } | null>(null)
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)



    const { mutate, isPending: isPreviewing } = useInvoicePreview()

    const previewInvoice = (clientId: string, clientName: string) => {
        mutate({ clientId: clientId }, {
            onSuccess: async (res: any) => {
                const invoiceData: InvoicePreviewResponse = res.data
                setIsGeneratingPdf(true)

                try {
                    const container = document.createElement("div")
                    container.style.cssText =
                        `position: fixed;
                        top: -9999px;
                        left: -9999px;
                        z-index: -1;
                        pointer-events: none;`

                    document.body.appendChild(container)

                    await new Promise<void>((resolve) => {
                        const root = ReactDOM.createRoot(container)
                        root.render(
                            <InvoicePreviewA4
                                data={invoiceData}
                                ref={(el) => {
                                    if (el) resolve()
                                }}
                            />
                        )
                    })

                    await new Promise(r => setTimeout(r, 300))

                    const el = container.firstElementChild as HTMLElement
                    const blobUrl = await reactNodeToPdfBlobUrl(el)

                    openPdfInNewTab(blobUrl, `Invoice-${clientName.replace(/\s+/g, "-")}.pdf`)


                    document.body.removeChild(container)

                } catch (err) {
                    toast.error("Failed to generate PDF preview:", err as string)
                } finally {
                    setIsGeneratingPdf(false)
                }

            },
            onError: (err: any) => {
                toast.error("Failed to generate PDF preview:", err as string)
            }
        })
    }

    const getContent = () => {
        if (isPending) {
            return <Loader />
        } else if (!data?.data?.length) {
            return (
                <TableRow>
                    <TableCell colSpan={9} className="h-20 text-center">
                        <p className="text-xl">No results found.</p>
                    </TableCell>
                </TableRow>
            )
        } else {
            return data.data.map((c: invoiceType) => (
                <TableRow
                    key={c.clientId}
                    className="group border-b"
                >
                    <TableCell className="p-4 text-center text-sm">{c.clientName ?? "-"}</TableCell>
                    <TableCell className="p-4 text-center text-sm">{c.invoiceNumber ?? "-"}</TableCell>
                    <TableCell className="p-4 text-center text-sm">{c.poNumber ?? "-"}</TableCell>
                    <TableCell className="p-4 text-center text-sm">{c.invoiceDate ?? "-"}</TableCell>
                    <TableCell className="p-4 text-center text-sm">{c.totalAmount ?? "-"}</TableCell>
                    <TableCell className="p-4 text-center text-sm">
                        <InvoiceStatusBadge status={c.status} />
                    </TableCell>
                    <TableCell className="p-4 text-center text-sm">
                        <ToolTips children={
                            <Button variant='ghost' onClick={() => previewInvoice(c.clientId, c.clientName)}>
                                {
                                    isGeneratingPdf || isPreviewing ? <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> :
                                        <EyeIcon className="w-5 h-5 text-primary" />
                                }
                            </Button>}
                            lable="Invoice Preview"
                        />
                    </TableCell>
                    <TableCell className="p-4 text-center text-sm">
                        <Button onClick={() => { setOpen(true); setInvoiceId(c.invoiceId) }} disabled={isGeneratingPdf || isPreviewing}>
                            Review
                        </Button>
                    </TableCell>
                </TableRow>
            ))
        }
    }

    return (
        <>
            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold">All Client's Invoices</h1>
                    <Button onClick={() => navigate(-1)}><Icon name="leftArrow" />Back</Button>
                </div>
                <div className='flex justify-end'>
                    <FormInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search Invoice Number, PO Number..."
                        className="max-w-sm"
                    />
                </div>

                <div className="rounded-md shadow-sm">
                    <Table className='border border-border'>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">Client Name</TableHead>
                                <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">Invoice Number</TableHead>
                                <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">PO Number</TableHead>
                                <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">Invoice Date</TableHead>
                                <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">Total Amount</TableHead>
                                <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">Status</TableHead>
                                <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">Preview</TableHead>
                                <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>{getContent()}</TableBody>
                    </Table>
                </div>

                <p className="text-sm font-bold">Total : {data?.count}</p>

                <InvoiceDecisionDialog open={open} onOpenChange={setOpen} invoiceId={invoiceId} />
            </div>

            {pdfState && (
                <ReportPdfViewer
                    blobUrl={pdfState.blobUrl}
                    fileName={pdfState.fileName}
                    onClose={() => {
                        URL.revokeObjectURL(pdfState.blobUrl)
                        setPdfState(null)
                    }}
                />
            )}
        </>
    )
}

export default AdminInvoiceListPage
