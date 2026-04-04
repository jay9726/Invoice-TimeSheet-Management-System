

namespace ITSMS.Application.DTOs.Dashboard
{
    public class AccountUserDashboardDTO
    {
        public int TotalCompanies { get; set; }
        public int TotalClients { get; set; }
        public int TotalProjects { get; set; }
        public int TotalGeneratedInvoices { get; set; }
        public int TotalFinalizedInvoices { get; set; }
        public int TotalPaidInvoices { get; set; }

    }
}
