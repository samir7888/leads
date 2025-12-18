"use server";

import { signOut } from "@/lib/auth";

export default async function () {
    await signOut({ redirectTo: "/auth/signin" });
}