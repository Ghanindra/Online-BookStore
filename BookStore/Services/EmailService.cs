using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace BookStore.Services
{
   public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
#pragma warning disable CS8604 // Possible null reference argument.
            var smtp = new SmtpClient(_config["Email:SmtpServer"])
        {
            Port = int.Parse(_config["Email:Port"]),
            Credentials = new NetworkCredential(_config["Email:Username"], _config["Email:Password"]),
            EnableSsl = true
        };
#pragma warning restore CS8604 // Possible null reference argument.

#pragma warning disable CS8604 // Possible null reference argument.
            var message = new MailMessage
        {
            From = new MailAddress(_config["Email:From"]),
            Subject = subject,
            Body = body,
            IsBodyHtml = false
        };
#pragma warning restore CS8604 // Possible null reference argument.
            message.To.Add(to);

        await smtp.SendMailAsync(message);
    }
}

}