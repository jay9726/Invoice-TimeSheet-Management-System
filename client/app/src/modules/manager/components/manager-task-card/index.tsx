import { Card, CardContent } from "@/components/ui/card";
import type { taskActivityType } from "@/types/taskActivity";


interface managerTaskCardProps {
  task: taskActivityType
}

const ManagerTaskCard: React.FC<managerTaskCardProps> = ({ task }) => {
  return (
    <Card className="overflow-hidden border-border transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="flex flex-col gap-3">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <div className="flex gap-4 items-center">
              <h4 className="text-lg font-bold">{task.taskName}</h4>
              <p className={task.isBillable ? "text-green-500" : "text-red-500"}>
                {task.isBillable ? "Billable" : "Non-Billable"}
              </p>
            </div>
          </div>
          <div className="rounded-full bg-white px-3 py-1 text-sm font-bold text-primary">
            {task.hoursWorked}h
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="block text-xs font-medium uppercase">Client</span>
            <span className="font-medium text-muted">{task.clientName}</span>
          </div>
          <div>
            <span className="block text-xs font-medium uppercase">Project</span>
            <span className="font-medium text-muted">{task.projectName}</span>
          </div>
          <div>
            <span className="block text-xs font-medium uppercase">Time</span>
            <span className="font-medium text-muted">{task.startTime} - {task.endTime}</span>
          </div>
        </div>

        {task.notes && (
          <div className="flex items-start gap-2 rounded-lg p-4 text-sm">
            <strong>Notes:</strong>
            <p>{task.notes}</p>
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default ManagerTaskCard;