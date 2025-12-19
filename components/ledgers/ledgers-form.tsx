"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { LoadingButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { LedgersSelect } from "@/db/schema/ledgers"
import { ledgerFormDefaultValues, LedgerFormValues, ledgerSchema } from "@/lib/validations/ledger.schema"
import { createLedger, updateLedger } from "@/lib/actions/ledger.actions"

interface LedgerFormProps {
    initialData?: LedgersSelect | null;
    onSuccess?: () => void;
}

export const LeadgerForm: React.FC<LedgerFormProps> = ({ initialData, onSuccess }) => {
    const [isPending, startTransition] = useTransition();

    const form = useForm<LedgerFormValues>({
        resolver: zodResolver(ledgerSchema),
        defaultValues: initialData ?? ledgerFormDefaultValues
    });

    const onSubmit = (data: LedgerFormValues) => {
        startTransition(async () => {
            if (initialData) {
                // Update
                const res = await updateLedger(initialData.id, data);
                if (res.success) {
                    onSuccess?.();
                } else {
                    alert("Failed to update");
                }
            } else {
                // Create
                const res = await createLedger(data);
                if (res.success) {
                    onSuccess?.();
                    form.reset();
                } else {
                    alert("Failed to create");
                }
            }
        });
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
                <Controller
                    name="companyName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="companyName">
                                Company Name
                            </FieldLabel>
                            <Input
                                {...field}
                                id="companyName"
                                aria-invalid={fieldState.invalid}
                                placeholder="Company Name"
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="email">
                                Email
                            </FieldLabel>
                            <Input
                                {...field}
                                id="email"
                                type="email"
                                aria-invalid={fieldState.invalid}
                                placeholder="name@gmail.com"
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="phone"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="phone">
                                Phone
                            </FieldLabel>
                            <Input
                                {...field}
                                id="phone"
                                type="tel"
                                aria-invalid={fieldState.invalid}
                                placeholder="123-456-7890"
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="address"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="address">
                                Address
                            </FieldLabel>
                            <Input
                                {...field}
                                id="address"
                                placeholder="Address"
                                type="text"
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                 <Controller
                    name="panNo"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="panNo">
                                Pan Number
                            </FieldLabel>
                            <Input
                                {...field}
                                id="panNo"
                                aria-invalid={fieldState.invalid}
                                placeholder="Pan Number"
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="contactPersonName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="contactPersonName">
                                Contact Person Name
                            </FieldLabel>
                            <Input
                                {...field}
                                id="contactPersonName"
                                aria-invalid={fieldState.invalid}
                                placeholder="Contact Person Name"
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
               

            </FieldGroup>

            <LoadingButton
                isLoading={isPending}
                disabled={isPending}
                loadingText="Saving..."
                type="submit"
                className="w-full"
            >
                {initialData ? "Save changes" : "Create Ledger"}
            </LoadingButton>
        </form>
    );
};
