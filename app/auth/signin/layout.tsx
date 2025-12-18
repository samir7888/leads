import getSession from '@/lib/getSession';
import { redirect } from 'next/navigation';

type Props = {
    children?: React.ReactNode;
}

export default async function SignInLayout({ children }: Props) {
    // const session = await getSession();

    // if (session) redirect('/');

    return (
        <section className='min-h-screen flex flex-col items-center justify-center'>
            {children}
        </section>
    )
}