import { SignUp } from '@clerk/nextjs';
import { clerkAppearance } from '@/lib/clerk-appearance';

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-brand-wash">
      <SignUp appearance={clerkAppearance} />
    </main>
  );
}
