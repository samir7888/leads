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

    return (
        <>
        </>
    );
};
