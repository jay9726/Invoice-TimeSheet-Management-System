export type TimesheetStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";

export type employeeType = {
  employeeId: string;
  fullName: string;
  email: string;
  isActive?: boolean
  role?:string
};

export type timesheetType = {
  status: string,
  timesheetId: string
  totalHours: number
  weekStartDate: string
};
