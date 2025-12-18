"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { leadSchema, LeadFormValues, leadFormDefaultValues } from "@/lib/validations/lead.schema"
import { useTransition } from "react"
import { createLead, updateLead } from "@/lib/actions/leads.actions"
import { LoadingButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LeadSelect, leadStatusEnum } from "@/db/schema/leads"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"

interface LeadFormProps {
    initialData?: LeadSelect | null;
    onSuccess?: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ initialData, onSuccess }) => {
    const [isPending, startTransition] = useTransition();

    const form = useForm<LeadFormValues>({
        resolver: zodResolver(leadSchema),
        defaultValues: initialData ?? leadFormDefaultValues
    });

    const onSubmit = (data: LeadFormValues) => {
        startTransition(async () => {
            if (initialData) {
                // Update
                const res = await updateLead(initialData.id, data);
                if (res.success) {
                    onSuccess?.();
                } else {
                    alert("Failed to update");
                }
            } else {
                // Create
                const res = await createLead(data);
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
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="name">
                                Name
                            </FieldLabel>
                            <Input
                                {...field}
                                id="name"
                                aria-invalid={fieldState.invalid}
                                placeholder="Lead Name"
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
                    name="interestedCourse"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="interestedCourse">
                                Interested Course
                            </FieldLabel>
                            <Input
                                {...field}
                                id="interestedCourse"
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
                    name="status"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="status">
                                Status
                            </FieldLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {leadStatusEnum.enumValues.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                {initialData ? "Save changes" : "Create Lead"}
            </LoadingButton>
        </form>
    );
};
