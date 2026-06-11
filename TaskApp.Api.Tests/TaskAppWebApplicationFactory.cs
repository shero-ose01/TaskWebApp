using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TaskApp.Api.Data;

namespace TaskApp.Api.Tests;

public class TaskAppWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly string _dbName = $"TaskAppTests_{Guid.NewGuid()}";

    public TaskAppWebApplicationFactory()
    {
        Environment.SetEnvironmentVariable("Jwt__Key", "test-key-test-key-test-key-test-key-32!");
        Environment.SetEnvironmentVariable("Jwt__Issuer", "TaskAppServer");
        Environment.SetEnvironmentVariable("Jwt__Audience", "TaskAppClient");
        Environment.SetEnvironmentVariable("Jwt__ExpiryMinutes", "60");
        Environment.SetEnvironmentVariable("ConnectionStrings__DefaultConnection", "Host=ignored");
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development");

        builder.ConfigureTestServices(services =>
        {
            var descriptor = services.SingleOrDefault(d =>
                d.ServiceType == typeof(DbContextOptions<AppDbContext>));
            if (descriptor is not null) services.Remove(descriptor);

            var inMemoryProvider = new ServiceCollection()
                .AddEntityFrameworkInMemoryDatabase()
                .BuildServiceProvider();

            services.AddDbContext<AppDbContext>(options =>
                options.UseInMemoryDatabase(_dbName)
                       .UseInternalServiceProvider(inMemoryProvider));
        });
    }
}
