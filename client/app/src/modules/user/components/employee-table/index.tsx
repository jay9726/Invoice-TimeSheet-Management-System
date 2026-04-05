import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/icon"
import { useToast } from "@/hooks/useToast"
import type { employeeType } from '@/types/timesheet'
import ConfirmModal from '@/components/confirm-modal'
import { useDeleteEmployee, useUpdateEmployeeStatus } from '../../apis/mutation'
import ActiveInactiveModal from '@/components/active-inactive-modal'
import ToolTips from '@/components/custome-tooltip'

interface employeeTableProps {
    data?: employeeType[]
    emptyText?: string
    onOpenUpdate: (employeeId: string) => void
}

const EmployeeTable: React.FC<employeeTableProps> = ({ data, emptyText = "No records found", onOpenUpdate }) => {

    const [open, setOepn] = useState(false)
    const [statusOpen, statusSetOpen] = useState(false)
    const [selectID, setSelectID] = useState<string>("")
    const [status, setStatus] = useState<boolean>(false)

    const toast = useToast()

    const { mutate: deleteEmployee } = useDeleteEmployee()
    const { mutate: updateEmployeeStatus } = useUpdateEmployeeStatus()

    const employeeDelete = () => {
        deleteEmployee(selectID, {
            onSuccess: () => {
                toast.success("Employee Deleted Successfully")
                setOepn(false)
            },
            onError: () => {
                toast.error("Fail To Delete Employee!!! Try Again")
            }
        })
    }

    const EmployeeStatusChange = () => {
        updateEmployeeStatus({ employeeId: selectID, status: status }, {
            onSuccess: () => {
                toast.success("User Status Updated Successfully");
                statusSetOpen(false)
            },
            onError: () => {
                toast.error("Fail To Update User Status!!! Try Again");
                statusSetOpen(true)
            }
        })
    }

    return (
        <>
            <div className="max-h-115 overflow-y-auto  rounded-md border shadow-sm">
                <Table className='border border-border'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">Name</TableHead>
                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">Email</TableHead>
                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">Role</TableHead>
                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">Status</TableHead>
                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">Active/Inactive</TableHead>
                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data?.length ? (
                            data?.map((u) => (
                                <TableRow key={u.employeeId}>
                                    <TableCell className="text-center">{u.fullName}</TableCell>
                                    <TableCell className="text-center">{u.email}</TableCell>
                                    <TableCell className="text-center">{u.role}</TableCell>
                                    <TableCell className="text-center">
                                        {u.isActive ? (
                                            <Badge variant="link" className="text-green-500">
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge variant="link" className="text-red-500">
                                                Inactive
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <ToolTips children={
                                            <Button variant='link' className='hover:cursor-pointer hover:text-secondary'
                                                onClick={() => { statusSetOpen(true); setSelectID(u.employeeId as string); setStatus(!u.isActive); }}
                                            >
                                                {
                                                    u.isActive ? <Icon name="squarecheck" width={20} height={25} className='text-green-500' /> : <Icon name="squareUnCheck" width={20} height={25} stroke="red" />
                                                }
                                            </Button>}
                                            lable="Change Status"
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <ToolTips children={
                                            <Button
                                                variant="link"
                                                className="hover:cursor-pointer hover:text-secondary"
                                                onClick={() => onOpenUpdate(u.employeeId)}
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
                                                    setSelectID(u.employeeId)
                                                }}
                                            >
                                                <Icon name="delete" width={18} height={18} stroke="red" />
                                            </Button>}
                                            lable="Delete"
                                        />
                                    </TableCell>

                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                                    <p className="font-medium">{emptyText || "No results found"}</p>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <ConfirmModal
                open={open}
                setOpen={setOepn}
                confirmAction={() => employeeDelete()}
            />

            <ActiveInactiveModal
                open={statusOpen}
                setOpen={statusSetOpen}
                confirmAction={() => EmployeeStatusChange()}
            />

        </>

    )
}

export default EmployeeTable