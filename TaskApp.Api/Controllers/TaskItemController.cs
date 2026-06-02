using System.Security.Claims;
using TaskApp.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskApp.Api.Data;

namespace TaskApp.Api.Controllers;

[ApiController]
[Route("tasks")]
public class TaskItemController(AppDbContext db, ILogger<TaskItemController> logger):ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskItemRequest req)
    {
        var userIDStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(!int.TryParse(userIDStr, out var userID)) return Unauthorized();

        // check if title is valid, i want at least 1 character, so no empty titles
        if(string.IsNullOrWhiteSpace(req.Title)) return BadRequest();

        // create task and save to db

        TaskItem task = new TaskItem();

        task.Title = req.Title.Trim();
        task.UserID = userID;
        task.Description = req.Description ?? "";
        task.DueAt = req.DueAt.HasValue ? DateTime.SpecifyKind(req.DueAt.Value, DateTimeKind.Utc) : null;
        task.State = TaskState.Pending;
        task.CreatedAt = DateTime.UtcNow;

        db.TaskItems.Add(task);
        await db.SaveChangesAsync();

        logger.LogInformation("Create Task request from user {UserID} for title: {Title}", userID, req.Title);

        // return created task, status code 201
        return CreatedAtAction(nameof(GetTask), new { id = task.ID }, new TaskItemResponse(task.ID, task.Title, task.Description, task.CreatedAt, task.UpdatedAt , task.DueAt, task.State));
    }

    [HttpGet]
    public async Task<IActionResult> GetTasks()
    {
        // check user authorized

        var userIDStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(!int.TryParse(userIDStr, out var userID)) return Unauthorized();

        var tasks = await db.TaskItems.Where(t => t.UserID == userID).OrderByDescending(t => t.CreatedAt).Select(t => new TaskItemResponse(t.ID,t.Title,t.Description, t.CreatedAt, t.UpdatedAt , t.DueAt, t.State)).ToListAsync();

        return Ok(tasks);
    }


    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetTask(int id)
    {
        var userIDStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(!int.TryParse(userIDStr, out var userID)) return Unauthorized();

        var task = await db.TaskItems.Where(t => t.ID == id && t.UserID == userID).Select(t => new TaskItemResponse(t.ID,t.Title,t.Description, t.CreatedAt, t.UpdatedAt , t.DueAt, t.State)).FirstOrDefaultAsync();

        if(task == null) return NotFound();

        return Ok(task);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var userIDStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(!int.TryParse(userIDStr, out var userID)) return Unauthorized();

        var task = await db.TaskItems.Where(t=>t.ID == id && t.UserID == userID).FirstOrDefaultAsync();
        if(task == null) return NotFound();

        db.TaskItems.Remove(task);
        await db.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateTask(int id, [FromBody] UpdateTaskItemRequest req)
    {
        var userIDStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(!int.TryParse(userIDStr, out var userID)) return Unauthorized();

        var task = await db.TaskItems.Where(t=>t.ID == id && t.UserID == userID).FirstOrDefaultAsync();
        if(task == null) return NotFound();

        if(string.IsNullOrWhiteSpace(req.Title)) return BadRequest();

        task.Title = req.Title.Trim();
        task.Description = req.Description ?? "";
        task.DueAt = req.DueAt.HasValue ? DateTime.SpecifyKind(req.DueAt.Value, DateTimeKind.Utc) : null;
        task.State = req.State;
        task.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();

        return Ok(new TaskItemResponse(task.ID, task.Title, task.Description, task.CreatedAt, task.UpdatedAt , task.DueAt, task.State));
    }
}
