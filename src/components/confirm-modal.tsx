import React from 'react'
import type { Task } from '@/lib/task-schema';
import { STATUS_LABELS } from '@/lib/task-schema';
import type { useMutation } from '@tanstack/react-query';

type ConfirmModalProps = {
    pendingDelete: Task;
    deleteMutation: ReturnType<typeof useMutation>;
    setPendingDelete: (pendingDelete: Task | null) => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ pendingDelete, deleteMutation, setPendingDelete }) => {
    return (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
            <div
                className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
                onClick={() => setPendingDelete(null)}
            />
            <div className="glass-panel relative w-full max-w-sm bg-glass-strong p-5 shadow-glass-lg">
                <h3 className="font-display text-lg font-bold">Delete this task?</h3>
                <p className="mt-1 text-sm text-inksoft">
                    “{pendingDelete.title}” will
                    be removed permanently. Status: {STATUS_LABELS[pendingDelete.status]}.
                </p>
                <div className="mt-5 flex justify-end gap-2">
                    <button
                        onClick={() => setPendingDelete(null)}
                        className="rounded-xl border border-glass-border bg-glass px-4 py-2 text-sm font-semibold text-inksoft"
                    >
                        Keep it
                    </button>
                    <button
                        disabled={deleteMutation.isPending}
                        onClick={() => deleteMutation.mutate(pendingDelete.id)}
                        className="rounded-xl bg-status-overdue px-4 py-2 text-sm font-semibold text-background disabled:opacity-60"
                    >
                        Delete task
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal