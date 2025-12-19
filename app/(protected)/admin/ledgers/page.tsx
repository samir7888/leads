import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { getLedgers, } from '@/lib/actions/ledger.actions';
import React from 'react'
import { DataTable } from './components/data-table';
import { columns } from './components/columns';

const Ledger = async () => {
    const ledgers = await getLedgers();


    return (
        <div className="flex-1 space-y-4  p-8 pt-6">
            <div className="flex items-center justify-between">
                <Heading title="Ledgers" description="Manage your ledgers" />
            </div>
            <Separator />
            <DataTable columns={columns} data={ledgers || []} />

        </div>
    );
}

export default Ledger