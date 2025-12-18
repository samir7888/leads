"use client"

import { ColumnDef } from "@tanstack/react-table"
import { LeadSelect } from "@/db/schema/leads"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { deleteLead } from "@/lib/actions/leads.actions"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LeadForm } from "@/components/leads/lead-form"

const ActionCell = ({ lead }: { lead: LeadSelect }) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const onDelete = () => {
        if (confirm("Are you sure you want to delete this lead?")) {
            startTransition(async () => {
                const res = await deleteLead(lead.id);
                if (res.success) {
                    toast.success("Lead deleted");
                } else {
                    toast.error("Failed to delete");
                }
            })
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Lead</DialogTitle>
                        <DialogDescription>
                            Edit lead details.
                        </DialogDescription>
                    </DialogHeader>
                    <LeadForm initialData={lead} onSuccess={() => setOpen(false)} />
                </DialogContent>
            </Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push(`/admin/leads/${lead.id}`)}>
                        View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onDelete} className="text-red-500">
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export const columns: ColumnDef<LeadSelect>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="ml-4 font-medium">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            let variant: "default" | "secondary" | "destructive" | "outline" = "default";

            // Simple mapping, can be improved
            if (status === 'New') variant = "secondary";
            if (status === 'Closed') variant = "outline";
            if (status === 'Enrolled') variant = "default";

            return <Badge variant={variant}>{status}</Badge>
        }
    },
    {
        accessorKey: "interestedCourse",
        header: "Course",
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionCell lead={row.original} />,
    },
]
