'use client';

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { updateIdeaStatus, deleteIdea } from './actions';
import { Trash2, GripVertical, AlertTriangle } from 'lucide-react';
import { useTransition, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
    status: 'pending' | 'planned' | 'done';
    votesCount: number;
};

const columnsConfig = [
    { id: 'pending', title: '🤔 Pendiente', color: 'bg-zinc-100/50 border-zinc-200/50' },
    { id: 'planned', title: '🏗️ Planeado', color: 'bg-orange-50/50 border-orange-100/40' },
    { id: 'done', title: '✅ Completado', color: 'bg-green-50/50 border-green-100/40' }
] as const;

export default function DashboardClient({ initialIdeas, boardId }: { initialIdeas: Idea[], boardId: string }) {
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
                <DialogContent className="sm:max-w-sm rounded-[2.5rem] p-8 border-none shadow-2xl">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-2">
                            <AlertTriangle className="w-10 h-10 text-red-600" />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tight text-zinc-900 leading-tight">
                                ¿Borrar esta petición?
                            </DialogTitle>
                            <DialogDescription className="text-zinc-500 font-semibold leading-relaxed pt-2">
                                Esta acción no se puede deshacer y los votos acumulados se perderán para siempre.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col w-full gap-3 pt-6">
                            <Button
                                onClick={confirmDelete}
                                disabled={isPending}
                                className="w-full h-16 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-lg shadow-xl shadow-red-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {isPending ? 'Borrando...' : 'Sí, borrar 🗑️'}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setIdeaToDelete(null)}
                                disabled={isPending}
                                className="w-full h-14 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-black"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
                    {columnsConfig.map(col => (
                        <div key={col.id} className={`flex flex-col h-full rounded-[2.5rem] border p-8 ${col.color}`}>
                            <div className="flex items-center justify-between mb-8 px-2">
                                <h3 className="text-xl font-black tracking-tighter text-zinc-900 uppercase tracking-widest text-[10px] opacity-60">{col.title}</h3>
                                <span className="bg-white/80 backdrop-blur-sm border border-zinc-200/50 text-zinc-900 font-black text-[10px] px-3 py-1 rounded-full shadow-sm">
                                    {ideas.filter(i => i.status === col.id).length}
                                </span>
                            </div>

                            <Droppable droppableId={col.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex-1 transition-all rounded-[1.5rem] p-1 ${snapshot.isDraggingOver ? 'bg-white/40' : ''}`}
                                    >
                                        <div className="space-y-6">
                                            {ideas.filter(i => i.status === col.id).map((idea, index) => (
                                                <Draggable key={idea.id} draggableId={idea.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className={`p-8 bg-white border rounded-[2rem] group transition-all duration-300
                                                                ${snapshot.isDragging
                                                                    ? 'shadow-2xl shadow-orange-500/20 border-[#FF5C00] scale-[1.05] rotate-2'
                                                                    : 'border-zinc-200/60 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 hover:border-[#FF5C00]/20'}`}
                                                            style={provided.draggableProps.style}
                                                        >
                                                            <div className="flex justify-between items-start gap-3 mb-4">
                                                                <div
                                                                    {...provided.dragHandleProps}
                                                                    className="cursor-grab active:cursor-grabbing p-2 -ml-3 -mt-2 text-zinc-200 hover:text-[#FF5C00] transition-colors rounded-xl"
                                                                >
                                                                    <GripVertical className="w-5 h-5" />
                                                                </div>
                                                                <h4 className="font-black text-xl text-zinc-900 leading-tight flex-1 tracking-tighter">{idea.title}</h4>
                                                                <button
                                                                    onClick={(e) => { e.preventDefault(); handleDelete(idea.id); }}
                                                                    className="text-zinc-200 hover:text-white hover:bg-red-500 p-2 rounded-xl transition-all shrink-0 -mt-2 -mr-3 opacity-0 group-hover:opacity-100 active:scale-95"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>

                                                            <p className="text-sm text-zinc-500 line-clamp-2 mb-6 leading-relaxed font-bold tracking-tight">{idea.description}</p>

                                                            <div className="flex items-center justify-between">
                                                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#FF5C00] bg-orange-50 border border-orange-100 px-4 py-2 rounded-full shadow-sm">
                                                                    <span className="text-sm">▲</span> {idea.votesCount} {idea.votesCount === 1 ? 'VOTO' : 'VOTOS'}
                                                                </span>
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
