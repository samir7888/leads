import { pgTable, uuid, integer, timestamp, text } from "drizzle-orm/pg-core";
import { leadsTable } from "./leads";
import z from "zod";

export const ledgers = pgTable("ledgers", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyName: text().notNull(),
  contactPersonName: text().notNull(),
  email: text("email").notNull(),
  leadId: uuid("lead_id") // Using lead_id for consistent naming convention in DB
    .references(() => leadsTable.id, { onDelete: "cascade" }),
  phone: text("phone").notNull(),
  panNo: text("pan_no").notNull(),
  address: text("address").notNull(),
  totalAmount: integer("total_amount").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type LedgersSelect = typeof ledgers.$inferSelect;
