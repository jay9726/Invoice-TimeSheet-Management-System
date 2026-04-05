import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/icon"
import { useState } from "react"
import ConfirmModal from "@/components/confirm-modal"
import { useToast } from "@/hooks/useToast"
import type { projectType } from '@/types/project'
import { useDeleteProject, useUpdateProjectStatus } from '../../apis/mutation'
import ActiveInactiveModal from '@/components/active-inactive-modal'
import ToolTips from '@/components/custome-tooltip'


interface projectTableProps {
    data?: projectType[]
    emptyText?: string
    onOpenUpdate: (projectId: string) => void
}


const ProjectTable: React.FC<projectTableProps> = ({ data, emptyText = "No records found", onOpenUpdate }) => {

    const [open, setOepn] = useState(false)
    const [statusOpen, statusSetOpen] = useState(false)
    const [selectID, setSelectID] = useState<string>("")
    const [status, setStatus] = useState<boolean>(false)

    const toast = useToast()

    const { mutate: deleteProject } = useDeleteProject()
    const { mutate: updateProjectStatus } = useUpdateProjectStatus()

    const projectDelete = () => {
        deleteProject(selectID, {
            onSuccess: () => {
                toast.success("Project Deleted Successfully")
                setOepn(false)
            },
            onError: () => {
                toast.error("Fail To Delete Project!!! Try Again")
            }
        })
    }

    const ProjectStatusChange = () => {
        updateProjectStatus({ projectId: selectID, status: status }, {
            onSuccess: () => {
                toast.success("Project Status Updated Successfully");
                statusSetOpen(false)
            },
            onError: () => {
                toast.error("Fail To Update Project Status!!! Try Again");
                statusSetOpen(true)
            }
        })
    }


    return (
        <>
            <div className="max-h-115 overflow-y-auto rounded-md shadow-sm">
                <Table className='border border=border'>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Client Name
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Project Name
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Rate / Hour
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
                            data.map((p) => {
                                const status = !!p.isActive

                                return (
                                    <TableRow
                                        key={p.projectId}
                                        className="group border-b"
                                    >
                                        <TableCell className="p-4 text-center text-sm">
                                            {p.clientName ?? "-"}
                                        </TableCell>

                                        <TableCell className="p-4 text-center text-sm">
                                            {p.projectName ?? "-"}
                                        </TableCell>

                                        <TableCell className="p-4 text-center text-sm">
                                            {p.hourlyRate ?? "-"}
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
                                                <Button variant='link' className='hover:cursor-pointer'
                                                    onClick={() => { statusSetOpen(true); setSelectID(p.projectId as string); setStatus(!p.isActive); }}
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
                                                    className="hover:cursor-pointer"
                                                    onClick={() => onOpenUpdate(p.projectId as string)}
                                                >
                                                    <Icon name="update" width={18} height={18} />
                                                </Button>}
                                                lable="Update"
                                            />

                                            <ToolTips children={
                                                <Button
                                                    variant="link"
                                                    className="hover:cursor-pointer"
                                                    onClick={() => {
                                                        setOepn(true)
                                                        setSelectID(p.projectId as string)
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
                                <TableCell colSpan={6} className="h-32 text-center ">
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
                confirmAction={() => projectDelete()}
            />

            <ActiveInactiveModal
                open={statusOpen}
                setOpen={statusSetOpen}
                confirmAction={() => ProjectStatusChange()}
            />
        </>
    )
}

export default ProjectTable