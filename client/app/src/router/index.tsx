import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "@/modules/auth/guards/ProtectedRoute";
import Loader from "@/components/loader";

const ErrorPage = lazy(() => import("@/pages/ErrorPage"));
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));
const LoginPage = lazy(() => import("@/modules/auth/pages/LoginPage"));
const ForgetPasswordPage = lazy(() => import("@/modules/auth/pages/ForgetPasswordPage"));
const AdminLayout = lazy(() => import("@/layouts/AdminLayout"));
const AccountUserLayout = lazy(() => import("@/layouts/AccountUserLayout"));
const ManagerLayout = lazy(() => import("@/layouts/ManagerLayout"));
const EmployeeLayout = lazy(() => import("@/layouts/EmployeeLayout"));
const CompanyListPage = lazy(() => import("@/modules/company/pages/CompanyListPage"));
const ManagerEmployeesPage = lazy(() => import("@/modules/manager/pages/ManagerEmployeePage"));
const ManagerTimesheetsListPage = lazy(() => import("@/modules/manager/pages/ManagerTimeSheetListPage"));
const CreateTaskActivityPage = lazy(() => import("@/modules/taskActivity/pages/CreateTaskActivityPage"));
const TaskSheetListPage = lazy(() => import("@/modules/taskActivity/pages/TaskSheetListPage"));
const ManagerDashboardPage = lazy(() => import("@/modules/dashboard/pages/ManagerDashboardPage"));
const AdminDashboardPage = lazy(() => import("@/modules/dashboard/pages/AdminDashboardPage"));
const ClientListPage = lazy(() => import("@/modules/client/pages/ClientListPage"));
const ProjectListPage = lazy(() => import("@/modules/project/pages/ProjectListPage"));
const UserListPage = lazy(() => import("@/modules/user/pages/UserListPage"));
const ProjectDetailPage = lazy(() => import("@/modules/client/pages/ProjectDetailPage"));
const TaskSheetHistoryPage = lazy(() => import("@/modules/taskActivity/pages/TaskSheetHistoryPage"));
const EmployeeDashboard = lazy(() => import("@/modules/dashboard/pages/EmployeeDashboardPage"));
const BankDetailsListPage = lazy(() => import("@/modules/bankaccount/pages/BankDetailListPage"));
const ResetPasswordPage = lazy(() => import("@/modules/auth/pages/ResetPassword"));
const UnauthorizedPage = lazy(() => import("@/pages/UnauthorizedPage"));
const CompanyDetailLayout = lazy(() => import("@/modules/company/pages/CompanyDetailLayout"));
const CompanyDetailsPage = lazy(() => import("@/modules/company/pages/CompanyDetailsPage"));
const ClientDetailsPage = lazy(() => import("@/modules/company/pages/ClientDetailsPage"));
const ClientInvoiceListPage = lazy(() => import("@/modules/invoice/pages/ClientInvoiceListPage"));
const InvoicePreviewPage = lazy(() => import("@/modules/invoice/pages/InvoicePreviewPage"));
const CompanyInvoiceListPage = lazy(() => import("@/modules/invoice/pages/CompanyInvoiceListPage"));
const AdminInvoiceCompanyPage = lazy(() => import("@/modules/admin-invoice/pages/AdminInvoiceCompanyPage"));
const AdminInvoiceListPage = lazy(() => import("@/modules/admin-invoice/pages/AdminInvoiceListPage"));
const AccountUserDashboard = lazy(() => import("@/modules/dashboard/pages/AccountUserDashboardPage"));


const withSuspense = (children: React.ReactNode) => (
    <Suspense fallback={<Loader />}>
        {children}
    </Suspense>
);


const router = createBrowserRouter([
    {
        path: "/unauthorized",
        element: withSuspense(<UnauthorizedPage />)
    },
    {
        element: withSuspense(<AuthLayout />),
        errorElement: withSuspense(<ErrorPage />),
        children: [
            { index: true, element: withSuspense(<LoginPage />) },
            { path: 'forget-password', element: withSuspense(<ForgetPasswordPage />) },
            { path: 'reset-password', element: withSuspense(<ResetPasswordPage />) }
        ]
    },
    {
        path: "/admin",
        element: <ProtectedRoute allowedRoles={["Admin"]} />,
        errorElement: withSuspense(<ErrorPage />),
        children: [
            {
                element: withSuspense(<AdminLayout />),
                children: [
                    { index: true, element: <Navigate to="/admin/dashboard" replace /> },
                    { path: 'dashboard', element: withSuspense(<AdminDashboardPage />) },
                    { path: 'companies', element: withSuspense(<CompanyListPage />) },
                    { path: 'companies/bankdetails', element: withSuspense(<BankDetailsListPage />) },
                    { path: 'bankDetails', element: withSuspense(<BankDetailsListPage />) },
                    { path: 'clients', element: withSuspense(<ClientListPage />) },
                    { path: 'clients/projectdetail', element: withSuspense(<ProjectDetailPage />) },
                    { path: 'projects', element: withSuspense(<ProjectListPage />) },
                    { path: 'users', element: withSuspense(<UserListPage />) },
                    {
                        path: 'companies/detail/:id',
                        element: withSuspense(<CompanyDetailLayout />),
                        children: [
                            { index: true, element: withSuspense(<CompanyDetailsPage />) },
                            { path: 'client', element: withSuspense(<ClientDetailsPage />) }
                        ]
                    },
                    { path: 'invoices', element: withSuspense(<AdminInvoiceCompanyPage />) },
                    { path: 'invoices/:id/client/invoices', element: withSuspense(<AdminInvoiceListPage />) },
                ]
            },
        ]
    },
    {
        path: "/accountuser",
        element: <ProtectedRoute allowedRoles={["AccountUser"]} />,
        errorElement: withSuspense(<ErrorPage />),
        children: [
            {
                element: withSuspense(<AccountUserLayout />),
                children: [
                    { index: true, element: <Navigate to="/accountuser/dashboard" replace /> },
                    { path: 'dashboard', element: withSuspense(<AccountUserDashboard />) },
                    { path: 'invoice', element: withSuspense(<CompanyInvoiceListPage />) },
                    { path: 'invoice/:id/client', element: withSuspense(<ClientInvoiceListPage />) },
                    { path: 'invoice/:id/preview/:invoiceId', element: withSuspense(<InvoicePreviewPage />) },
                ]
            },
        ]
    },
    {
        path: "/manager",
        element: <ProtectedRoute allowedRoles={["Manager"]} />,
        errorElement: withSuspense(<ErrorPage />),
        children: [
            {
                element: withSuspense(<ManagerLayout />),
                children: [
                    { index: true, element: <Navigate to="/manager/dashboard" replace /> },
                    { path: "dashboard", element: withSuspense(<ManagerDashboardPage />) },
                    { path: "employees", element: withSuspense(<ManagerEmployeesPage />) },
                    { path: "employeetimesheet", element: withSuspense(<ManagerTimesheetsListPage />) },
                ]
            },
        ]
    },
    {
        path: "/employee",
        element: <ProtectedRoute allowedRoles={["Employee"]} />,
        errorElement: withSuspense(<ErrorPage />),
        children: [
            {
                element: withSuspense(<EmployeeLayout />),
                children: [
                    { index: true, element: <Navigate to="/employee/dashboard" replace /> },
                    { path: 'dashboard', element: withSuspense(<EmployeeDashboard />) },
                    { path: 'logtime', element: withSuspense(<CreateTaskActivityPage />) },
                    { path: 'timesheets', element: withSuspense(<TaskSheetListPage />) },
                    { path: 'history', element: withSuspense(<TaskSheetHistoryPage />) }
                ]
            },
        ]
    }
])



const Router = () => {
    return (
        <Suspense fallback={<Loader />}>
            <RouterProvider router={router} />
        </Suspense>
    )
}

export default Router