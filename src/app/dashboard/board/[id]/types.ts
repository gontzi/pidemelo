import type { IdeaStatus } from '@/lib/idea-status';

export type InboxIdea = {
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    status: IdeaStatus;
    votesCount: number;
    tag: { id: string; name: string; color: string } | null;
    adminResponse: string | null;
    createdAt: string;
};
