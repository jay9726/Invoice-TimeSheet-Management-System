using ITSMS.Application.DTOs.Email_Service;

namespace ITSMS.Authentication.JWT.Template
{
    public class EmailTemplate : IEmailTemplate
    {
        public string EmployeeTimesheetSubmittedEmail(SubmitTimeSheetEmail dto)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1' />
</head>
<body style='margin:0;padding:0;background:#f6f7fb;font-family:Arial,sans-serif;'>

  <div style='max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #eaeaea;'>

    <div style='padding:18px 24px;background:#00b7f5;color:#fff;'>
      <h2 style='margin:0;font-size:18px;'>Timesheet Submitted</h2>
    </div>

    <div style='padding:24px;'>

      <p style='margin:0 0 12px;color:#111827;font-size:14px;'>
        Hello,
      </p>

      <p style='margin:0 0 18px;color:#374151;font-size:14px;'>
        A timesheet has been submitted and is ready for review.
      </p>

      <table style='width:100%;border-collapse:collapse;font-size:14px;color:#374151;'>
        <tr>
          <td style='padding:8px 0;font-weight:bold;'>Employee Name:</td>
          <td style='padding:8px 0;'>{dto.EmployeeName}</td>
        </tr>
        <tr>
          <td style='padding:8px 0;font-weight:bold;'>Employee Email:</td>
          <td style='padding:8px 0;'>{dto.EmployeeEmail}</td>
        </tr>
        <tr>
          <td style='padding:8px 0;font-weight:bold;'>Submitted Date:</td>
          <td style='padding:8px 0;'>{dto.SubmittedDate:dd MMM yyyy}</td>
        </tr>
      </table>

      <p style='margin:18px 0 0;color:#374151;font-size:14px;'>
        The employee has submitted their timesheet to the manager for review and approval.
      </p>

      <hr style='border:none;border-top:1px solid #eee;margin:18px 0;' />

      <p style='margin:0;color:#6b7280;font-size:12px;'>
        This is an automated notification from the ITSMS system.
      </p>

    </div>

  </div>

</body>
</html>";
        }


        public string ApprovedTimeSheetEmail(DecisionTimeSheetEmail dto)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
<meta charset='utf-8'/>
<meta name='viewport' content='width=device-width, initial-scale=1'/>
</head>

<body style='margin:0;padding:0;background:#f6f7fb;font-family:Arial,sans-serif;'>

<div style='max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #eaeaea;'>

<div style='padding:18px 24px;background:#22c55e;color:#fff;'>
<h2 style='margin:0;font-size:18px;'>Timesheet Approved</h2>
</div>

<div style='padding:24px;'>

<p style='margin:0 0 12px;color:#111827;font-size:14px;'>
Your timesheet has been approved by the manager.
</p>

<table style='width:100%;border-collapse:collapse;font-size:14px;color:#374151;'>

<tr>
<td style='padding:8px 0;font-weight:bold;'>Timesheet Date:</td>
<td style='padding:8px 0;'>{dto.TimeSheetName}</td>
</tr>

<tr>
<td style='padding:8px 0;font-weight:bold;'>Employee Name:</td>
<td style='padding:8px 0;'>{dto.EmployeeName}</td>
</tr>

<tr>
<td style='padding:8px 0;font-weight:bold;'>Employee Email:</td>
<td style='padding:8px 0;'>{dto.EmployeeEmail}</td>
</tr>

<tr>
<td style='padding:8px 0;font-weight:bold;'>Approved Date:</td>
<td style='padding:8px 0;'>{dto.ActionDate:dd MMM yyyy}</td>
</tr>

<tr>
<td style='padding:8px 0;font-weight:bold;'>Manager Comment:</td>
<td style='padding:8px 0;'>{dto.ManagerComment}</td>
</tr>

</table>

<hr style='border:none;border-top:1px solid #eee;margin:18px 0;' />

<p style='margin:0;color:#6b7280;font-size:12px;'>
This is an automated notification from the ITSMS system.
</p>

</div>
</div>

</body>
</html>";
        }


        public string RejectedTimeSheetEmail(DecisionTimeSheetEmail dto)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
<meta charset='utf-8'/>
<meta name='viewport' content='width=device-width, initial-scale=1'/>
</head>

<body style='margin:0;padding:0;background:#f6f7fb;font-family:Arial,sans-serif;'>

<div style='max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #eaeaea;'>

<div style='padding:18px 24px;background:#ef4444;color:#fff;'>
<h2 style='margin:0;font-size:18px;'>Timesheet Rejected</h2>
</div>

<div style='padding:24px;'>

<p style='margin:0 0 12px;color:#111827;font-size:14px;'>
Your submitted timesheet has been reviewed and rejected by the manager.
Please check the manager's comment below.
</p>

<table style='width:100%;border-collapse:collapse;font-size:14px;color:#374151;'>

<tr>
<td style='padding:8px 0;font-weight:bold;'>Timesheet Date:</td>
<td style='padding:8px 0;'>{dto.TimeSheetName}</td>
</tr>

<tr>
<td style='padding:8px 0;font-weight:bold;'>Employee Name:</td>
<td style='padding:8px 0;'>{dto.EmployeeName}</td>
</tr>

<tr>
<td style='padding:8px 0;font-weight:bold;'>Employee Email:</td>
<td style='padding:8px 0;'>{dto.EmployeeEmail}</td>
</tr>

<tr>
<td style='padding:8px 0;font-weight:bold;'>Rejected Date:</td>
<td style='padding:8px 0;'>{dto.ActionDate:dd MMM yyyy}</td>
</tr>

<tr>
<td style='padding:8px 0;font-weight:bold;'>Manager Comment:</td>
<td style='padding:8px 0;'>{dto.ManagerComment}</td>
</tr>

</table>

<hr style='border:none;border-top:1px solid #eee;margin:18px 0;' />

<p style='margin:0;color:#6b7280;font-size:12px;'>
This is an automated notification from the ITSMS system.
</p>

</div>
</div>

</body>
</html>";
        }



        public string AccountUserApprovedTimeSheetEmail(AccountUserApprovedEmail dto)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1' />
</head>
<body style='margin:0;padding:0;background:#f6f7fb;font-family:Arial,sans-serif;'>

  <div style='max-width:700px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #eaeaea;'>

    <div style='padding:18px 24px;background:#00b7f5;color:#fff;'>
      <h2 style='margin:0;font-size:18px;'>Timesheet Approval Notification</h2>
    </div>

    <div style='padding:20px;'>

      <p style='margin:0 0 12px;color:#111827;font-size:14px;'>
        Hello,
      </p>

     <p style='margin:0 0 18px;color:#374151;font-size:14px;'>
    The following timesheet has been approved by the manager <span style='color:#ffffff'>{dto.ManagerName}</span>. Please review the details below.
    </p>

      <table style='width:100%;border-collapse:collapse;font-size:14px;color:#374151;'>
        <tr>
          <td style='padding:8px 0;font-weight:bold;width:180px;'>Employee Name:</td>
          <td style='padding:8px 0;'>{dto.UserName}</td>
        </tr>
        <tr>
          <td style='padding:8px 0;font-weight:bold;'>Timesheet Date:</td>
          <td style='padding:8px 0;'>{dto.TimesheetName}</td>
        </tr>
        <tr>
          <td style='padding:8px 0;font-weight:bold;'>Approved Date:</td>
          <td style='padding:8px 0;'>{dto.ApprovedDate:dd MMM yyyy}</td>
        </tr>
      </table>

      <p style='margin:18px 0 0;color:#374151;font-size:14px;'>
        Please proceed with the necessary accounting process.
      </p>

      <p style='margin:10px 0 0;color:#374151;font-size:14px;'>Thank you.</p>

      <hr style='border:none;border-top:1px solid #eee;margin:18px 0;' />

      <p style='margin:0;color:#6b7280;font-size:12px;'>
        This is an automated notification from the ITSMS system. Please do not reply to this email.
      </p>

    </div>

  </div>

</body>
</html>
";
        }

    }
}
