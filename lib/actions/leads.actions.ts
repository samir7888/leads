"use server";

import { db } from "@/db";
import { leadsTable } from "@/db/schema/leads";
import { eq, desc, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { LeadFormValues } from "../validations/lead.schema";
import checkAuth from "../checkAuth";

export async function getLeads() {
    await checkAuth(['admin'])
    try {
        const allLeads = await db.query.leadsTable.findMany({
            orderBy: [desc(leadsTable.createdAt)],
        });
        return { success: true, data: allLeads };
    } catch (error) {
        console.error("Error fetching leadsTable:", error);
        return { success: false, error: "Failed to fetch leadsTable" };
    }
}

export async function getLead(id: string) {
      await checkAuth(['admin'])
    try {
        const lead = await db.query.leadsTable.findFirst({
            where: eq(leadsTable.id, id),
        });

        if (!lead) return { success: false, error: "Lead not found" };

        return { success: true, data: lead };
    } catch (error) {
        console.error("Error fetching lead:", error);
        return { success: false, error: "Failed to fetch lead" };
    }
}

export async function createLead(data: LeadFormValues) {
      await checkAuth(['admin'])
    try {
        // Validate data? Handled by form typically, but good to have here.
        // For now trusting input from validated form
        const [newLead] = await db.insert(leadsTable).values(data).returning();
        revalidatePath("/leadsTable");
        return { success: true, data: newLead };
    } catch (error) {
        console.error("Error creating lead:", error);
        return { success: false, error: "Failed to create lead" };
    }
}

export async function updateLead(id: string, data: Partial<LeadFormValues>) {
      await checkAuth(['admin'])
    try {
        const [updatedLead] = await db
            .update(leadsTable)
            .set(data)
            .where(eq(leadsTable.id, id))
            .returning();

        revalidatePath("/leadsTable");
        revalidatePath(`/leadsTable/${id}`);
        return { success: true, data: updatedLead };
    } catch (error) {
        console.error("Error updating lead:", error);
        return { success: false, error: "Failed to update lead" };
    }
}

export async function deleteLead(ids: string[]) {
      await checkAuth(['admin'])
    try {
        await db.delete(leadsTable).where(inArray(leadsTable.id, ids));
        revalidatePath("/leadsTable");
        return { success: true };
    } catch (error) {
        console.error("Error deleting lead:", error);
        return { success: false, error: "Failed to delete lead" };
    }
}
