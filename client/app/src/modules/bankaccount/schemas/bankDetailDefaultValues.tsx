import type { bankDetailPayload } from "./bankDetailSchema";

export const bankDetailDefaultValues: bankDetailPayload = {
    companyId: "",
    bankName: "",
    swiftCode: "",
    accountName: "",
    accountNumber: "",
    routingNumber: "",
    isActive: true,
}
