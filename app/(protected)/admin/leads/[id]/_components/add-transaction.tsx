"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { addTransaction } from "@/lib/actions/ledger.actions";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { EParticular } from "@/lib/validations/ledger.schema";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { LedgersSelect } from "@/db/schema/ledgers";

export function AddTransaction({ ledgerId, ledger }: { ledgerId: string, ledger: LedgersSelect & { totalPaid: number } }) {
    const [amount, setAmount] = useState(0);
    const [remarks, setRemarks] = useState("");
    const [particular, setParticular] = useState<EParticular>(EParticular.Invoice);
    const [isPending, startTransition] = useTransition();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (particular === EParticular.Payment && amount > ledger.totalAmount) {
            return toast.error('Amount must be less than remaining balance.')
        }
        startTransition(async () => {
            const res = await addTransaction({
                amount: Number(amount),
                ledgerId,
                particular: particular,
                remarks,
            });
            if (res.success) {
                setAmount(0);
                setRemarks("");
            } else {
                alert("Failed to add transaction");
            }
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Transaction</CardTitle>
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
                            min={1}
                            max={particular === EParticular.Payment ? ledger.totalAmount : undefined}
                            onChange={(e) => setAmount(parseInt(e.target.value))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="t-particular">Particular</Label>
                        <Select

                            value={particular}
                            onValueChange={(val) => setParticular(val as EParticular)}
                            required
                        >
                            <SelectTrigger id="t-particular" className="w-full">
                                <SelectValue placeholder="Select particular" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    Object.values(EParticular).map((particular) => (
                                        <SelectItem key={particular} value={particular}>
                                            {particular}
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
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
