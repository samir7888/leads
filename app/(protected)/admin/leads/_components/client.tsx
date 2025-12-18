"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { columns } from "./columns";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LeadForm } from "@/components/leads/lead-form";
import { LeadSelect } from "@/db/schema/leads";

interface LeadsClientProps {
    data: LeadSelect[];
}

export const LeadsClient: React.FC<LeadsClientProps> = ({ data }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="flex items-center justify-between">
                <div />
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add New
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Lead</DialogTitle>
                            <DialogDescription>
                                Add a new lead to the system.
                            </DialogDescription>
                        </DialogHeader>
                        <LeadForm onSuccess={() => setOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>
            <DataTable columns={columns} data={data} />
        </>
    );
};
