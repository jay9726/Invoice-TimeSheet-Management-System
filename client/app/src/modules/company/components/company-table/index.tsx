import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/icon"
import { NavLink } from "react-router-dom"
import type { companyType } from "@/types/company"
import { useState } from "react"
import ConfirmModal from "@/components/confirm-modal"
import { useDeleteCompany, useUpdateCompanyStatus } from "../../apis/mutation"
import { useToast } from "@/hooks/useToast"
import ActiveInactiveModal from "@/components/active-inactive-modal"
import ToolTips from "@/components/custome-tooltip"

interface companyTableProps {
    data?: companyType[]
    emptyText?: string
    onOpenUpdate: (companyId: string) => void
}

const CompanyTable: React.FC<companyTableProps> = ({ data, emptyText = "No records found", onOpenUpdate }) => {

    const toast = useToast();

    const [open, setOpen] = useState(false)
    const [statusOpen, statusSetOpen] = useState(false)
    const [selectID, setSelectID] = useState<string>("")
    const [status, setStatus] = useState<boolean>(false)

    const { mutate: deleteCompany } = useDeleteCompany();
    const { mutate: updateCompanyStatus } = useUpdateCompanyStatus();

    const compnaydelete = () => {
        deleteCompany(selectID, {
            onSuccess: () => {
                toast.success("Company Deleted Successfully");
                setOpen(false)
            },
            onError: () => {
                toast.error("Fail To Delete Company!!! Try Again");
            }
        })
    }

    const CompanyStatusChange = () => {
        updateCompanyStatus({ companyId: selectID, status: status }, {
            onSuccess: () => {
                toast.success("Company Status Updated Successfully");
                statusSetOpen(false)
            },
            onError: () => {
                toast.error("Fail To Update Company Status!!! Try Again");
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
                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase  tracking-wider">
                                Company Name
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Address
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase  tracking-wider">
                                Country
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase  tracking-wider">
                                State
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase  tracking-wider">
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

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase  tracking-wider">
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
                                        key={c.companyId}
                                        className="group border-b transition-colors hover:bg-slate-50/80 data-[state=selected]:bg-slate-100"
                                    >
                                        <TableCell className="p-4 text-center text-sm text-slate-700">
                                            <div className="flex gap-2 justify-start items-center">
                                                <img
                                                    src={`https://localhost:7273/${c.companyLogo}`}
                                                    alt="logo"
                                                    className="h-10 w-10 object-cover rounded-full"
                                                />
                                                {c.companyName ?? "-"}
                                            </div>
                                        </TableCell>


                                        <TableCell className="p-4 text-center text-sm text-slate-700">
                                            {c.addressLine1 ?? "-"}
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
                                                    onClick={() => { statusSetOpen(true); setSelectID(c.companyId as string); setStatus(!c.isActive); }}
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
                                                    onClick={() => onOpenUpdate(c.companyId as string)}
                                                >
                                                    <Icon name="update" width={18} height={18} />
                                                </Button>}
                                                lable="Update"
                                            />

                                            <ToolTips children={
                                                <Button
                                                    variant="link"
                                                    className="hover:cursor-pointer hover:text-secondary"
                                                    onClick={() => { setOpen(true), setSelectID(c.companyId as string) }}
                                                >
                                                    <Icon name="delete" width={18} height={18} stroke="red" />
                                                </Button>}
                                                lable="Delete"
                                            />
                                        </TableCell>

                                        <TableCell className="p-4 text-center">
                                            <ToolTips children={

                                                <NavLink to={`/admin/companies/detail/${c.companyId}`}
                                                    className="cursor-pointer text-primary">
                                                    <Icon name="openEye" width={18} height={18} />
                                                </NavLink>}
                                                lable="See More Detail"
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} className="h-32 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <p className="font-medium">{emptyText || "No results found."}</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <ConfirmModal
                open={open}
                setOpen={setOpen}
                confirmAction={() => compnaydelete()}
            />

            <ActiveInactiveModal
                open={statusOpen}
                setOpen={statusSetOpen}
                confirmAction={() => CompanyStatusChange()}
            />
        </>
    )
}

export default CompanyTable
