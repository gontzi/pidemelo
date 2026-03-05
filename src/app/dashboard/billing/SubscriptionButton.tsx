'use client'

import { useFormStatus } from 'react-dom'
import { checkoutAction } from './actions'
import { Loader2, ArrowRight } from 'lucide-react'

interface SubscriptionButtonProps {
    productId: string
    label: string
    variant?: 'primary' | 'outline'
}

function SubmitButton({ label, variant }: { label: string, variant: 'primary' | 'outline' }) {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className={`
        w-full h-14 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2
        ${variant === 'primary'
                    ? 'bg-[#FF5C00] text-white hover:bg-[#E65300] shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-white border-2 border-zinc-100 text-zinc-900 hover:border-zinc-200 hover:bg-zinc-50'}
        disabled:opacity-70 disabled:cursor-not-allowed
      `}
        >
            {pending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <>
                    {label}
                    <ArrowRight className="w-4 h-4" />
                </>
            )}
        </button>
    )
}

export function SubscriptionButton({ productId, label, variant = 'primary' }: SubscriptionButtonProps) {
    return (
        <form action={checkoutAction} className="w-full">
            <input type="hidden" name="productId" value={productId} />
            <SubmitButton label={label} variant={variant} />
        </form>
    )
}
