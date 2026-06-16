namespace TaskApp.Api.Services;

public class TestEmailSender : IEmailSender{

    private readonly IConfiguration _config;
    private readonly ILogger<TestEmailSender> _log;
    public TestEmailSender(ILogger<TestEmailSender> log, IConfiguration config){
        _log = log;
        _config = config;
    }

    public Task SendAsync(string to, string subject, string htmlBody, CancellationToken ct = default){
        _log.LogInformation("Email: {to} | {subject}\n{htmlBody}",to,subject,htmlBody);
        return Task.CompletedTask;
    }

    public Task SendVerificationEmailAsync(string to, string subject, string token, CancellationToken ct = default){
        _log.LogInformation("Email: {to} | {subject}\n{token}",to,subject,token);
        return Task.CompletedTask;
    }
}
