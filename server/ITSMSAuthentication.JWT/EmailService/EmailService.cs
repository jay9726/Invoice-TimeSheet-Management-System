using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace ITSMS.Authentication.JWT.EmailService
{
    public class EmailService : IEmailService
    {
        private readonly SmtpSettings _smtp;

        public EmailService(IOptions<SmtpSettings> smtpOptions)
        {
            _smtp = smtpOptions.Value;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            try
            {
                using var message = new MailMessage
                {
                    From = new MailAddress(_smtp.FromEmail, _smtp.FromName),
                    Subject = subject,
                    Body = htmlBody,
                    IsBodyHtml = true
                };
                message.To.Add(toEmail);

                using var client = new SmtpClient(_smtp.Host)
                {
                    Port = _smtp.Port,
                    Credentials = new NetworkCredential(_smtp.Username, _smtp.Password),
                    EnableSsl = true,
                    UseDefaultCredentials = false
                };

                await client.SendMailAsync(message);
            }
            catch (SmtpException)
            {
                throw new Exception("Email service is currently unavailable. Please try again later.");
            }
            catch (Exception)
            {
                throw new Exception("An error occurred while sending the email.");
            }
        }
    }
}



public class SmtpSettings
{
    public string Host { get; set; } = "";
    public int Port { get; set; }
    public string FromEmail { get; set; } = "";
    public string FromName { get; set; } = "";
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
}