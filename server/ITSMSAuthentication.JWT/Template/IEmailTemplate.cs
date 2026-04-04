using ITSMS.Application.DTOs.Email_Service;


namespace ITSMS.Authentication.JWT.Template
{
    public interface IEmailTemplate
    {
        string EmployeeTimesheetSubmittedEmail(SubmitTimeSheetEmail dto);

        string ApprovedTimeSheetEmail(DecisionTimeSheetEmail dto);
        string RejectedTimeSheetEmail(DecisionTimeSheetEmail dto);

        string AccountUserApprovedTimeSheetEmail(AccountUserApprovedEmail dto);

    }
}
