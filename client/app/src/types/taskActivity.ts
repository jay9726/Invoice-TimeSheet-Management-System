export type getTaskActivityType = {
    id?: string,
    timesheetId?: string,
    workDate: string,
    client: string,
    project: string,
    taskActivity: string,
    startTime: string,
    endTime: string,
    hours: number,
    isBillable: boolean,
    notes: string
}


export type taskActivityType = {
    timeEntryId: string,
    timesheetId: string,
    taskName: string,
    clientName: string,
    projectName: string,
    startTime: string,
    endTime: string,
    workDate: string,
    hoursWorked: string,
    isBillable: boolean,
    notes: string
}
