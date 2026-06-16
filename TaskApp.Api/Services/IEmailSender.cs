namespace TaskApp.Api.Services;

public interface IEmailSender
{
    Task SendVerificationEmailAsync(string to, string subject, string token, CancellationToken ct = default);
}
