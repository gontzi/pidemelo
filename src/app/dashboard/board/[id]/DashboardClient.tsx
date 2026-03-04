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
    { id: 'pending', title: '🤔 Pendiente', color: 'bg-zinc-100 border-zinc-200' },
    { id: 'planned', title: '🏗️ Planeado', color: 'bg-orange-50/50 border-orange-100' },
    { id: 'done', title: '✅ Completado', color: 'bg-green-50/50 border-green-100' }
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full pb-10">
                    {columnsConfig.map(col => (
                        <div key={col.id} className={`flex flex-col h-full rounded-[2rem] border p-5 bg-white ${col.color}`}>
                            <div className="flex items-center justify-between mb-5 px-1 tracking-tight">
                                <h3 className="font-heading font-extrabold text-lg text-zinc-900">{col.title}</h3>
                                <span className="bg-white border border-zinc-200 text-zinc-600 font-bold text-xs px-2.5 py-1 rounded-full shadow-sm">
                                    {ideas.filter(i => i.status === col.id).length}
                                </span>
                            </div>

                            <Droppable droppableId={col.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex-1 transition-colors rounded-2xl min-h-[200px] ${snapshot.isDraggingOver ? 'bg-zinc-50/80 ring-2 ring-zinc-200 ring-inset' : ''}`}
                                    >
                                        <div className="space-y-4">
                                            {ideas.filter(i => i.status === col.id).map((idea, index) => (
                                                <Draggable key={idea.id} draggableId={idea.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className={`p-5 bg-white border rounded-2xl group transition-all
                              ${snapshot.isDragging ? 'shadow-xl shadow-zinc-200 border-[#FF5C00] scale-[1.02] rotate-1' : 'border-zinc-200 hover:border-zinc-300 hover:shadow-md'}`}
                                                            style={provided.draggableProps.style}
                                                        >
                                                            <div className="flex justify-between items-start gap-2 mb-3">
                                                                <div
                                                                    {...provided.dragHandleProps}
                                                                    className="cursor-grab active:cursor-grabbing p-1.5 -ml-2 -mt-1 text-zinc-300 hover:text-zinc-500 rounded-lg hover:bg-zinc-50"
                                                                >
                                                                    <GripVertical className="w-4 h-4" />
                                                                </div>
                                                                <h4 className="font-bold text-zinc-900 leading-tight flex-1 tracking-tight">{idea.title}</h4>
                                                                <button
                                                                    onClick={(e) => { e.preventDefault(); handleDelete(idea.id); }}
                                                                    className="text-zinc-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors shrink-0 -mt-1 -mr-2 opacity-0 group-hover:opacity-100"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>

                                                            <p className="text-sm text-zinc-500 line-clamp-3 mb-4 leading-relaxed font-medium">{idea.description}</p>

                                                            <div className="flex items-center">
                                                                <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 bg-[#FAFAFA] border border-zinc-200 px-3 py-1.5 rounded-full shadow-sm">
                                                                    <span className="text-[#FF5C00]">▲</span> {idea.votesCount} {idea.votesCount === 1 ? 'voto' : 'votos'}
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
