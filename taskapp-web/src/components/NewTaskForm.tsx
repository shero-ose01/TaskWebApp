import { useState } from "react";
import type { SubmitEvent } from "react";
import { CreateTask } from "../api/tasks";
import { ApiError, type TaskItemResponse } from "../api/types";

export function NewTaskForm({ onCreated }: NewTaskFormProps) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetInputFields() {
    setTitle("");
    setDescription("");
    setDueAt("");
    setError(null);
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res: TaskItemResponse = await CreateTask({
        title,
        description,
        dueAt: dueAt || null,
      });

      onCreated(res);
      handleCancel();
    } catch (err) {
      if (err instanceof ApiError)
        setError(err.body?.message ?? "Something went wrong");
      else setError("Couldn't create Task");
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    resetInputFields();
    setExpanded(false);
  }

  function handleExpand() {
    setExpanded(true);
  }

  return (
    <div className="task-form-wrapper">
      {!expanded ? (
        <button onClick={handleExpand}>Create Task</button>
      ) : (
        <div className="task-create-form">
          <form onSubmit={handleSubmit}>
            <h2>Create a new Task</h2>
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
              onFocus={(e) => e.currentTarget.showPicker?.()}
            />
            <button type="submit" disabled={submitting}>
              Add
            </button>
            <button onClick={handleCancel} type="button">
              Cancel
            </button>
          </form>
          {error && <p>{error}</p>}
        </div>
      )}
    </div>
  );
}

type NewTaskFormProps = {
  onCreated: (task: TaskItemResponse) => void;
};
