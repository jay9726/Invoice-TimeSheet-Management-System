export type CreateTimeEntryResponse = {
    timeEntryId: string,
    timesheetId: string,
    workDate: string,
    hoursWorked: number,
    isBillable: boolean,
    notes: string
}

export type UpdateTimeEntryPayload = {
    workDate: Date,
    clientId: string,
    projectId: string,
    taskActivityName: string,
    startTime: string,
    endTime: string,
    hoursWorked: number,
    isBillable: boolean
    notes: string
}