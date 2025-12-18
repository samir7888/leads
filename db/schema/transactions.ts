import { pgTable, uuid, integer, timestamp, text } from "drizzle-orm/pg-core";
import { ledgers } from "./ledgers";

export const transactions = pgTable("transactions", {
    id: uuid("id").primaryKey().defaultRandom(),
    ledgerId: uuid("ledger_id")
        .notNull()
        .references(() => ledgers.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    date: timestamp("date").defaultNow().notNull(),
    remarks: text("remarks"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
