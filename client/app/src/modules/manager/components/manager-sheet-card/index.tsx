import TimesheetStatusBadge from "@/components/timesheet-badge";
import { cn } from "@/lib/utils";
import { setTimeSheet } from "@/redux/slices/TimeSheetSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface managerTimeSheetCardProps {
  timeSheet: any;
}

const ManagerTimeSheetCard: React.FC<managerTimeSheetCardProps> = ({ timeSheet }: any) => {

  const disPatch = useDispatch();
  const selectTimeSheet = useSelector((state: any) => state.timeSheet.timeSheet)

  useEffect(() => {
    disPatch(setTimeSheet(timeSheet.timesheetId))
  }, [])

  return (
    <button
      onClick={() => disPatch(setTimeSheet(timeSheet.timesheetId))}
      className={cn(
        "w-full rounded-lg border p-4 text-left transition-all duration-200",
        selectTimeSheet === timeSheet.timesheetId
          ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-700">{timeSheet.weekStartDate}</span>
        <TimesheetStatusBadge status={timeSheet.status} />
      </div>
    </button>
  )
};

export default ManagerTimeSheetCard;