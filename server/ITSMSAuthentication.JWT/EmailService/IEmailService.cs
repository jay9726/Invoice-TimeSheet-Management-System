

namespace ITSMS.Authentication.JWT.EmailService
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string htmlBody);

    }
}
