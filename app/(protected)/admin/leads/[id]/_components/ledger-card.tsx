"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CreateLedgerDialog } from "./create-ledger-dialog";

interface LedgerCardProps {
    ledger: any; // Type strictly with Awaited<ReturnType<typeof getLedgerByLeadId>>['data']
    leadId: string;
}

export function LedgerCard({ ledger, leadId }: LedgerCardProps) {
    if (!ledger) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Ledger Found</CardTitle>
                    <CardDescription>Create a ledger to track payments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CreateLedgerDialog leadId={leadId} />
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
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Total Fee</span>
                    <span className="font-bold text-lg">{ledger.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Total Paid</span>
                    <span className="font-bold text-lg text-green-600">{ledger.totalPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className="font-bold text-xl text-red-600">{ledger.remainingBalance.toLocaleString()}</span>
                </div>
            </CardContent>
        </Card>
    );
}
