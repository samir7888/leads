"use client";

import { Transaction } from "@/lib/actions/ledger.actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Remarks</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground">No transactions found.</TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((t) => (
                                <TableRow key={t.id}>
                                    <TableCell>{format(new Date(t.date), "PPP")}</TableCell>
                                    <TableCell className="font-medium">{t.amount.toLocaleString()}</TableCell>
                                    <TableCell>{t.remarks || "-"}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
