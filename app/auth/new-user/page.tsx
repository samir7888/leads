import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation';
import { SITE_TITLE } from '@/lib/CONSTANTS';

export default async function NewUserPage() {
    const session = await getSession();

    if (!session) {
        redirect('/api/auth/signin');
    }

    if (session.user.profileCompleted === true) {
        redirect('/profile');
    }

    return (
        <section className='flex flex-col items-center justify-center min-h-screen'>
            <h1 className="text-2xl font-bold mb-4">New User</h1>
            <p>Welcome to the {SITE_TITLE} CMS.</p>

            <p>Please complete your profile to continue.</p>

            <div className='h-10' />
        </section>
    )
}