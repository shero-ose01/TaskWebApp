using System.ComponentModel.DataAnnotations;

namespace TaskApp.Api.Models;

public class TaskItem
{
    public int ID { get; set; }
    public int UserID { get; set; }
    public User User { get; set; }= null!;

    [StringLength(200)]
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DueAt { get; set; }
    
    public TaskState State { get; set; }
}

public enum TaskState{
    Pending,
    InProgress,
    Done,
    // Expired // maybe later ill add a way to mark stuff as expired
}