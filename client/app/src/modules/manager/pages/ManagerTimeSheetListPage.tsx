import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import ManagerTimeSheetCard from "../components/manager-sheet-card";
import Icon from "@/components/icon";
import Loader from "@/components/loader";
import { useGetsubmittedsheetByEmpIdManager } from "../apis/queries";
import ManagerTaskComponent from "../components/manager-task-component";
import type { timesheetType } from "@/types/timesheet";

const ManagerTimesheetsListPage = () => {

  const { state } = useLocation();

  const { data, isPending } = useGetsubmittedsheetByEmpIdManager(state);

  
  const navigate = useNavigate();
  
  const getContent = () => {
    if (isPending) {
      return <Loader />
    }
    else if (data?.data.length === 0) {
      return (
        <div className="flex items-center justify-center">
          <p>No Timesheets Found</p>
        </div>
      )
    } else {
      return (
        data?.data?.map((timeSheet: timesheetType) => (
          <ManagerTimeSheetCard
            key={timeSheet.timesheetId}
            timeSheet={timeSheet as timesheetType}
          />
        ))
      )
    }
  }
  
  const getTaskActivityContent = () => {
    if (isPending) {
      return <Loader />
    } else if (data?.data.length === 0) {
      return (
        <>
        </>
      )
    } else {
      return (
        <ManagerTaskComponent employeeId={state} />
      )
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 items-center">
        <h1 className="text-xl font-bold">All Timesheets/Activities</h1>
        <div className="flex justify-end ">
          <Button
            onClick={() => navigate(-1)}
          ><Icon name="leftArrow" height={20} width={20} />Back</Button>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">

        <Card className="w-full rounded-2xl py-3 px-3 lg:w-2/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted">
              <CalendarDays className="h-4 w-4" /> TIMESHEETS
            </div>
            <Badge variant='ghost' className="rounded-full text-md text-primary">
              {data?.data.length}
            </Badge>
          </div>

          <div className="max-h-[69vh] overflow-y-scroll scroll-smooth space-y-2">
            {getContent()}
          </div>
        </Card>

        {getTaskActivityContent()}

      </div>
    </div>
  );
};

export default ManagerTimesheetsListPage;
