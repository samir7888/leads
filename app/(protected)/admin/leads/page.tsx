import { getLeads } from "@/lib/actions/leads.actions";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

export default async function LeadsPage() {
    const { data: leads } = await getLeads();



    return (
        <div className="flex-1 space-y-4  p-8 pt-6">
            <div className="flex items-center justify-between">
                <Heading title="Leads" description="Manage your leads and their status" />
            </div>
            <Separator />
            <DataTable columns={columns} data={leads || []} />

        </div>
    );
}
