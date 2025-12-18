import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";

export const leadStatusEnum = pgEnum("lead_status", [
    "New",
    "Contacted",
    "Interested",
    "Enrolled",
    "Closed",
]);

export const leadsTable = pgTable("leads", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    address: text("address").notNull(),
    status: leadStatusEnum("status").notNull().default("New"),
    interestedCourse: text("interested_course").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type LeadSelect = typeof leadsTable.$inferSelect;