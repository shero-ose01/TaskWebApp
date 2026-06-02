import { useEffect, useState } from "react";
import { GetTasks } from "../api/tasks";
import type { TaskItemResponse } from "../api/types";
import { TaskList } from "../components/TaskList";
import { NewTaskForm } from "../components/NewTaskForm";

export function TasksPage() {
  const [tasks, setTasks] = useState<TaskItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <NewTaskForm onCreated={addTask} />
      <TaskList
        tasks={tasks}
        loading={loading}
        error={error}
        onDelete={deleteTask}
        onUpdate={updateTask}
      />
    </div>
  );
}
