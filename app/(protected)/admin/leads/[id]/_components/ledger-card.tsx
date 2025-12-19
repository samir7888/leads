"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CreateLedgerDialog } from "./create-ledger-dialog";
import { LeadSelect } from "@/db/schema/leads";
import { getLedgerByLeadId } from "@/lib/actions/ledger.actions";

interface LedgerCardProps {
    ledger: Awaited<ReturnType<typeof getLedgerByLeadId>>['data']; // Type strictly with Awaited<ReturnType<typeof getLedgerByLeadId>>['data']
    lead?: LeadSelect | null
}

export function LedgerCard({ ledger, lead }: LedgerCardProps) {
    if (!ledger) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Ledger Found</CardTitle>
                    <CardDescription>Create a ledger to track payments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CreateLedgerDialog lead={lead || undefined} />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ledger Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Due Amount</span>
                    <span className="font-bold text-lg">{ledger.totalAmount.toLocaleString()}</span>
                </div>
            </CardContent>
        </Card>
    );
}
