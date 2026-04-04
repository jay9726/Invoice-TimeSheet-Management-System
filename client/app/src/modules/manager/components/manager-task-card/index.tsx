import { Card, CardContent } from "@/components/ui/card";
import type { taskActivityType } from "@/types/taskActivity";


interface managerTaskCardProps {
  task: taskActivityType
}

const ManagerTaskCard: React.FC<managerTaskCardProps> = ({ task }) => {
  return (
    <Card className="overflow-hidden border-slate-200 transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="flex flex-col gap-3">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <div className="flex gap-4 items-center">
              <h4 className="text-lg font-bold text-slate-800">{task.taskName}</h4>
              <p className={task.isBillable ? "text-green-500" : "text-red-500"}>
                {task.isBillable ? "Billable" : "Non-Billable"}
              </p>
            </div>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-primary">
            {task.hoursWorked}h
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="block text-xs font-medium text-slate-400 uppercase">Client</span>
            <span className="font-medium">{task.clientName}</span>
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-400 uppercase">Project</span>
            <span className="font-medium">{task.projectName}</span>
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-400 uppercase">Time</span>
            <span className="font-medium text-slate-600">{task.startTime} - {task.endTime}</span>
          </div>
        </div>

        {task.notes && (
          <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-600 border border-slate-100">
            <strong>Note:</strong> {task.notes}
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default ManagerTaskCard;