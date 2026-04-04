import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useTimsheetHistoryByEmployeeId } from "../apis/queries"
import Loader from "@/components/loader"
import { SessionAuthentication } from "@/modules/auth/guards/SessisonAuthentication"
import { decompressFromEncodedURIComponent } from "lz-string"


const TaskSheetHistoryPage = () => {

    const session = SessionAuthentication.getSession();
    const decrpyEmployeeId = decompressFromEncodedURIComponent(session?.id as string);
    const { data, isPending } = useTimsheetHistoryByEmployeeId(decrpyEmployeeId)

    const getContent = () => {
        if (isPending) {
            return <Loader />
        } else if (data.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center">
                        <div className="mx-auto max-w-sm">
                            <p className="text-sm font-medium">No records found</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Once you add timesheet actions, they’ll appear here.
                            </p>
                        </div>
                    </TableCell>
                </TableRow>
            )
        } else {
            return (
                data.map((r: any, idx: number) => (
                    <TableRow
                        key={`${r.timesheetDate}-${idx}`}
                        className="transition-colors hover:bg-primary/5"
                    >

                        <TableCell className="p-4 text-center text-sm text-slate-700">
                            {r.timesheetDate}
                        </TableCell>

                        <TableCell className="p-4 text-center text-sm text-slate-700">
                            {r.status ? (
                                <Badge
                                    className={cn(
                                        "w-fit rounded-full",
                                        r.status === "APPROVED" &&
                                        "bg-green-500/10 text-green-700 hover:bg-amber-500/10",
                                        r.status === "REJECTED" &&
                                        "bg-destructive/10 text-destructive hover:bg-destructive/10"
                                    )}
                                >
                                    {r.status}
                                </Badge>
                            ) : null}
                        </TableCell>

                        <TableCell className="p-4 text-center text-sm text-slate-700">
                            {r.comment || "--"}
                        </TableCell>


                        <TableCell className="p-4 text-center text-sm text-slate-700">{r.actionBy || "--"}
                        </TableCell>


                        <TableCell className="p-4 text-center text-sm text-slate-700">{r.actionDate || "--"}
                        </TableCell>


                        <TableCell className="p-4 text-center text-sm text-slate-700">{r.remarks || "--"}
                        </TableCell>
                    </TableRow>
                ))
            )
        }
    }


    return (
        <div className='flex flex-col gap-5'>
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-secondary">Timesheet History</h2>
                <p className="text-sm text-muted-foreground">Date-wise comments and approvals with remarks.</p>
            </div>

            <div className="rounded-xl border bg-white shadow-sm">
                <div className="w-full overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase  tracking-wider">Timesheet</TableHead>
                                <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase  tracking-wider">Status</TableHead>
                                <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase  tracking-wider">Comment</TableHead>
                                <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase  tracking-wider">Action By</TableHead>
                                <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase  tracking-wider">Action Date</TableHead>
                                <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase  tracking-wider">Remarks</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>

                            {getContent()}

                        </TableBody>
                    </Table>
                </div>
            </div>
            <h1 className="text-sm font-bold">Total : {data?.length || 0}</h1>

        </div>
    )
}


export default TaskSheetHistoryPage;