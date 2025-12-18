import { getLead } from "@/lib/actions/leads.actions";
import { getLedgerByLeadId } from "@/lib/actions/ledger.actions";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { LedgerCard } from "./_components/ledger-card";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { TransactionList } from "./_components/transaction-list";
import { AddTransaction } from "./_components/add-transaction";

export default async function LeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Parallel data fetching
    const leadPromise = getLead(id);
    const ledgerPromise = getLedgerByLeadId(id);

    const [leadRes, ledgerRes] = await Promise.all([leadPromise, ledgerPromise]);

    if (!leadRes.success || !leadRes.data) {
        return notFound();
    }

    const lead = leadRes.data;
    const ledger = ledgerRes.success ? ledgerRes.data : null;

    return (
        <div className="space-y-6  p-8 pt-6">
            <div>
                <div className="flex items-center justify-between">
                    <Heading title={lead.name} description={`${lead.email} | ${lead.phone}`} />
                    <Badge variant="outline" className="text-lg">{lead.status}</Badge>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-md">
                        <h3 className="font-semibold mb-2">Details</h3>
                        <p><strong>Address:</strong> {lead.address || "N/A"}</p>
                        <p><strong>Interested Course:</strong> {lead.interestedCourse || "N/A"}</p>
                    </div>
                    {/* Placeholder for future stats or notes */}
                </div>
            </div>

            <Separator />

            <div>
                <h3 className="text-2xl font-bold tracking-tight mb-4">Ledger & Payments</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <div className="col-span-4">
                        {ledger ? (
                            <TransactionList transactions={ledger.transactions} />
                        ) : (
                            <div className="p-4 border border-dashed rounded-md text-center text-muted-foreground">
                                No ledger created yet.
                            </div>
                        )}
                    </div>
                    <div className="col-span-3 space-y-4">
                        <LedgerCard ledger={ledger} leadId={lead.id} />
                        {ledger && ledger.remainingBalance > 0 && <AddTransaction ledger={ledger} ledgerId={ledger.id} />}
                        {ledger && ledger.remainingBalance == 0 && <p>No payments to be done</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
