import type { updateUserPayload, userPayload } from "./userSchemas";

export const userDefaultValues: userPayload = {
  fullName: "",
  email: "",
  password: "",
  role: "",
  isActive: true,
}

export const updateUserDefaultValues: updateUserPayload = {
  fullName: "",
  email: "",
  role: "",
}


