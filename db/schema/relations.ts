import { relations } from "drizzle-orm";
import { leadsTable } from "./leads";
import { ledgers } from "./ledgers";
import { transactions } from "./transactions";

export const leadsRelations = relations(leadsTable, ({ one }) => ({
    ledger: one(ledgers, {
        fields: [leadsTable.id],
        references: [ledgers.leadId],
    }),
}));

export const ledgersRelations = relations(ledgers, ({ one, many }) => ({
    lead: one(leadsTable, {
        fields: [ledgers.leadId],
        references: [leadsTable.id],
    }),
    transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
    ledger: one(ledgers, {
        fields: [transactions.ledgerId],
        references: [ledgers.id],
    }),
}));
