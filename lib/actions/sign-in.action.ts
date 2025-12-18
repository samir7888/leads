"use server"

import { db } from '@/db';
import { users } from '@/db/schema/auth';
import { and, eq, inArray } from 'drizzle-orm';
import { z } from 'zod'
import { signIn } from '../auth';

const emailSchema = z.string().email("Invalid email address").trim();

export async function signInAction(email: string) {
    if (typeof email !== "string") {
        throw new Error("Email must be a string");
    }

    const parsedEmail = emailSchema.safeParse(email);

    if (!parsedEmail.success) {
        throw new Error(parsedEmail.error.message);
    }

    // check for admin/moderator user
    const [adminUser] = await db.select().from(users).where(and(eq(users.email, email), inArray(users.role, ["admin", "moderator"]))).limit(1);

    if (!adminUser) {
        throw new Error("Invalid Email");
    }

    await signIn("resend", { email, redirect: false });
}