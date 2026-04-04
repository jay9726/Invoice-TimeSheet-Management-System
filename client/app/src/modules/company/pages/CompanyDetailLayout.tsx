import React from 'react'
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/icon';
import { cn } from '@/lib/utils';


const CompanyDetailLayout: React.FC = () => {

    const { id } = useParams();

    const navigation = [
        { to: `/admin/companies/detail/${id}`, label: 'Company' },
        { to: `/admin/companies/detail/${id}/client`, label: 'Client' }
    ]

    const navigate = useNavigate();

    return (
        <div>
            <div className='flex justify-end'>
                <Button onClick={() => navigate(-1)} ><Icon name='leftArrow' />Back</Button>
            </div>
            <div className="max-w-full">
                <div className="flex min-w-max items-center gap-3 px-2">
                    {
                        navigation.map((nav) => (
                            <NavLink
                                key={nav.to}
                                to={nav.to}
                                end
                                className={({ isActive }) =>
                                    cn("group px-3 py-2 text-base font-medium transition-colors duration-200",
                                        isActive ? "text-primary" : "text-secondary hover:text-primary")
                                }
                            >
                                {({ isActive }) => (
                                    <span className="relative inline-block">
                                        {nav.label}
                                        <span
                                            className={cn(
                                                "pointer-events-none absolute left-0 -bottom-1 h-px w-full origin-left rounded-full bg-primary transition-transform duration-300",
                                                isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                            )}
                                        />
                                    </span>
                                )}
                            </NavLink>
                        ))}
                </div>
            </div>

            <div className='mt-4'>
                <Outlet />
            </div>

        </div>
    )
}

export default CompanyDetailLayout