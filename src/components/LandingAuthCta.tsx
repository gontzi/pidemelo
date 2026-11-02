'use client';

import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type LandingAuthCtaProps = {
  signInLabel: string;
  dashboardLabel: string;
};

export default function LandingAuthCta({ signInLabel, dashboardLabel }: LandingAuthCtaProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const href = isLoaded && isSignedIn ? '/dashboard' : '/sign-in';
  const label = isLoaded && isSignedIn ? dashboardLabel : signInLabel;

  return (
    <Link href={href} className="w-full sm:w-auto">
      <Button size="xl" className="w-full group">
        {label}
        <ArrowRight className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </Button>
    </Link>
  );
}
