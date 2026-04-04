import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/icon"
import { useState } from "react"
import ConfirmModal from "@/components/confirm-modal"
import { useToast } from "@/hooks/useToast"
import type { bankDetailType } from '@/types/bankDetail'
import { useDeleteBankDetail, useUpdateBankDetailStatus } from '../../apis/mutation'
import ActiveInactiveModal from '@/components/active-inactive-modal'
import ToolTips from '@/components/custome-tooltip'

interface bankDetailTableProps {
    data?: bankDetailType[]
    emptyText?: string
    onOpenUpdate: (bankDetailId: string) => void
}

const BankDetailTable: React.FC<bankDetailTableProps> = ({ data, emptyText = "No records found", onOpenUpdate }) => {

    const [open, setOepn] = useState(false)
    const [statusOpen, statusSetOpen] = useState(false)
    const [selectID, setSelectID] = useState<string>("")
    const [status, setStatus] = useState<boolean>(false)

    const toast = useToast();

    const { mutate: deleteBankDetails } = useDeleteBankDetail();
    const { mutate: updateBankDetailStatus } = useUpdateBankDetailStatus();

    const bankdetaildelete = () => {
        deleteBankDetails(selectID, {
            onSuccess: () => {
                toast.success("Company Bank Detail Deleted Successfully");
                setOepn(false)
            },
            onError: () => {
                toast.error("Fail To Delete Company Bank Detail!!! Try Again");
            }
        })
    }

    const BankAccountStatusChange = () => {
        updateBankDetailStatus({ bankDetailId: selectID, status: status }, {
            onSuccess: () => {
                toast.success("Bank Account Status Updated Successfully");
                statusSetOpen(false)
            },
            onError: () => {
                toast.error("Fail To Update Bank Account Status!!! Try Again");
                statusSetOpen(true)
            }
        })
    }



    return (
        <>
            <div className="max-h-115 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Bank Name
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Swift Code
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Account Name
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Account Number
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Routing Number
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Status
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Active/Inactive
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data?.length ? (
                            data.map((b) => {
                                const status = !!b.isActive

                                return (
                                    <TableRow
                                        key={b.bankDetailId}
                                        className="group border-b transition-colors hover:bg-slate-50/80 data-[state=selected]:bg-slate-100"
                                    >
                                        <TableCell className="p-4 text-center text-sm text-slate-700">
                                            {b.bankName ?? "-"}
                                        </TableCell>

                                        <TableCell className="p-4 text-center text-sm text-slate-700">
                                            {b.swiftCode ?? "-"}
                                        </TableCell>

                                        <TableCell className="p-4 text-center text-sm text-slate-700">
                                            {b.accountName ?? "-"}
                                        </TableCell>

                                        <TableCell className="p-4 text-center text-sm text-slate-700">
                                            {b.accountNumber ?? "-"}
                                        </TableCell>

                                        <TableCell className="p-4 text-center text-sm text-slate-700">
                                            {b.routingNumber ?? "-"}
                                        </TableCell>

                                        <TableCell className="p-4 text-center text-sm">
                                            {status ? (
                                                <Badge variant="link" className="text-green-500">
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge variant="link" className="text-red-500">
                                                    Inactive
                                                </Badge>
                                            )}
                                        </TableCell>

                                        <TableCell className="p-4 text-center text-sm">
                                            <ToolTips children={
                                                <Button variant='link' className='hover:cursor-pointer hover:text-secondary'
                                                    onClick={() => { statusSetOpen(true); setSelectID(b.bankDetailId as string); setStatus(!b.isActive); }}
                                                >
                                                    {
                                                        status ? <Icon name="squarecheck" width={20} height={25} className='text-green-500' /> : <Icon name="squareUnCheck" width={20} height={25} stroke="red" />
                                                    }
                                                </Button>}
                                                lable="Change Status"
                                            />
                                        </TableCell>

                                        <TableCell className="p-4 text-center">
                                            <ToolTips children={
                                                <Button
                                                    variant="link"
                                                    className="hover:cursor-pointer hover:text-secondary"
                                                    onClick={() => onOpenUpdate(b.bankDetailId as string)}
                                                >
                                                    <Icon name="update" width={18} height={18} />
                                                </Button>}
                                                lable="Update"
                                            />

                                            <ToolTips children={
                                                <Button
                                                    variant="link"
                                                    className="hover:cursor-pointer hover:text-secondary"
                                                    onClick={() => { setOepn(true), setSelectID(b.bankDetailId as string) }}
                                                >
                                                    <Icon name="delete" width={18} height={18} stroke="red" />
                                                </Button>}
                                                lable="Delete"
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="h-32 text-center text-slate-500">
                                    <p className="font-medium">{emptyText || "No results found."}</p>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <ConfirmModal
                open={open}
                setOpen={setOepn}
                confirmAction={() => bankdetaildelete()}
            />

            <ActiveInactiveModal
                open={statusOpen}
                setOpen={statusSetOpen}
                confirmAction={() => BankAccountStatusChange()}
            />
        </>
    )
}

export default BankDetailTable
