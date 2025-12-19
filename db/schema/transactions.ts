import { pgTable, uuid, integer, timestamp, text, pgEnum } from "drizzle-orm/pg-core";
import { ledgers } from "./ledgers";

export const particularEnum = pgEnum("particular", [
    "Invoice",
    "Payment",
]);

export const transactions = pgTable("transactions", {
    id: uuid("id").primaryKey().defaultRandom(),
    ledgerId: uuid("ledger_id")
        .notNull()
        .references(() => ledgers.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    date: timestamp("date").defaultNow().notNull(),
    particular: particularEnum("particular").notNull(),
    remarks: text("remarks"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type TTransactionInsert = typeof transactions.$inferInsert;