import React from 'react'
import type { Task } from '@/lib/task-schema'
import StatusBadge from './status-badge';
import { formatDate } from '@/lib/tasks-api';


type TaskCardProps = {
    task: Task;
    active: boolean;
    overdue: boolean;
    setSelectedId: (id: string) => void;
}
const TaskCard = ({ task, active, overdue, setSelectedId }: TaskCardProps) => {
    return (
        <button
            key={task.id}
            onClick={() => setSelectedId(task.id)}
            className={
                active
                    ? "w-full rounded-xl border border-accent-blue/30 bg-glass-strong p-3.5 text-left shadow-glass backdrop-blur"
                    : "w-full rounded-xl border border-glass-border bg-glass p-3.5 text-left shadow-glass backdrop-blur"
            }
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div
                        className={
                            task.status === "done"
                                ? "truncate text-sm font-semibold text-inksoft line-through"
                                : "truncate text-sm font-semibold"
                        }
                    >
                        {task.title}
                    </div>
                    <div className="mt-0.5 line-clamp-1 text-xs text-inksoft">
                        {task.description}
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <StatusBadge status={task.status} />
                    <span
                        className={
                            overdue
                                ? "rounded-full bg-status-overdue-bg px-2.5 py-0.5 text-[11px] font-semibold text-status-overdue"
                                : "rounded-full bg-glass-strong px-2.5 py-0.5 text-[11px] font-semibold text-inksoft"
                        }
                    >
                        {overdue ? "Overdue " : "Due "}
                        {formatDate(task.due_date)}
                    </span>
                </div>
            </div>
        </button>
    )
}

export default TaskCard