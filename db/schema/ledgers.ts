import { pgTable, uuid, integer, timestamp } from "drizzle-orm/pg-core";
import { leadsTable } from "./leads";

export const ledgers = pgTable("ledgers", {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id") // Using lead_id for consistent naming convention in DB
        .notNull()
        .references(() => leadsTable.id, { onDelete: "cascade" }),
    totalAmount: integer("total_amount").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});
