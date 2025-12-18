"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLedger } from "@/lib/actions/ledger.actions";

export function CreateLedgerDialog({ leadId }: { leadId: string }) {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [isPending, startTransition] = useTransition();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const res = await createLedger(leadId, Number(amount));
            if (res.success) {
                setOpen(false);
            } else {
                alert("Failed to create ledger");
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full">Initialize Ledger</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set Total Fee</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Total Agreed Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="e.g. 50000"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Creating..." : "Create Ledger"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
