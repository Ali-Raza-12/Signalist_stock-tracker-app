import Header from '@/components/Header'
import { getAuth } from '@/lib/betterAuth/auth'
import { redirect } from 'next/navigation';
import React from 'react'
import { headers } from 'next/headers';

const layout = async ({ children }: { children: React.ReactNode }) => {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) redirect('/sign-in')

    const user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
    }
    return (
        <main className='min-h-screen text-gray-400'>
            <Header user={user} />
            <div className='container py-10'>
                {children}
            </div>
        </main>
    )
}

export default layout;
