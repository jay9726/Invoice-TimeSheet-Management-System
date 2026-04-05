import React from 'react'
import { NavLink } from 'react-router-dom';

export interface companyObjectType {
    companyId: string;
    companyLogo: string;
    companyName: string;
    addressLine1: string;
    country: string;
    state: string;
    city: string;
    zip: string;
    isActive: boolean;
    clientCount: number
}


interface companyType {
    data: companyObjectType;
}

const CompanyCard: React.FC<companyType> = (data) => {
    return (

        <NavLink to={`/accountuser/invoice/${data?.data.companyId}/client`}>
            <div className="rounded-xl border shadow-sm p-5 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                    <div className='flex gap-2'>
                        <img
                            src={`https://localhost:7273/${data?.data.companyLogo}`}
                            className="h-10 w-10 object-cover rounded-full"
                        />
                        <h3 className="text-lg font-semibold">{data?.data.companyName}</h3>
                    </div>
                </div>

                <div className="space-y-2 text-sm">
                    <div className='flex justify-end'>
                        <span
                            className={`text-sm font-medium ${data?.data.isActive ? "text-green-600" : "text-red-500"}`}>
                            {data?.data.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>Country</span>
                        <span className="font-medium">{data?.data.country ?? "-"}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>State</span>
                        <span className="font-medium">{data?.data.state ?? "-"}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>City</span>
                        <span className="font-medium">{data?.data.city ?? "-"}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Zip Code</span>
                        <span className="font-medium">{data?.data.zip ?? "-"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Address</span>
                        <span className="font-medium">{data?.data.addressLine1 ?? "-"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Total Clients</span>
                        <span className="font-medium">{data?.data.clientCount}</span>
                    </div>
                </div>
            </div>
        </NavLink>
    )
}

export default CompanyCard