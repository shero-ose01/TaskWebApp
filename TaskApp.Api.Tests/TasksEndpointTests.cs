using System.Net;
using System.Net.Http.Json;

namespace TaskApp.Api.Tests;

public class TasksEndpointTests : IClassFixture<TaskAppWebApplicationFactory>
{
    private readonly TaskAppWebApplicationFactory _factory;

    public TasksEndpointTests(TaskAppWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Get_Tasks_Without_Auth_Returns_401()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/tasks");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
