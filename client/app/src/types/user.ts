import type { Roles } from "@/modules/auth/apis/types"

export type userType = {
    userId: string,
    userName: string,
    email: string,
    role: Roles,
    isActive: boolean
}