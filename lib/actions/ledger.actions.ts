"use server";

import { db } from "@/db";
import { ledgers } from "@/db/schema/ledgers";
import { particularEnum, transactions, TTransactionInsert } from "@/db/schema/transactions";
import { eq, desc, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import checkAuth from "../checkAuth";
import { EParticular, LedgerFormValues } from "../validations/ledger.schema";

export type Ledger = typeof ledgers.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;

export async function getLedgerByLeadId(leadId: string) {
  await checkAuth(["admin"]);
  try {
    const ledger = await db.query.ledgers.findFirst({
      where: eq(ledgers.leadId, leadId),
      with: {
        transactions: {
          orderBy: [desc(transactions.date)],
        },
      },
    });

    if (!ledger) {
      return { success: true, data: null };
    }

    const totalPaid = ledger.transactions.reduce((sum, t) => sum + t.amount, 0);

    return {
      success: true,
      data: {
        ...ledger,
        totalPaid,
      },
    };
  } catch (error) {
    console.error("Error fetching ledger:", error);
    return { success: false, error: "Failed to fetch ledger" };
  }
}

export async function getLedgerById(id: string) {
  await checkAuth(["admin"]);
  try {
    const ledger = await db.query.ledgers.findFirst({
      where: eq(ledgers.id, id),
      with: {
        transactions: {
          orderBy: [desc(transactions.date)],
        },
      },
    });

    if (!ledger) {
      return { success: true, data: null };
    }

    const totalPaid = ledger.transactions.reduce((sum, t) => {
      if (t.particular === EParticular.Payment) {
        return sum + t.amount;
      }
      return sum;
    }, 0);

    return {
      success: true,
      data: {
        ...ledger,
        totalPaid,
      },
    };
  } catch (error) {
    console.error("Error fetching ledger:", error);
    return { success: false, error: "Failed to fetch ledger" };
  }
}

export async function getLedgers() {
  await checkAuth(["admin"]);
  try {
    const ledgers = await db.query.ledgers.findMany();
    return ledgers;
  } catch (error) {
    console.error("Error fetching ledgers:", error);
  }
}

export async function createLedger(ledger: LedgerFormValues) {
  await checkAuth(["admin"]);
  try {
    const [newLedger] = await db.insert(ledgers).values(ledger).returning();

    if (ledger.leadId) {
      revalidatePath(`/leads/${ledger.leadId}`);
    }
    revalidatePath(`/admin/ledgers`);
    return { success: true, data: newLedger };
  } catch (error) {
    console.error("Error creating ledger:", error);
    return { success: false, error: "Failed to create ledger" };
  }
}

export async function deleteLedgers(ids: string[]) {
  await checkAuth(["admin"]);
  try {
    await db.delete(ledgers).where(inArray(ledgers.id, ids));
    revalidatePath("/admin/ledgers");
    return { success: true };
  } catch (error) {
    console.error("Error deleting ledger:", error);
    return { success: false, error: "Failed to delete ledgers" };
  }
}

export async function updateLedger(id: string, data: Partial<LedgerFormValues>) {
      await checkAuth(['admin'])
    try {
        const [updatedLead] = await db
            .update(ledgers)
            .set(data)
            .where(eq(ledgers.id, id))
            .returning();

        revalidatePath("/leadsTable");
        revalidatePath(`/leadsTable/${id}`);
        return { success: true, data: updatedLead };
    } catch (error) {
        console.error("Error updating lead:", error);
        return { success: false, error: "Failed to update lead" };
    }
}

export async function addTransaction(transaction: TTransactionInsert, leadId?: string) {
  await checkAuth(["admin"]);
  try {
    const ledger = await db.query.ledgers.findFirst({
      where: eq(ledgers.id, transaction.ledgerId),
      columns: {
        id: true,
        totalAmount: true,
      },
    });
  
    if (!ledger) {
      throw new Error("Ledger not found");
    }

    await db.transaction(async (tx) => {
    await tx
      .insert(transactions)
      .values(transaction)
      .returning();

    await tx
        .update(ledgers)
        .set({
          totalAmount: transaction.particular === EParticular.Payment 
          ? ledger.totalAmount - transaction.amount 
          : ledger.totalAmount + transaction.amount,
        })
        .where(eq(ledgers.id, transaction.ledgerId))
        .returning();
    })
    if (leadId) {
      revalidatePath(`/admin/leads/${leadId}`);
    }
    revalidatePath(`/admin/ledgers/${transaction.ledgerId}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding transaction:", error);
    return { success: false, error: "Failed to add transaction" };
  }
}
