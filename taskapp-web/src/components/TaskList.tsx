import type { TaskItemResponse } from "../api/types";
import { TaskItem } from "./TaskItem";
// task list

export function TaskList({
  tasks,
  loading,
  error,
  onDelete,
  onUpdate,
}: TaskListProps) {
  return (
    <div className="task-list">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading &&
        !error &&
        (tasks.length === 0 ? (
          <p>No tasks yet</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <TaskItem task={task} onDelete={onDelete} onUpdate={onUpdate} />
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
}

// Task taskUIElement

type TaskListProps = {
  tasks: TaskItemResponse[];
  loading: boolean;
  error: string | null;
  onDelete: (id: number) => void;
  onUpdate: (updated: TaskItemResponse) => void;
};
