import { useState, type SubmitEvent } from "react";
import { ApiError, type TaskItemResponse } from "../api/types";
import { DeleteTask, UpdateTask } from "../api/tasks";

export function TaskItem({ task, onDelete, onUpdate }: TaskItemProps) {
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startEditing() {
    setTitle(task.title);
    setDescription(task.description);
    setDueAt(task.dueAt ?? "");
    setError(null);
    setEditing(true);
  }

  async function handleSave(e: SubmitEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const updated = await UpdateTask(task.id, {
        title,
        description,
        dueAt: dueAt || null,
        state: task.state,
      });
      onUpdate(updated);
      setEditing(false);
    } catch (error) {
      if (error instanceof ApiError)
        setError(error.body?.message ?? "Could not save");
      else setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      await DeleteTask(task.id);
      onDelete(task.id);
    } catch {
      setError("Something went wrong");
    }
  }

  function handleCancel() {
    setEditing(false);
    setError(null);
  }

  return (
    <div className="task-element">
      {error && <p>{error}</p>}
      {!editing ? (
        <div className="task-info">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>{task.dueAt}</p>
          <p>{task.state}</p>
          <div className="buttons">
            <button onClick={handleDelete}>Delete</button>
            <button onClick={startEditing}>Update</button>
          </div>
        </div>
      ) : (
        <div className="update">
          <form onSubmit={handleSave}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              value={title}
              onChange={(t) => {
                setTitle(t.target.value);
              }}
              required
            />
            <label htmlFor="description">Description</label>
            <input
              id="description"
              value={description}
              onChange={(d) => {
                setDescription(d.target.value);
              }}
            />
            <label htmlFor="dueAt">Due At</label>
            <input
              id="dueAt"
              value={dueAt}
              onChange={(dt) => setDueAt(dt.target.value)}
              type="date"
            />
            <button type="submit" disabled={submitting}>
              Save
            </button>
            <button onClick={handleCancel} type="button">
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

type TaskItemProps = {
  task: TaskItemResponse;
  onDelete: (id: number) => void;
  onUpdate: (updated: TaskItemResponse) => void;
};
