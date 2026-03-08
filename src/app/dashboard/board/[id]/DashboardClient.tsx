'use client';

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { updateIdeaStatus, deleteIdea } from './actions';
import { Trash2, GripVertical, AlertTriangle } from 'lucide-react';
import { useTransition, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ImageLightbox from '@/components/ImageLightbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type Idea = {
    id: string;
    title: string;
    description: string;
    imageUrl?: string | null;
    status: 'pending' | 'planned' | 'done';
    votesCount: number;
    tag: { id: string; name: string; color: string; } | null;
};

export default function DashboardClient({ initialIdeas, boardId, dict }: { initialIdeas: Idea[], boardId: string, dict: Record<string, string> }) {
    const columnsConfig = [
        { id: 'pending', title: dict.col_pending, color: 'bg-zinc-100/50 border-zinc-200/50' },
        { id: 'planned', title: dict.col_planned, color: 'bg-orange-50/50 border-orange-100/40' },
        { id: 'done', title: dict.col_done, color: 'bg-green-50/50 border-green-100/40' }
    ] as const;

    const [isPending, startTransition] = useTransition();
    const [ideas, setIdeas] = useState(initialIdeas);
    const [ideaToDelete, setIdeaToDelete] = useState<string | null>(null);

    useEffect(() => {
        setIdeas(initialIdeas);
    }, [initialIdeas]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const sourceStatus = result.source.droppableId as Idea['status'];
        const destinationStatus = result.destination.droppableId as Idea['status'];
        const ideaId = result.draggableId;

        if (sourceStatus === destinationStatus) return;

        setIdeas(prev => prev.map(idea =>
            idea.id === ideaId ? { ...idea, status: destinationStatus } : idea
        ));

        startTransition(async () => {
            await updateIdeaStatus(ideaId, destinationStatus, boardId);
        });
    };

    const handleDelete = (ideaId: string) => {
        setIdeaToDelete(ideaId);
    };

    const confirmDelete = () => {
        if (!ideaToDelete) return;
        setIdeas(prev => prev.filter(idea => idea.id !== ideaToDelete));
        startTransition(async () => {
            await deleteIdea(ideaToDelete, boardId);
        });
        setIdeaToDelete(null);
    };

    return (
        <>
            <Dialog open={!!ideaToDelete} onOpenChange={(open) => !open && setIdeaToDelete(null)}>
                <DialogContent className="w-[90vw] sm:max-w-sm rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border-none shadow-2xl">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-red-100 rounded-full flex items-center justify-center mb-2">
                            <AlertTriangle className="w-8 h-8 md:w-10 md:h-10 text-red-600" />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 leading-tight">
                                {dict.delete_idea_title}
                            </DialogTitle>
                            <DialogDescription className="text-zinc-500 font-semibold leading-relaxed pt-2 text-xs md:text-sm">
                                {dict.delete_idea_desc}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col w-full gap-3 pt-4 md:pt-6">
                            <Button
                                onClick={confirmDelete}
                                disabled={isPending}
                                className="w-full h-14 md:h-16 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-base md:text-lg shadow-xl shadow-red-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {isPending ? dict.deleting : dict.yes_delete_idea}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setIdeaToDelete(null)}
                                disabled={isPending}
                                className="w-full h-12 md:h-14 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-black text-sm md:text-base"
                            >
                                {dict.cancel}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-full p-4 md:p-6 overflow-x-auto">
                    {columnsConfig.map(col => (
                        <div key={col.id} className={`flex flex-col rounded-[2rem] md:rounded-[2.5rem] border p-5 md:p-8 min-h-0 h-full ${col.color}`}>
                            <div className="flex items-center justify-between mb-6 md:mb-8 px-1 md:px-2">
                                <h3 className="text-[10px] font-black tracking-widest text-zinc-900 uppercase opacity-60">{col.title}</h3>
                                <span className="bg-white/80 backdrop-blur-sm border border-zinc-200/50 text-zinc-900 font-black text-[10px] px-3 py-1 rounded-full shadow-sm">
                                    {ideas.filter(i => i.status === col.id).length}
                                </span>
                            </div>

                            <Droppable droppableId={col.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex-1 overflow-y-auto pr-2 transition-all rounded-[1.5rem] p-1 
                                            ${snapshot.isDraggingOver ? 'bg-white/40' : ''} 
                                            [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-300/60 
                                            [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-zinc-400/80`}
                                    >
                                        <div className="space-y-4 md:space-y-6">
                                            {ideas.filter(i => i.status === col.id).map((idea, index) => (
                                                <Draggable key={idea.id} draggableId={idea.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className={`flex-shrink-0 p-5 md:p-6 lg:p-8 bg-white border rounded-[1.8rem] md:rounded-[2rem] group transition-all duration-300
                                                                ${snapshot.isDragging
                                                                    ? 'shadow-2xl shadow-orange-500/20 border-[#FF5C00] scale-[1.05] rotate-2'
                                                                    : 'border-zinc-200/60 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 hover:border-[#FF5C00]/20'}`}
                                                            style={provided.draggableProps.style}
                                                        >
                                                            <div className="flex justify-between items-start gap-3 mb-3 md:mb-4">
                                                                <div
                                                                    {...provided.dragHandleProps}
                                                                    className="cursor-grab active:cursor-grabbing p-1.5 md:p-2 -ml-2 -mt-1 md:-ml-3 md:-mt-2 text-zinc-200 hover:text-[#FF5C00] transition-colors rounded-xl flex-shrink-0"
                                                                >
                                                                    <GripVertical className="w-4 h-4 md:w-5 md:h-5" />
                                                                </div>
                                                                <h4 className="font-black text-lg md:text-xl text-zinc-900 leading-tight flex-1 tracking-tighter">{idea.title}</h4>
                                                                <button
                                                                    onClick={(e) => { e.preventDefault(); handleDelete(idea.id); }}
                                                                    className="text-zinc-300 md:text-zinc-200 hover:text-white hover:bg-red-500 p-2 rounded-xl transition-all shrink-0 -mt-1 -mr-1 md:-mt-2 md:-mr-3 md:opacity-0 md:group-hover:opacity-100 active:scale-95"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>

                                                            <p className="text-xs md:text-sm text-zinc-500 line-clamp-2 mb-4 leading-relaxed font-bold tracking-tight">{idea.description}</p>

                                                            {idea.imageUrl && (
                                                                <ImageLightbox
                                                                    src={idea.imageUrl}
                                                                    alt={idea.title}
                                                                    className="mb-5 rounded-2xl border border-zinc-100 shadow-sm"
                                                                />
                                                            )}

                                                            <div className="flex items-center justify-between">
                                                                <span className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#FF5C00] bg-orange-50 border border-orange-100 px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-sm flex-shrink-0">
                                                                    <span className="text-xs md:text-sm">▲</span> {idea.votesCount} {idea.votesCount === 1 ? dict.vote : dict.votes}
                                                                </span>
                                                                {idea.tag && (
                                                                    <span
                                                                        className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-zinc-100 px-3 py-1.5 md:py-2 rounded-full shadow-sm max-w-[120px] truncate"
                                                                    >
                                                                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: idea.tag.color }} />
                                                                        <span className="truncate">{idea.tag.name}</span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </>
    );
}
