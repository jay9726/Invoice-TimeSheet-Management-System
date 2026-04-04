import TimeSheetListComponent from "../components/timesheet-list-component";
import TaskActivityListComponent from "../components/taskactivity-list-component";

const TaskSheetListPage: React.FC = () => {
    return (
        <div className="flex flex-col gap-5">
            <h1 className="text-xl font-bold text-secondary">Your Timesheets/Activities</h1>
            <div className="flex gap-6">

                <TimeSheetListComponent />

                <div className="w-full rounded-xl border bg-white px-6 py-4">

                    <TaskActivityListComponent />

                </div>
            </div>
        </div>
    )
}

export default TaskSheetListPage
