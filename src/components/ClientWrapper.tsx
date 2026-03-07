'use client';

import { usePathname } from 'next/navigation';

interface ClientWrapperProps {
    children: React.ReactNode;
    navbar: React.ReactNode;
}

export default function ClientWrapper({ children, navbar }: ClientWrapperProps) {
    const pathname = usePathname();
    const isWidget = pathname.startsWith('/widget');

    if (isWidget) {
        return <>{children}</>;
    }

    const isLanding = pathname === '/';

    return (
        <>
            {isLanding && navbar}
            <div>
                {children}
            </div>
        </>
    );
}
