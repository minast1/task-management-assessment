import { supabase } from "@/utils/supabase";
import { taskRowSchema, type Task, type TaskFormValues } from "./task-schema";

function fail(message: string, error: unknown): never {
    console.error(message, error);
    throw new Error(message);
}

export async function listTasks(): Promise<Task[]> {
    const { data, error } = await supabase
        .from("tasks")
        .select()
        .order("due_date", { ascending: true });
    if (error) fail("Could not load tasks. Please try again.", error);
    const parsed = taskRowSchema.array().safeParse(data ?? []);
    if (!parsed.success) fail("Received unexpected task data from the server.", parsed.error);
    return parsed.data;
}

function toRow(values: TaskFormValues) {
    return {
        title: values.title,
        description: values.description,
        status: values.status,
        due_date: values.dueDate,
    };
}

export async function createTask(values: TaskFormValues): Promise<Task> {
    const { data, error } = await supabase.from("tasks").insert(toRow(values)).select().single();
    if (error) fail("Could not create the task. Please try again.", error);
    return taskRowSchema.parse(data);
}

export async function updateTask(id: string, updates: TaskFormValues): Promise<Task> {
    const { data, error } = await supabase
        .from("tasks")
        .update({ ...toRow(updates), id })
        .eq("id", id)
        .select()
        .maybeSingle();
    if (error) fail("Could not save your changes. Please try again.", error);

    if (!data) fail("That task no longer exists.", null);

    return taskRowSchema.parse(data);
}

export async function deleteTask(id: string): Promise<void> {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) fail("Could not delete the task. Please try again.", error);
}

export function isOverdue(task: Task) {
    if (task.status === "done") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(`${task.due_date}`) < today;
}

export function formatDate(value: string) {
    const date = new Date(value.length === 10 ? `${value}` : value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

export function toValues(task: Task): TaskFormValues {
    return {
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.due_date,
        //requirements: task.requirements,
    };
}