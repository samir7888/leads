import { getLead } from "@/lib/actions/leads.actions";
import { getLedgerById } from "@/lib/actions/ledger.actions";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { TransactionList } from "../../leads/[id]/_components/transaction-list";
import { LedgerCard } from "../../leads/[id]/_components/ledger-card";
import { AddTransaction } from "../../leads/[id]/_components/add-transaction";

export default async function LedgerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Parallel data fetching
    const ledgerPromise = getLedgerById(id);

    const [ledgerRes] = await Promise.all([ledgerPromise]);

    if (!ledgerRes.success || !ledgerRes.data) {
        return notFound();
    }

    const ledger = ledgerRes.data;
    let lead = null;
    if (ledger.leadId) {
        const leadRes = await getLead(ledger.leadId);
        if (leadRes.success) {
            lead = leadRes.data;
        }
    }

    return (
        <div className="space-y-6  p-8 pt-6">
            <div>
                <div className="flex items-center justify-between">
                    <Heading title={ledger.companyName} description={`${ledger.email} | ${ledger.phone}`} />
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-md space-y-2">
                        <h3 className="font-semibold text-lg mb-2">Details</h3>
                        <p><strong>Address:</strong> {ledger.address || "N/A"}</p>
                        <p><strong>Pan No:</strong> {ledger.panNo || "N/A"}</p>
                    </div>
                    {/* Placeholder for future stats or notes */}
                </div>
            </div>

            <Separator />

            <div>
                <h3 className="text-2xl font-bold tracking-tight mb-4">Ledger & Payments</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <div className="col-span-4">

                        <TransactionList transactions={ledger.transactions} />

                    </div>
                    <div className="col-span-3 space-y-4">
                        <LedgerCard ledger={ledger} lead={lead} />
                        <AddTransaction ledger={ledger} ledgerId={ledger.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}
