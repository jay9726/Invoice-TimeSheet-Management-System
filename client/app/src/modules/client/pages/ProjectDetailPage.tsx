import React, { useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/icon';

const ProjectDetailPage: React.FC = () => {

    const { state } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
    }, [state])

    const project = [
        { clientName: "Johnson", projectName: "HDFC Bank", hourlyRate: 100, isActive: true },

    ]
    return (
        <>
            <div className='flex justify-between'>
                <h1>Project Details</h1>
                <Button onClick={() => navigate(-1)} ><Icon name='leftArrow' />Back</Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Client Name</TableHead>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Rate/hour</TableHead>
                        <TableHead>IsActive</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {project.map((pro) => (
                        <TableRow key={pro.clientName}>
                            <TableCell className="font-medium">{pro.clientName}</TableCell>
                            <TableCell>{pro.projectName}</TableCell>
                            <TableCell>{pro.hourlyRate}</TableCell>
                            <TableCell className={pro.isActive ? "text-green-500" : "text-red-500"} >{pro.isActive ? "Active" : "Inactive"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}

export default ProjectDetailPage