import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { db } from "@/db";
import {
    accounts,
    authenticators,
    sessions,
    users,
    verificationTokens,
} from "@/db/schema/auth";
import { sendVerificationRequest } from "./authSendRequest";

export const { handlers, auth, signIn, signOut } = NextAuth({
    theme: {
        logo: "/logo.png",
    },
    //@ts-ignore
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
        authenticatorsTable: authenticators,
    }),
    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signout",
        error: "/auth/error",
        verifyRequest: "/auth/signin/verify-request",
        newUser: "/auth/new-user",
    },
    callbacks: {
        async session({ session, user }) {
            session.user.id = user.id;
            session.user.role = user.role;
            session.user.profileCompleted = user.profileCompleted;

            return session;
        },
    },
    providers: [
        Google,
        Resend({
            from: "no-reply@qubide.cloud",
            maxAge: 60 * 60, // 1 hour
            sendVerificationRequest({
                // for custom email template
                identifier,
                url,
                provider,
            }) {
                if (!provider.apiKey || !provider.from) return;

                sendVerificationRequest({
                    identifier,
                    provider: {
                        apiKey: provider.apiKey,
                        from: provider.from,
                    },
                    url,
                });
            },
        }),
    ],
});
