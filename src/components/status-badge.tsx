import { STATUS_LABELS, type TaskStatus } from '@/lib/task-schema';


const STATUS_CLASSES: Record<TaskStatus, string> = {
    backlog: "bg-status-backlog-bg text-status-backlog",
    in_progress: "bg-status-progress-bg text-status-progress",
    in_review: "bg-status-review-bg text-status-review",
    done: "bg-status-done-bg text-status-done",
};

export default function StatusBadge({ status }: { status: TaskStatus }) {
    return (
        <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_CLASSES[status]}`}
        >
            {STATUS_LABELS[status]}
        </span>
    );
}

// export default StatusBadge