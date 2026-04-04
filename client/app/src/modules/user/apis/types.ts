
export type CreateEmployeePayload = any


export type deleteEmployeeResponse = {
    message: string,
    employeeId: string
}

export type updateEmployeeStatusResponse = {
    message: string,
    data: boolean
}


export type updateEmployeeResponse = {
    employeeId: string,
    fullName: string,
    email: string,
    isActive: boolean
}

export type CreatEmployeeResponse = {
    EmployeeId: string,
    Email: string,
    FullName: string,
    IsActive: boolean
}

