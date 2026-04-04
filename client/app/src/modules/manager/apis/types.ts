export type reviewSubmitResponse = {
  timesheetId: string,
  status: string,
  approvedOn: string,
  approvedBy: string
}

export type reportGeneratePayload ={
  employeeId: string,
  month: number,
  year: number
}