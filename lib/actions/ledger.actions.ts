"use server";

import { db } from "@/db";
import { ledgers } from "@/db/schema/ledgers";
import { transactions } from "@/db/schema/transactions";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import checkAuth from "../checkAuth";

export type Ledger = typeof ledgers.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;

export async function getLedgerByLeadId(leadId: string) {
      await checkAuth(['admin'])
    try {
        const ledger = await db.query.ledgers.findFirst({
            where: eq(ledgers.leadId, leadId),
            with: {
                transactions: {
                    orderBy: [desc(transactions.date)],
                }
            }
        });

        if (!ledger) {
            return { success: true, data: null };
        }

        const totalPaid = ledger.transactions.reduce((sum, t) => sum + t.amount, 0);
        const remainingBalance = ledger.totalAmount - totalPaid;

        return {
            success: true,
            data: {
                ...ledger,
                totalPaid,
                remainingBalance
            }
        };

    } catch (error) {
        console.error("Error fetching ledger:", error);
        return { success: false, error: "Failed to fetch ledger" };
    }
}

export async function createLedger(leadId: string, totalAmount: number) {
      await checkAuth(['admin'])
    try {
        const [newLedger] = await db.insert(ledgers).values({
            leadId,
            totalAmount,
        }).returning();

        revalidatePath(`/leads/${leadId}`);
        return { success: true, data: newLedger };
    } catch (error) {
        console.error("Error creating ledger:", error);
        return { success: false, error: "Failed to create ledger" };
    }
}

export async function addTransaction(ledgerId: string, amount: number, remarks?: string) {
      await checkAuth(['admin'])
    try {
        const [newTransaction] = await db.insert(transactions).values({
            ledgerId,
            amount,
            remarks
        }).returning();

        revalidatePath(`/leads/${ledgerId}`); // Ideally need leadId here to revalidate the page
        // But for now, we rely on the component generic revalidation or parent revalidation
        return { success: true, data: newTransaction };
    } catch (error) {
        console.error("Error adding transaction:", error);
        return { success: false, error: "Failed to add transaction" };
    }
}
