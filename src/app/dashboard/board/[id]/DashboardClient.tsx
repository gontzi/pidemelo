'use client';

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { updateIdeaStatus, deleteIdea } from './actions';
import { Trash2, GripVertical, AlertTriangle, X } from 'lucide-react';
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
    const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

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

            <Dialog open={!!selectedIdea} onOpenChange={(open) => !open && setSelectedIdea(null)}>
                <DialogContent className="w-[95vw] sm:max-w-2xl rounded-[2.5rem] md:rounded-[3.5rem] p-0 border-none shadow-2xl overflow-hidden bg-white z-[100] [&>button]:hidden duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:slide-in-from-top-[48%] data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=closed]:slide-out-to-left-1/2">
                    <div className="flex flex-col h-full max-h-[90vh]">
                        {/* Header Image if exists */}
                        {selectedIdea?.imageUrl && (
                            <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden group">
                                <ImageLightbox
                                    src={selectedIdea.imageUrl}
                                    alt={selectedIdea.title}
                                    className="w-full h-full"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
                            </div>
                        )}

                        <div className="sr-only">
                            <DialogTitle>{selectedIdea?.title}</DialogTitle>
                            <DialogDescription>{selectedIdea?.description}</DialogDescription>
                        </div>

                        <div className="relative px-6 md:px-12 py-8 md:py-12 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-300/60 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-zinc-400/80">

                            <div className="space-y-6 md:space-y-8">
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#FF5C00] bg-orange-50 border border-orange-100/50 px-4 py-2 rounded-full shadow-sm">
                                            <span className="text-sm md:text-base">▲</span> {selectedIdea?.votesCount} {selectedIdea?.votesCount === 1 ? dict.vote : dict.votes}
                                        </span>
                                        {selectedIdea?.tag && (
                                            <span
                                                className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] border border-zinc-100 bg-zinc-50/50 px-4 py-2 rounded-full shadow-sm"
                                            >
                                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedIdea.tag.color }} />
                                                {selectedIdea.tag.name}
                                            </span>
                                        )}
                                        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-zinc-400 border border-zinc-100 px-4 py-2 rounded-full">
                                            {selectedIdea?.status === 'pending' ? dict.col_pending : selectedIdea?.status === 'planned' ? dict.col_planned : dict.col_done}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-zinc-900 leading-[0.9] pt-2">
                                        {selectedIdea?.title}
                                    </h2>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                                        <span className="w-8 h-px bg-zinc-200" /> {dict.idea_description}
                                    </p>
                                    <div className="text-base md:text-xl text-zinc-600 font-medium leading-relaxed whitespace-pre-wrap tracking-tight">
                                        {selectedIdea?.description}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 md:p-10 bg-zinc-50/50 border-t border-zinc-100 flex justify-end shrink-0">
                            <Button
                                onClick={() => setSelectedIdea(null)}
                                className="h-12 md:h-14 px-8 md:px-12 rounded-full bg-zinc-900 hover:bg-black text-white font-black text-xs md:text-sm tracking-widest uppercase shadow-xl shadow-zinc-900/10 transition-all active:scale-95"
                            >
                                {dict.close}
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
                                                            onClick={() => setSelectedIdea(idea)}
                                                            className={`flex-shrink-0 p-5 md:p-6 lg:p-8 bg-white border rounded-[1.8rem] md:rounded-[2rem] group transition-all duration-300 cursor-pointer
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
                                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(idea.id); }}
                                                                    className="text-zinc-300 md:text-zinc-200 hover:text-white hover:bg-red-500 p-2 rounded-xl transition-all shrink-0 -mt-1 -mr-1 md:-mt-2 md:-mr-3 md:opacity-0 md:group-hover:opacity-100 active:scale-95"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>

                                                            <p className="text-xs md:text-sm text-zinc-500 line-clamp-2 mb-4 leading-relaxed font-bold tracking-tight">{idea.description}</p>

                                                            {idea.imageUrl && (
                                                                <div className="pointer-events-none">
                                                                    <ImageLightbox
                                                                        src={idea.imageUrl}
                                                                        alt={idea.title}
                                                                        className="mb-5 rounded-2xl border border-zinc-100 shadow-sm"
                                                                    />
                                                                </div>
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
