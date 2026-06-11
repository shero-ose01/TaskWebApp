using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.Extensions.DependencyInjection;
using TaskApp.Api.Data;
using TaskApp.Api.Models;

namespace TaskApp.Api.Tests;

public class AuthEndpointTests(TaskAppWebApplicationFactory factory) : IClassFixture<TaskAppWebApplicationFactory>
{
    [Fact]
    public async Task Post_Login_Wrong_Password_Returns_401(){
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/auth/login", new { email = "test@example.de", password = "pppppp" });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
    
    [Fact]
    public async Task Register_User_And_Create_Tasks(){
        var client = factory.CreateClient();
        var username = "test";
        var email = "t.test@example.com";
        var password = "password123";
        
        // register user
        var registerResponse = await client.PostAsJsonAsync("/auth/register", new {username, email, password });
        Assert.Equal(HttpStatusCode.OK, registerResponse.StatusCode);
        
        // verify user 
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var user = db.Users.FirstOrDefault(u => u.Email == email);
        if(user == null) throw new Exception("Failed to create User");
        user.EmailVerified = true;
        await db.SaveChangesAsync();
        
        // login user
        var loginResponse = await client.PostAsJsonAsync("/auth/login", new{email, password});
        Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);
        
        var auth = await loginResponse.Content.ReadFromJsonAsync<AuthResponse>();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth!.AccessToken);
        
        // create task
        var taskResponse = await client.PostAsJsonAsync("/tasks", new{title="Test Task", description="Test Description"});
        Assert.Equal(HttpStatusCode.Created, taskResponse.StatusCode);
        
        // get task
        var getTaskResponse = await client.GetAsync("/tasks");
        Assert.Equal(HttpStatusCode.OK, getTaskResponse.StatusCode);
    }
}
