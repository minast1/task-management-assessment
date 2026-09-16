import { fieldErrors, STATUS_LABELS, TASK_STATUSES, taskFormSchema, type Task, type TaskFormValues, type TaskStatus } from '@/lib/task-schema';
import { toValues } from '@/lib/tasks-api';
import React, { useEffect, useState } from 'react'
import { Spinner } from './ui/spinner';

type Props = {
  task: Task | null;
  editing: boolean;
  pending: boolean;
  onSubmit: (values: TaskFormValues) => void;
  onCancelEdit: () => void;
};


const empty: TaskFormValues = {
  title: "",
  description: "",
  status: "backlog",
  dueDate: "",

};


const TaskForm = ({ task, editing, onSubmit, onCancelEdit, pending }: Props) => {
  const [values, setValues] = useState<TaskFormValues>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormValues, string>>>({});

  useEffect(() => {
    setValues(task && editing ? toValues(task) : empty);
    setErrors({});
  }, [task, editing]);

  //const editing = Boolean(task);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = taskFormSchema.safeParse(values);

    if (!result.success) {
      setErrors(fieldErrors(result.error));
      return;
    }
    setErrors({});
    onSubmit(result.data);
    if (!editing) {
      setValues(empty);
    }

  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-5">
      <div className="flex items-center justify-between">
        <span className="font-display text-sm font-semibold text-ink">
          {editing ? "Edit task" : "New task"}
        </span>
      </div>

      <div className="mt-3 space-y-2.5">
        <div>
          <input
            className="field-input"
            placeholder="Task title"
            aria-label="Task title"
            aria-invalid={Boolean(errors.title)}
            value={values.title}
            onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
          />
          {errors.title ? (
            <p className="mt-1 text-[11px] font-medium text-status-overdue">{errors.title}</p>
          ) : null}
        </div>

        <div>
          <textarea
            rows={3}
            className="field-input resize-none"
            placeholder="Description"
            aria-label="Description"
            aria-invalid={Boolean(errors.description)}
            value={values.description}
            onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          />
          {errors.description ? (
            <p className="mt-1 text-[11px] font-medium text-status-overdue">{errors.description}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-inksoft">
              Status
            </div>
            <select
              className="field-input"
              aria-label="Status"
              value={values.status}
              onChange={(e) =>
                setValues((v) => ({ ...v, status: e.target.value as TaskStatus }))
              }
            >
              {TASK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-inksoft">
              Due date
            </div>
            <input
              type="date"
              className="field-input"
              aria-label="Due date"
              aria-invalid={Boolean(errors.dueDate)}
              value={values.dueDate}
              onChange={(e) => setValues((v) => ({ ...v, dueDate: e.target.value }))}
            />
          </div>
        </div>
        {errors.dueDate ? (
          <p className="text-[11px] font-medium text-status-overdue">{errors.dueDate}</p>
        ) : null}

      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-background disabled:opacity-60"
        >
          {pending ? (
            <Spinner className="size-4" />
          ) : editing ? "Save changes" : "Create task"}
        </button>
        {editing ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-xl border border-glass-border bg-glass px-4 py-2 text-sm font-semibold text-inksoft"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

export default TaskForm