import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/icon"
import { useState } from "react"
import ConfirmModal from "@/components/confirm-modal"
import { useToast } from "@/hooks/useToast"
import type { clientType } from '@/types/client'
import { useDeleteClient, useUpdateClientStatus } from '../../apis/mutation'
import ActiveInactiveModal from '@/components/active-inactive-modal'
import ToolTips from '@/components/custome-tooltip'

interface clientTableProps {
    data?: clientType[]
    emptyText?: string
    onOpenUpdate: (companyId: string) => void
}

const ClientTable: React.FC<clientTableProps> = ({ data, emptyText = "No records found", onOpenUpdate }) => {

    const [open, setOepn] = useState(false)
    const [statusOpen, statusSetOpen] = useState(false)
    const [selectID, setSelectID] = useState<string>("")
    const [status, setStatus] = useState<boolean>(false)

    const toast = useToast()

    const { mutate: deleteClient } = useDeleteClient()
    const { mutate: updateClientStatus } = useUpdateClientStatus()

    const clientDelete = () => {
        deleteClient(selectID, {
            onSuccess: () => {
                toast.success("Client Deleted Successfully")
                setOepn(false)
            },
            onError: () => {
                toast.error("Fail To Delete Client!!! Try Again")
            }
        })
    }

    const ClientStatusChange = () => {
        updateClientStatus({ clientId: selectID, status: status }, {
            onSuccess: () => {
                toast.success("Client Status Updated Successfully");
                statusSetOpen(false)
            },
            onError: () => {
                toast.error("Fail To Update Client Status!!! Try Again");
                statusSetOpen(true)
            }
        })
    }

    return (
        <>
            <div className="max-h-115 overflow-y-auto rounded-cmd border border-slate-200 bg-white shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Company Name
                            </TableHead>
                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Client Name
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Address
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Contact
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Country
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                State
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                City
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Zip code
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
                            data.map((c) => {
                                const status = !!c.isActive

                                return (
                                    <TableRow
                                        key={c.clientId}
                                        className="group border-b transition-colors hover:bg-slate-50/80 data-[state=selected]:bg-slate-100"
                                    >
                                        <TableCell className="p-4 text-center text-sm text-slate-700">
                                            {c.companyName ?? "-"}
                                        </TableCell>
                                        <TableCell className="p-4 text-center text-sm text-slate-700">
                                            {c.clientName ?? "-"}
                                        </TableCell>

                                        <TableCell className="p-4 text-center text-sm text-slate-700">
                                            {c.addressLine1 ?? "-"}
                                        </TableCell>

                                        <TableCell className="p-4 text-center text-sm text-slate-700">
                                            {c.contactNumber ?? "-"}
                                        </TableCell>

                                        <TableCell className="p-4 text-center text-sm text-slate-700">
                                            {c.country ?? "-"}
                                        </TableCell>

                                        <TableCell className="p-4 text-center text-sm text-slate-700">
                                            {c.state ?? "-"}
                                        </TableCell>

                                        <TableCell className="p-4 text-center text-sm text-slate-700">
                                            {c.city ?? "-"}
                                        </TableCell>


                                        <TableCell className="p-4 text-center text-sm text-slate-700">
                                            {c.zip ?? "-"}
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
                                                    onClick={() => { statusSetOpen(true); setSelectID(c.clientId as string); setStatus(!c.isActive); }}
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
                                                    onClick={() => onOpenUpdate(c.clientId as string)}
                                                >
                                                    <Icon name="update" width={18} height={18} />
                                                </Button>}
                                                lable="Update"
                                            />

                                            <ToolTips children={
                                                <Button
                                                    variant="link"
                                                    className="hover:cursor-pointer hover:text-secondary"
                                                    onClick={() => {
                                                        setOepn(true)
                                                        setSelectID(c.clientId as string)
                                                    }}
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
                                <TableCell colSpan={10} className="h-32 text-center text-slate-500">
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
                confirmAction={() => clientDelete()}
            />

            <ActiveInactiveModal
                open={statusOpen}
                setOpen={statusSetOpen}
                confirmAction={() => ClientStatusChange()}
            />
        </>
    )
}

export default ClientTable