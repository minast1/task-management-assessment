import { STATUS_LABELS, type Task } from '@/lib/task-schema';
import { formatDate, isOverdue } from '@/lib/tasks-api';
import React from 'react'
import StatusBadge from './status-badge';

type Props = {
  task: Task | null;
  onEdit: () => void;
  onDelete: () => void;
};

export default function TaskDetails({ task, onEdit, onDelete }: Props) {

  if (!task) {
    return (
      <div className="glass-panel p-5 shadow-glass-lg">
        <div className="font-display text-sm font-semibold text-ink">Task detail</div>
        <p className="mt-2 text-sm text-inksoft">
          Select a task from the list to see its full details.
        </p>
      </div>
    );
  }

  const overdue = isOverdue(task);

  return (
    <div className="glass-panel p-5 shadow-glass-lg">
      <div className="flex items-center justify-between">
        <div className="font-display text-sm font-semibold text-ink">Task detail</div>
        <StatusBadge status={task.status} />
      </div>

      <h2 className="mt-3 font-display text-xl font-bold leading-tight text-ink">{task.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-inksoft">{task.description}</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-glass-border bg-glass p-3">
          <div className="text-[10px] font-medium uppercase tracking-wider text-inksoft">
            Created
          </div>
          <div className="mt-0.5 text-xs font-semibold text-ink">{formatDate(task.created_at)}</div>
        </div>
        <div
          className={
            overdue
              ? "rounded-xl border border-status-overdue/30 bg-status-overdue-bg/70 p-3"
              : "rounded-xl border border-glass-border bg-glass p-3"
          }
        >
          <div
            className={
              overdue
                ? "text-[10px] font-medium uppercase tracking-wider text-status-overdue"
                : "text-[10px] font-medium uppercase tracking-wider text-inksoft"
            }
          >
            Due date
          </div>
          <div
            className={
              overdue
                ? "mt-0.5 text-xs font-semibold text-status-overdue"
                : "mt-0.5 text-xs font-semibold text-ink"
            }
          >
            {formatDate(task.due_date)}
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 rounded-xl bg-accent-blue/90 px-4 py-2 text-sm font-semibold text-background shadow-glass"
        >
          Update
        </button>
        <button
          onClick={onDelete}
          className="rounded-xl border border-glass-border bg-glass px-4 py-2 text-sm font-semibold text-inksoft"
        >
          Delete
        </button>
      </div>
    </div>
  );

}

// export default TaskDetails