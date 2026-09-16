import { z } from "zod";

export const TASK_STATUSES = ["backlog", "in_progress", "in_review", "done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const STATUS_LABELS: Record<TaskStatus, string> = {
    backlog: "Backlog",
    in_progress: "In progress",
    in_review: "In review",
    done: "Done",
};

export const taskFormSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, { message: "Title is required." })
        .max(120, { message: "Title must be 120 characters or fewer." }),
    description: z
        .string()
        .trim()
        .min(1, { message: "Description is required." })
        .max(1000, { message: "Description must be 1000 characters or fewer." }),
    status: z.enum(TASK_STATUSES, { message: "Pick a valid status." }),
    dueDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Due date is required (YYYY-MM-DD)." })
        .refine((value) => !Number.isNaN(new Date(value).getTime()), {
            message: "Due date must be a valid date.",
        })
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export const taskRowSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    status: z.enum(TASK_STATUSES),
    due_date: z.string(),
    //requirements: z.array(z.string()),
    created_at: z.string(),
});

export type Task = z.infer<typeof taskRowSchema>;

export function fieldErrors(error: z.ZodError<TaskFormValues>) {
    const out: Partial<Record<keyof TaskFormValues, string>> = {};
    for (const issue of error.issues) {
        const key = issue.path[0] as keyof TaskFormValues | undefined;
        if (key && !out[key]) out[key] = issue.message;
    }
    return out;
}
