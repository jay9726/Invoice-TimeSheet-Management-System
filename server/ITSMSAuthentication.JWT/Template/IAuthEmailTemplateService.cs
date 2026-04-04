

namespace ITSMS.Authentication.JWT.Template
{
    public interface IAuthEmailTemplateService
    {
        string BuildResetPasswordEmail(string resetLink, string userEmail);

    }
}
