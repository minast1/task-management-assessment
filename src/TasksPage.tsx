import React, { useMemo, useState } from 'react'
import type { Task, TaskFormValues } from './lib/task-schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTask, isOverdue, listTasks, updateTask } from './lib/tasks-api';
import TaskDetails from './components/task-details';
import TaskForm from './components/task-form';
import { toast } from "sonner";
import TaskCard from './components/task-card';
import ConfirmModal from './components/confirm-modal';

type Filter = "all" | "active" | "done";

const TasksPage = () => {
    const queryClient = useQueryClient();
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["tasks"] });
    const tasksQuery = useQuery({ queryKey: ["tasks"], queryFn: listTasks });
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [filter, setFilter] = useState<Filter>("all");
    const [pendingDelete, setPendingDelete] = useState<Task | null>(null);

    const tasks = useMemo(() => tasksQuery.data ?? [], [tasksQuery.data]);

    const selected = tasks.find((task) => task.id === selectedId) ?? null;
    const editing = tasks.find((task) => task.id === editingId) ?? null;

    const visible = tasks.filter((task) =>
        filter === "all" ? true : filter === "done" ? task.status === "done" : task.status === "in_progress",
    );

    const counts = {
        open: tasks.filter((t) => t.status === "backlog" || t.status === "in_progress").length,
        review: tasks.filter((t) => t.status === "in_review").length,
        done: tasks.filter((t) => t.status === "done").length,
        overdue: tasks.filter(isOverdue).length,
    };

    const createMutation = useMutation({
        mutationFn: createTask,
        onSuccess: async (task) => {
            await invalidate();
            setSelectedId(task.id);
            toast.success("Task created successfully");
        },
        onError: (error: Error) => toast.error(error.message),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, values }: { id: string; values: TaskFormValues }) => updateTask(id, values),
        onSuccess: async () => {
            await invalidate();
            setEditingId(null);
            toast.success("Task updated successfully");
        },
        onError: (error: Error) => toast.error(error.message),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: async (_data, id) => {
            await invalidate();
            if (selectedId === id) setSelectedId(null);
            if (editingId === id) setEditingId(null);
            setPendingDelete(null);
            toast.success("Task deleted");
        },
        onError: (error: Error) => {
            setPendingDelete(null);
            toast.error(error.message);
        },
    });

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[oklch(0.94_0.017_262)] via-[oklch(0.95_0.017_255)] to-[oklch(0.92_0.018_272)] font-sans text-ink">
            <div
                className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-accent-blue/25 blur-3xl"
                style={{ animation: "floatA 16s ease-in-out infinite" }}
            />
            <div
                className="pointer-events-none absolute -right-20 top-1/3 h-96 w-96 rounded-full bg-accent-blue/15 blur-3xl"
                style={{ animation: "floatB 20s ease-in-out infinite" }}
            />
            <div
                className="pointer-events-none absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-background/60 blur-3xl"
                style={{ animation: "floatC 22s ease-in-out infinite" }}
            />

            <div className="relative mx-auto max-w-6xl px-6 py-8 lg:px-10">
                <header className="glass-panel flex items-center justify-center px-6 py-4">

                    <div className="flex items-center gap-1 rounded-xl border border-glass-border bg-glass p-1 backdrop-blur">
                        {(["all", "active", "done"] as const).map((value) => (
                            <button
                                key={value}
                                onClick={() => setFilter(value)}
                                className={
                                    filter === value
                                        ? "rounded-lg bg-accent-blue/90 px-3 py-1.5 text-xs font-semibold text-background shadow-glass"
                                        : "rounded-lg px-3 py-1.5 text-xs font-semibold text-inksoft hover:bg-glass-strong"
                                }
                            >
                                {value === "all" ? "All" : value === "active" ? "Active" : "Done"}
                            </button>
                        ))}
                    </div>
                </header>

                <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                        { label: "Open", value: counts.open, accent: false },
                        { label: "In review", value: counts.review, accent: false },
                        { label: "Done", value: counts.done, accent: false },
                        { label: "Overdue", value: counts.overdue, accent: true },
                    ].map((stat) => (
                        <div key={stat.label} className="glass-panel p-4">
                            <div className="text-[11px] font-medium uppercase tracking-wider text-inksoft">
                                {stat.label}
                            </div>
                            <div
                                className={
                                    stat.accent
                                        ? "mt-1 font-display text-3xl font-bold text-accent-blue"
                                        : "mt-1 font-display text-3xl font-bold"
                                }
                            >
                                {stat.value}
                            </div>
                        </div>
                    ))}
                </section>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="glass-panel p-4">
                            <div className="mb-3 flex items-center justify-between px-1">
                                <span className="font-display text-sm font-semibold">Tasks</span>
                                <span className="text-xs font-medium text-inksoft">{visible.length} shown</span>
                            </div>

                            {tasksQuery.isLoading ? (
                                <p className="px-1 py-6 text-sm text-inksoft">Loading tasks…</p>
                            ) : tasksQuery.isError ? (
                                <div className="px-1 py-6">
                                    <p className="text-sm text-status-overdue">
                                        {(tasksQuery.error as Error).message}
                                    </p>
                                    <button
                                        onClick={() => tasksQuery.refetch()}
                                        className="mt-2 rounded-xl border border-glass-border bg-glass px-3 py-1.5 text-xs font-semibold text-inksoft"
                                    >
                                        Try again
                                    </button>
                                </div>
                            ) : visible.length === 0 ? (
                                <p className="px-1 py-6 text-sm text-inksoft">
                                    No tasks here yet. Create one with the form.
                                </p>
                            ) : (
                                <div className="space-y-2.5">
                                    {visible.map((task) => {
                                        const active = task.id === selectedId;
                                        const overdue = isOverdue(task);
                                        return (
                                            <TaskCard key={task.id} task={task} active={active} overdue={overdue} setSelectedId={setSelectedId} />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <aside className="space-y-5">
                        <TaskDetails
                            task={selected}
                            onEdit={() => selected && setEditingId(selected.id)}
                            onDelete={() => selected && setPendingDelete(selected)}
                        />

                        <TaskForm
                            task={selected}
                            pending={createMutation.isPending || updateMutation.isPending}
                            editing={editingId === selected?.id}
                            onSubmit={(values) => {
                                if (selected && editingId === selected.id) {
                                    updateMutation.mutate({ id: selected.id, values });
                                } else {
                                    createMutation.mutate(values);
                                }
                            }}
                            onCancelEdit={() => setEditingId(null)}
                        />

                    </aside>
                </div>
            </div>

            {pendingDelete ? (
                <ConfirmModal
                    pendingDelete={pendingDelete}
                    deleteMutation={deleteMutation}
                    setPendingDelete={setPendingDelete}
                />
            ) : null}
        </div>
    )
}

export default TasksPage