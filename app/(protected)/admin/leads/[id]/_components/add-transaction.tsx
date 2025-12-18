"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { addTransaction } from "@/lib/actions/ledger.actions";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function AddTransaction({ ledgerId, ledger }: { ledgerId: string, ledger: any }) {
    const [amount, setAmount] = useState("");
    const [remarks, setRemarks] = useState("");
    const [isPending, startTransition] = useTransition();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (amount > ledger.remainingBalance) {
            return toast.error('Amount must be less than remaining balance.')
        }
        startTransition(async () => {
            const res = await addTransaction(ledgerId, Number(amount), remarks);
            if (res.success) {
                setAmount("");
                setRemarks("");
            } else {
                alert("Failed to add transaction");
            }
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Payment</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="t-amount">Amount</Label>
                        <Input
                            id="t-amount"
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            max={ledger.remainingBalance}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="t-remarks">Remarks (Optional)</Label>
                        <Textarea
                            id="t-remarks"
                            placeholder="Payment method, notes..."
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Adding..." : "Add Transaction"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
