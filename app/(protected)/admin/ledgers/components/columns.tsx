"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox"
import { LedgersSelect } from "@/db/schema/ledgers"
import { deleteLedgers } from "@/lib/actions/ledger.actions"
import { LeadgerForm } from "@/components/ledgers/ledgers-form"

const ActionCell = ({ ledger }: { ledger: LedgersSelect }) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const onDelete = () => {
        if (confirm("Are you sure you want to delete this ledger?")) {
            startTransition(async () => {
                const res = await deleteLedgers([ledger.id]);
                if (res.success) {
                    toast.success("Ledger deleted");
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
                        <DialogTitle>Edit Ledger</DialogTitle>
                        <DialogDescription>
                            Edit ledger details.
                        </DialogDescription>
                    </DialogHeader>
                    <LeadgerForm initialData={ledger} onSuccess={() => setOpen(false)} />
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
                    <DropdownMenuItem onClick={() => router.push(`/admin/ledgers/${ledger.id}`)}>
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

export const columns: ColumnDef<LedgersSelect>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "companyName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Company Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="ml-4 font-medium">{row.getValue("companyName")}</div>,
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "totalAmount",
        header: "Total Amount",
    },
    {
        accessorKey: "contactPersonName",
        header: "Contact Person",
    },



    {
        id: "actions",
        cell: ({ row }) => <ActionCell ledger={row.original} />,
    },
]
