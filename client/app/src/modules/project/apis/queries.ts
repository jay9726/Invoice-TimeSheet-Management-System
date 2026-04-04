import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getProject, getProjectById } from "./api";

export const useGetProject = (page?: number, limit?: number, search?: string): UseQueryResult<any> => {
    return useQuery({
        queryKey: ['get-all-project', page?? 0, limit ?? 0, search ?? ""],
        queryFn: () => getProject(page, limit, search),
        retry: false,
    });
};


export const useGetProjectById = (projectId: string): UseQueryResult<any> => {
    return useQuery({
        queryKey: ['get-project-by-id', projectId],
        queryFn: () => getProjectById(projectId),
        retry: false,
    });
}