import React from "react"
import { useGetClientProjectByCompanyId } from "@/modules/client/apis/queries"
import { cn } from "@/lib/utils"
import { useParams } from "react-router-dom"
import Loader from "@/components/loader"
import { FolderOpen, FileText } from "lucide-react"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import type { clientType } from "@/types/client"
import type { projectType } from "@/types/project"



/* Tree Node Component for Individual Clients (Now using AccordionItem) */
const TreeClientNode: React.FC<{ client: any }> = ({ client }) => {
    const projectCount = client.projects?.length ?? 0;
    const activeProjects = (client.projects ?? []).filter((p: any) => p.isActive).length;

    return (
        <AccordionItem
            value={client.clientId || Math.random().toString()}
            className="rounded-lg border border-primary shadow-sm overflow-hidden data-[state=open]"
        >
            {/* The Parent Node (Client) Trigger */}
            <AccordionTrigger className="group relative flex items-center justify-between px-4 py-3 hover:bg-primary/10 hover:cursor-pointer hover:no-underline transition-all">
                {/* Active Indicator Strip */}
                <div className={"absolute left-0 top-0 bottom-0 w-1 transition-colors bg-primary"} />

                <div className="flex items-center gap-4 pl-2 grow">
                    {/* Folder Icon */}
                    <FolderOpen className="h-5 w-5 group-data-[state=open]:text-indigo-500 transition-colors" />

                    {/* Basic Info */}
                    <div className="flex flex-col text-left ml-2">
                        <span className="text-base font-semibold">{client.clientName ?? "-"}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                            <div className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                client.isActive ? "bg-green-500" : "bg-red-500"
                            )} />
                            <span className="text-xs font-normal">{client.isActive ? "Active Account" : "Inactive Account"}</span>
                        </div>
                    </div>
                </div>

                {/* Right Side Stats Grid */}
                <div className="hidden sm:grid grid-cols-3 gap-8 text-left pr-6">
                    <div className="flex flex-col text-left gap-1">
                        <span className="text-md font-bold uppercase tracking-wider text-primary">Contact</span>
                        <span className="text-sm font-semibold">{client.contactNumber ?? "-"}</span>
                    </div>
                    <div className="flex flex-col text-left gap-1">
                        <span className="text-md font-bold uppercase tracking-wider text-primary">Projects</span>
                        <span className="text-sm font-semibold">{`Total : ${projectCount}`}</span>
                    </div>
                    <div className="flex flex-col text-left gap-1">
                        <span className="text-md font-bold uppercase tracking-wider text-primary">Active Projects</span>
                        <span className="text-sm font-semibold">{`Total : ${activeProjects}`}</span>
                    </div>
                </div>
            </AccordionTrigger>

            {/* The Children Nodes (Projects Tree) Content */}
            <AccordionContent>
                {client.projects && client.projects.length > 0 ? (
                    <div className="relative ml-8 pl-6 py-4">
                        {/* the vertical line */}
                        <div className="absolute left-0 top-0 bottom-7 w-0.5 bg-primary" />

                        <div className="flex flex-col gap-3">
                            {client.projects.map((project: projectType) => (
                                <div key={project.projectId} className="relative flex items-center">
                                    {/* the horizontal line */}
                                    <div className="absolute -left-6 top-1/2 h-0.5 w-6 bg-primary" />

                                    {/* Project Detail Card */}
                                    <div className="flex w-full items-center justify-between rounded border border-border px-5 py-2 shadow-md hover:bg-primary/10 transition-colors mr-4">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-4 w-4 text-primary" />
                                            <div className="flex flex-col text-left">
                                                <span className="text-sm font-semibold">{project.projectName ?? "-"}</span>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <div className={cn("h-1.5 w-1.5 rounded-full", project.isActive ? "bg-emerald-500" : "bg-red-500")} />
                                                    <span className={cn("text-xs font-normal", project.isActive ? "text-emerald-500" : "text-red-500")}>
                                                        {project.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <div className="flex flex-col text-left gap-1">
                                                <span className="text-md font-medium uppercase tracking-wider text-primary">Rate</span>
                                                <span className="text-sm font-semibold">{`₹ ${project.hourlyRate} / h`}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="relative ml-8 pl-8 py-6 text-sm  text-left">
                        <span className="absolute left-0 top-1/2 h-0.5 w-6 bg-primary" />
                        <div className="absolute left-0 top-0 bottom-6 w-0.5 bg-primary" />
                        No projects mapped to this client.
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>
    );
};


const ClientDetailsPage: React.FC = () => {
    const { id } = useParams();
    const { data, isPending } = useGetClientProjectByCompanyId(id as string)

    if (isPending) return <Loader />

    const clients = data?.data ?? []

    return (
        <div className="mx-auto flex max-w-full w-full flex-col gap-6 px-4 py-3 sm:px-4 lg:px-6 min-h-auto">
            {/* Header Area */}
            <div className="flex flex-col gap-1 text-left">
                <h1 className="text-2xl font-bold tracking-tight">Client Hierarchy</h1>
                <p className="text-sm text-slate-500">
                    Expand individual clients to view and manage their nested project associations.
                </p>
            </div>

            {/* Tree Structure List using Accordion */}
            <div className="mt-2 animate-in fade-in duration-500">
                {clients?.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full space-y-3">
                        {clients.map((client: clientType) => (
                            <TreeClientNode key={client.clientId} client={client} />
                        ))}
                    </Accordion>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border  border-border py-16">
                        <FolderOpen className="h-10 w-10 mb-2" />
                        <h3 className="text-lg font-medium">No Clients Found</h3>
                        <p className="text-sm">There are currently no clients mapped to this company.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ClientDetailsPage