import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { NavLink } from "react-router-dom"


interface adminCompanyProps {
    data: any,
    emptyText: string
}

const AdminCompanyTable: React.FC<adminCompanyProps> = ({ data, emptyText }) => {

    return (
        <>
            <div className="rounded-md border border-slate-200 bg-white shadow-sm">
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

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase  tracking-wider">
                                View
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data?.length ? (
                            data.map((c: any) => {
                                const status = !!c.isActive

                                return (
                                    <TableRow
                                        key={c.companyId}
                                        className="group border-b transition-colors hover:bg-slate-50/80 data-[state=selected]:bg-slate-100"
                                    >
                                        <TableCell className="p-4 text-center text-sm text-slate-700">
                                            {c.companyName ?? "-"}
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



                                        <TableCell className="p-4 text-center">
                                            <NavLink to={`/admin/invoices/${c.companyId}/client/invoices`}
                                                className="cursor-pointer text-primary">
                                                Client's Invoices
                                            </NavLink>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} className="h-32 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <p className="font-medium">{emptyText || "No results found."}</p>
                                        <p className="text-xs text-slate-400">
                                            Try adjusting your filters or search terms.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

        </>
    )
}

export default AdminCompanyTable