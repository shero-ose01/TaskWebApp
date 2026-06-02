using System.ComponentModel.DataAnnotations;

namespace TaskApp.Api.Models;

public record CreateTaskItemRequest(
    [Required, StringLength(200)] string Title, 
    [StringLength(4000)] string Description, 
    DateTime? DueAt);
    
public record UpdateTaskItemRequest(
    [Required, StringLength(200)] string Title, 
    [StringLength(4000)] string Description, 
    DateTime? DueAt,
    TaskState State
    );
    
public record TaskItemResponse(int ID, string Title, string Description, DateTime CreatedAt, DateTime? UpdatedAt, DateTime? DueAt, TaskState State);