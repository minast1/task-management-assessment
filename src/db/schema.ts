import { date, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";


export const tasksTable = pgTable("tasks", {
    id: uuid().defaultRandom().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    status: varchar("status", { length: 255 }).notNull(),
    dueDate: date("due_date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})