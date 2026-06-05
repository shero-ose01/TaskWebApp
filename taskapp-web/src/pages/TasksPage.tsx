import { useEffect, useState } from "react";
import { GetTasks } from "../api/tasks";
import type { TaskItemResponse } from "../api/types";
import { TaskList } from "../components/TaskList";
import { NewTaskForm } from "../components/NewTaskForm";
import type { TaskState } from "../api/types";

export function TasksPage() {
  const [tasks, setTasks] = useState<TaskItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<TaskState | "All">("All");

  const filteredTasks = tasks.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q);
    const matchState = t.state == searchFilter || searchFilter == "All";
    return matchSearch && matchState;
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await GetTasks();
        setTasks(res);
      } catch {
        setError("Couldn't load tasks");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function addTask(task: TaskItemResponse) {
    setTasks((prev) => [task, ...prev]);
  }

  function deleteTask(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function updateTask(updated: TaskItemResponse) {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  return (
    <div className="task-page">
      <div className="task-filters">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          placeholder="Search tasks..."
        />
        <select
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value as TaskState | "All")}
        >
          <option value={"All"}>All</option>
          <option value={"Pending"}>Pending</option>
          <option value={"InProgress"}>In Progress</option>
          <option value={"Done"}>Done</option>
        </select>
      </div>
      <NewTaskForm onCreated={addTask} />
      <TaskList
        tasks={filteredTasks}
        loading={loading}
        error={error}
        onDelete={deleteTask}
        onUpdate={updateTask}
      />
    </div>
  );
}
