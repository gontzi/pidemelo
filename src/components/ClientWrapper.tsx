'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isWidget = pathname.startsWith('/widget');

    if (isWidget) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <div className="pt-4">
                {children}
            </div>
        </>
    );
}
