'use client';

import { useFormStatus } from 'react-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CreateBoardSubmit({ label, pendingLabel }: { label: string; pendingLabel: string }) {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending} className="shrink-0">
            <Plus aria-hidden="true" />
            {pending ? pendingLabel : label}
        </Button>
    );
}
