import type { companySchemaPayload } from "./companySchema";

export const companyDefaultValues: companySchemaPayload = {
    companyName: "",
    addressLine1: "",
    country: "",
    state: "",
    city: "",
    zip: "",
    isActive: true,
    logoFile: undefined as File | undefined,
}