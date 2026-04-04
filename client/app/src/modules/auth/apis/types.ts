// export type Roles = "Admin" | "AccountUser" | "Manager" | "Employee"

// export type AuthUser = {
//     id: string,
//     expiresAt: string,
//     email: string,
//     fullName: string,
//     role: Roles
// }

// export type LoginResponse = {
//     token: string,
//     user: AuthUser
// }






export type Roles = "Admin" | "AccountUser" | "Manager" | "Employee"

export type LoginResponse = {
    token: string,
    id: string,
    role: Roles
}