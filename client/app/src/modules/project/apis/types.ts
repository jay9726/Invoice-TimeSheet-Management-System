import type { projectPayload } from "../schemas/projectSchema"


export type CreateProjectPayload = projectPayload


export type deleteProjectResponse = {
    message: string,
    clientId: string
}

export type updateProjectStatusResponse = {
    message: string,
    data: boolean
}


export type updateProjectResponse = {
    projectName: string;
    clientName: string;
    hourlyRate: number;
    isActive: boolean;
}

export type CreatProjectResponse = {
    projectName: string;
    clientName: string;
    hourlyRate: number;
    isActive: boolean;
}



