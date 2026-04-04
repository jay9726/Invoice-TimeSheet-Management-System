import React from 'react'
import { useParams } from 'react-router-dom';
import { useGetCompanyById } from '../apis/queries';
import Loader from '@/components/loader';


const CompanyDetailsPage: React.FC = () => {

    const { id } = useParams();

    const { data, isPending } = useGetCompanyById(id as string);

    if (isPending) return <Loader />

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
                className="rounded-xl border bg-white shadow-sm p-5 hover:shadow-md transition"
            >

                <div className="flex items-center justify-between mb-4">
                    <img
                        src={`https://localhost:7273/${data?.data.companyLogo}`}
                        alt="logo"
                        className="h-10 w-10 object-cover rounded-full"
                    />
                    <h3 className="text-lg font-semibold">{data?.data.companyName}</h3>

                </div>

                <div className="space-y-2 text-sm">
                    <div className='flex justify-end'>
                        <span
                            className={`text-sm font-medium ${data?.data.isActive ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {data?.data.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Address</span>
                        <span className="font-medium">{data?.data.addressLine1 ?? "-"}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Country</span>
                        <span className="font-medium">{data?.data.country ?? "-"}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">State</span>
                        <span className="font-medium">{data?.data.state ?? "-"}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">City</span>
                        <span className="font-medium">{data?.data.city ?? "-"}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Zip Code</span>
                        <span className="font-medium">{data?.data.zip ?? "-"}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyDetailsPage