export type Roles = "Admin" | "AccountUser" | "Manager" | "Employee"

export type LoginResponse = {
    token: string,
    id: string,
    role: Roles
}