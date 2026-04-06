import { Users, Briefcase, Landmark, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminDashboard } from '../apis/queries';
import Loader from '@/components/loader';


const AdminDashboardPage = () => {

    const { data, isPending } = useAdminDashboard();

    if (isPending) return <Loader />

    return (
        <>
            <div className="space-y-8 p-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">System Overview</h1>
                        <p className="text-muted-foreground text-sm">Real-time performance and master data summary.</p>
                    </div>

                </div>

                {/* Total Counts */}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                    <KPICard title="Total Employees" value={data.adminTotalEmployees} icon={Users} />
                    <KPICard title="Total Comapnies" value={data.adminTotalCompanies} icon={Users} />
                    <KPICard title="Total Projects" value={data.adminTotalProjects} icon={Briefcase} />
                    <KPICard title="Total Banks" value={data.adminTotalBanks} icon={Landmark} />
                    <KPICard title="Total Clients" value={data.adminTotalClients} icon={Building2} />
                    <KPICard title="Total Invoices" value={data.adminTotalInvoices} icon={Building2} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    <KPICard title="Active Employees" value={data.adminTotalActiveEmployees} icon={Users} />
                    <KPICard title="Active Companies" value={data.adminTotalActiveCompanies} icon={Users} />
                    <KPICard title="Active Projects" value={data.adminTotalActiveProjects} icon={Briefcase} />
                    <KPICard title="Active Banks" value={data.adminTotalActiveBanks} icon={Landmark} />
                    <KPICard title="Active Clients" value={data.adminTotalActiveClients} icon={Building2} />
                </div>

                {/* Invoice Status */}
                <div className="grid md:grid-cols-2">
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-md font-medium">Invoices by Status</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                            <StatusMetric label="Generated" value={data.adminTotalGeneratedInvoices} color="bg-slate-500" />
                            <StatusMetric label="Finalized" value={data.adminTotalFinallizedInvoices} color="bg-blue-500" />
                            <StatusMetric label="Paid" value={data.adminTotalPaidInvoices} color="bg-green-500" />
                        </CardContent>
                    </Card>
                </div>

            </div>
        </>
    )
}

/* Helper Components for clean code */
const KPICard = ({ title, value, icon: Icon }: any) => (
    <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium ">{title}</CardTitle>
            <Icon className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
)

const StatusMetric = ({ label, value, color }: any) => (
    <div className="flex flex-col items-center gap-1">
        <span className="text-2xl font-bold">{value}</span>
        <div className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full ${color}`} />
            <span className="text-[11px] uppercase tracking-wider font-semibold">{label}</span>
        </div>
    </div>
)

export default AdminDashboardPage