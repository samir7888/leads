"use client";

import { useTransition } from "react";
import {  LoadingButton } from "@/components/ui/button";

import { createLedger } from "@/lib/actions/ledger.actions";
import { LeadSelect } from "@/db/schema/leads";
import { toast } from "sonner";

export function CreateLedgerDialog({ lead }: { lead: LeadSelect | undefined | null }) {
    const [isPending, startTransition] = useTransition();
    if (!lead) {
        return null;
    }

    const onSubmit = () => {
        startTransition(async () => {
            const res = await createLedger(
                {
                    address: lead.address,
                    companyName: lead.name,
                    contactPersonName: lead.name,
                    email: lead.email,
                    leadId: lead.id,
                    phone: lead.phone,
                    panNo: ''

                }
            );
            if (res.success) {
                toast.success("Ledger created");
            } else {
                toast.error("Failed to create ledger");
            }
        });
    }

    return (
        <LoadingButton isLoading={isPending} loadingText="Creating..." className="w-full" onClick={onSubmit}>Initialize Ledger</LoadingButton>
    );
}
