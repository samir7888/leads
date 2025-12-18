import React, { Suspense } from 'react'

type Props = {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: Props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  )
}