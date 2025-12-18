import { getLeads } from "@/lib/actions/leads.actions";
import { Separator } from "@/components/ui/separator";
import { LeadsClient } from "./_components/client";
import { Heading } from "@/components/ui/heading";

export default async function LeadsPage() {
    const { data: leads } = await getLeads();

    return (
        <div className="flex-1 space-y-4  p-8 pt-6">
            <div className="flex items-center justify-between">
                <Heading title="Leads" description="Manage your leads and their status" />
            </div>
            <Separator />
            <LeadsClient data={leads || []} />
        </div>
    );
}
