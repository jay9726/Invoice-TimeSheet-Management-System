import type { clientPayload } from "../schemas/clientSchema";


export type CreateClientPayload = clientPayload;


export type deleteClientResponse = {
    message: string,
    clientId: string
}

export type updateClientStatusResponse = {
    message: string,
    data: boolean
}


export type updateClientResponse = {
    clientId: string,
    clientName: string,
    contactPerson: string
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
    isActive: boolean;
}

export type CreatClientResponse = {
    companyName: string;
    contactPerson: string
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
    isActive: boolean;
}



