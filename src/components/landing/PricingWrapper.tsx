import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import nextDynamic from 'next/dynamic';

const DynamicPricingSwitcher = nextDynamic(
    () => import('@/app/dashboard/billing/PricingSwitcher'),
    { ssr: false }
);

export default async function PricingWrapper({ t }: { t: any }) {
    const { userId } = auth();

    const userData = userId ? await db.query.users.findFirst({
        where: eq(users.id, userId)
    }) : null;

    const isPremium = userData?.isPremium || false;
    const userPlan = userData?.plan;

    return (
        <DynamicPricingSwitcher
            monthlyProductId={process.env.NEXT_PUBLIC_POLAR_SUBSCRIPTION_PRODUCT_ID || ''}
            lifetimeProductId={process.env.NEXT_PUBLIC_POLAR_LIFETIME_PRODUCT_ID || ''}
            dict={t.pricing_switcher}
            currentPlan={userPlan}
            isPremium={isPremium}
        />
    );
}
