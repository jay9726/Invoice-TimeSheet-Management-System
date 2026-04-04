import type { forgotPasswordPayload, loginPayload, resetPasswordPayload } from "./authSchema";

export const loginDefaultValues: loginPayload = {
  email: "",
  password: "",
};

export const forgotPasswordDefaultValues: forgotPasswordPayload = {
  email: ""
}


export const resetPasswordDefaultValues: resetPasswordPayload = {
  newPassword: "",
  confirmPassword: "",
}