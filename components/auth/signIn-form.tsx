"use client";

import { LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { signInAction } from "@/lib/actions/sign-in.action";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import Image from "next/image";

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }).trim(),
});

export default function SignInForm() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            try {
                await signInAction(values.email);
                router.push("/auth/signin/verify-request?email=" + values.email);
            } catch (e) {
                if (e instanceof Error) {
                    form.setError("email", { type: "manual", message: e.message });
                } else {
                    form.setError("email", {
                        type: "manual",
                        message: "An unexpected error occurred",
                    });
                }
            }
        })
    }

    return (
        <>
            <Card className="min-w-[400px] mt-auto shadow-none border-none bg-transparent">
                <CardHeader>
                    <Link href={"/"}>
                        <Image
                            src={"/logo.png"}
                            alt="Logo"
                            width={64}
                            height={64}
                            className="h-16 w-auto block mx-auto"
                        />
                    </Link>
                    <CardTitle>
                        <h1 className="text-2xl font-bold text-center">Welcome</h1>
                    </CardTitle>
                    <CardDescription className="text-center">
                        Please sign in to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pb-0">

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FieldGroup>
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
                                            aria-invalid={fieldState.invalid}
                                            placeholder="name@gmail.com"
                                            autoComplete="off"
                                        />
                                        <FieldDescription>
                                            A signin link will be sent to this email address.
                                        </FieldDescription>
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
                            type="submit"
                            loadingText="Sending..."
                            className="w-full"
                        >
                            Sign In
                        </LoadingButton>
                    </form>
                </CardContent>
            </Card>

            <section className="mt-auto px-3 py-10">
                <p className="text-sm text-muted-foreground text-center">
                    By continuing, you agree to our{" "}
                    <Link href="/privacy-policy" className="underline">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy-policy" className="underline">
                        Privacy Policy
                    </Link>
                    .
                </p>
            </section>
        </>
    );
}
