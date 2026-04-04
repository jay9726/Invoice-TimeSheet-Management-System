import type { companySchemaPayload } from "../schemas/companySchema";

export type CreateCompanyPayload = companySchemaPayload;


export type deleteCompanyResponse = {
    message: string,
    companyId: string
}

export type updateCompanyStatusResponse = {
    message: string,
    data: boolean
}


export type updateCompanyResponse = {
    companyName: string;
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
    logoPath: string | null;
    isActive: boolean;
}

export type CreatCompanyResponse = {
    companyId?: string;
    companyName: string;
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
    logoPath: string | null;
    isActive: boolean;
}



