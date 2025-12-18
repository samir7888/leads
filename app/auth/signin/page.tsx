import SignInForm from '@/components/auth/signIn-form'
import getSession from '@/lib/getSession';
import { Metadata } from 'next'
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: "Sign In",
    description: "Sign in to your account",
}

export default async function SignInPage() {
    const session = await getSession();

    if (session) redirect('/admin/leads');

    return (
        <SignInForm />
    )
}