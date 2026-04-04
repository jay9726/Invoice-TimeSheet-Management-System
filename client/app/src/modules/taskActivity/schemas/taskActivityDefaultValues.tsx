import type { taskActivityPayload } from "./taskActivitySchema";

export const taskActivityDefaultValues: taskActivityPayload = {
    workDate: new Date().toISOString().split("T")[0],
    clientId: "",
    projectId: "",
    taskActivityName: "",
    startTime: "",
    endTime: "",
    hoursWorked: 0,
    isBillable: true,
    notes: "",
    clientName:"",
    projectName:""
}