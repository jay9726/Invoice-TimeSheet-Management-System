import type { bankDetailPayload } from "../schemas/bankDetailSchema";


export type CreateBankDetailPayload = bankDetailPayload;


export type deleteBankDetailResponse = {
    message: string,
    companyId: string
}

export type updateBankDetailStatusResponse = {
    message: string,
    data: boolean
}


export type updateBankDetailResponse = {
    companyName: string;
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
    logoPath: string | null;
    isActive: boolean;
}

export type CreatBankDetailResponse = {
    companyId?: string;
    companyName: string;
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
    logoPath: string | null;
    isActive: boolean;
}



