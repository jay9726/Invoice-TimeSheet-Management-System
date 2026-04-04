

namespace ITSMS.Authentication.JWT.Template
{
    public class AuthEmailTemplateService : IAuthEmailTemplateService
    {
        public string BuildResetPasswordEmail( string resetLink, string supportEmail)
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
      <h2 style='margin:0;font-size:18px; text-color:black;'>ITSMS Support</h2>
    </div>

    <div style='padding:24px;'>
      <p style='margin:0 0 12px;color:#111827;font-size:14px;'>
        You requested to reset your password.
      </p>

      <p style='margin:0 0 18px;color:#374151;font-size:14px;'>
        Click the button below to set a new password.
      </p>

      <a href='{resetLink}'
         style='display:inline-block;padding:12px 16px;background:#00b7f5;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;'>
        Reset Password
      </a>

      <p style='margin:18px 0 0;color:#6b7280;font-size:12px;'>
        If you didn’t request this, you can safely ignore this email.
      </p>
      <hr style='border:none;border-top:1px solid #eee;margin:18px 0;' />
    </div>
  </div>
</body>
</html>";
        }
    }
}
