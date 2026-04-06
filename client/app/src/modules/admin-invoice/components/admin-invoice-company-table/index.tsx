import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { NavLink } from "react-router-dom"
import Icon from '@/components/icon'
import ToolTips from '@/components/custome-tooltip'
import type { companyType } from '@/types/company'


interface adminInvoiceCompanyProps {
    data: any,
    emptyText: string
}


const AdminInvoiceCompanyTable: React.FC<adminInvoiceCompanyProps> = ({ data, emptyText }) => {
    return (
        <>
            <div className="max-h-115 overflow-y-auto rounded-md  shadow-sm">
                <Table className='border border-border'>
                    <TableHeader>
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
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data?.length ? (
                            data.map((c: companyType) => {
                                const status = !!c.isActive

                                return (
                                    <TableRow
                                        key={c.companyId}
                                        className="group border-b "
                                    >
                                        <TableCell className="p-4 text-center text-sm">
                                            <div className='flex gap-2 items-center'>
                                                <img
                                                    src={`${import.meta.env.VITE_IMAGE}/${c.companyLogo.replace(/^\/+/, '')}?t=${Date.now()}`}

                                                    className="h-10 w-10 object-cover rounded-full"
                                                />
                                                {c.companyName ?? "-"}
                                            </div>
                                        </TableCell>

                                        <TableCell className="p-4 text-center text-sm">
                                            {c.addressLine1 ?? "-"}
                                        </TableCell>

                                        <TableCell className="p-4 text-center text-sm">
                                            {c.country ?? "-"}
                                        </TableCell>

                                        <TableCell className="p-4 text-center text-sm">
                                            {c.state ?? "-"}
                                        </TableCell>

                                        <TableCell className="p-4 text-center text-sm">
                                            {c.city ?? "-"}
                                        </TableCell>


                                        <TableCell className="p-4 text-center text-sm">
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



                                        <TableCell className="p-4 text-center">
                                            <ToolTips children={
                                                <NavLink to={`/admin/invoices/${c.companyId}/client/invoices`}
                                                    className="cursor-pointer text-primary">
                                                    <Icon name="openEye" width={18} height={18} />
                                                </NavLink>}
                                                lable="Client's Invoices"
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} className="h-32 text-center">
                                    <p className="font-medium">{emptyText || "No results found."}</p>

                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

        </>
    )
}

export default AdminInvoiceCompanyTable