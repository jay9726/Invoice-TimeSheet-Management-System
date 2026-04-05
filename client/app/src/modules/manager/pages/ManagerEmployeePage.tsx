import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ReportDialog from "@/components/report-dialog";
import Icon from "@/components/icon";
import type { employee } from "@/types/employee";
import { cn } from "@/lib/utils";
import { FormInput } from "@/components/form-input";
import { useGetEmployeeManager } from "../apis/queries";
import Loader from "@/components/loader";
import { useDebounce } from "@/hooks/useDebounce";
import type { employeeType } from "@/types/timesheet";

const ManagerEmployeesPage = () => {

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)

  const { data, isPending } = useGetEmployeeManager(debouncedSearch);

  const naivgate = useNavigate();
  const [reportOpen, setReportOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<employee | null>(null)

  const getContent = () => {
    if (isPending) {
      return <Loader />
    } else if (data?.data.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center py-10">No Employee Found</TableCell>
        </TableRow>
      )
    } else {
      return (
        data.data.map((emp: employeeType) => (
          <TableRow key={emp.employeeId}>
            <TableCell className="text-center">{emp.fullName}</TableCell>
            <TableCell className="text-center">{emp.email}</TableCell>
            <TableCell className={cn(
              "text-center",
              emp.isActive ? "text-green-500" : "text-red-500"
            )}>{emp.isActive ? "Active" : "InActive"}</TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center gap-2">
                <Button variant='link' size='sm' className="h-10 rounded-lg cursor-pointer"
                  onClick={() => { setReportOpen(true), setSelectedEmployee(emp as employee) }}
                >
                  <Icon name="download" />
                  Report
                </Button>

                <Button variant='link' size="sm" className="h-10 rounded-lg cursor-pointer" onClick={() => naivgate('/manager/employeetimesheet', { state: emp.employeeId })}>
                  <Icon name="openEye" />
                  TimeSheet
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))
      )
    }
  }


  return (
    <>
      <div className="flex flex-col gap-5 rounded-xl border p-6 shadow-sm">
        <div className="grid grid-cols-2 items-center">
          <h1 className="text-xl font-bold">All Employees List</h1>
          <div className="relative flex justify-end items-end">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <FormInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Employee..."
              className="pl-10"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-center text-primary">Employee Name</TableHead>
              <TableHead className="text-center text-primary">Email Address</TableHead>
              <TableHead className="text-center text-primary">Active</TableHead>
              <TableHead className="text-center text-primary">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

            {getContent()}

          </TableBody>
        </Table>

      </div>
      <h1 className="text-sm font-bold">Total : {data?.count}</h1>

      <ReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        employee={selectedEmployee}
      />
    </>
  );
};

export default ManagerEmployeesPage;