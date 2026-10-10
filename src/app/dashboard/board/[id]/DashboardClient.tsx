'use client';

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { updateIdeaStatus, deleteIdea } from './actions';
import { Trash2, GripVertical, AlertTriangle, ChevronUp, Archive, Reply } from 'lucide-react';
import { useTransition, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import ImageLightbox from '@/components/ImageLightbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSeparator,
} from "@/components/ui/context-menu";

type Idea = {
    id: string;
    title: string;
    description: string;
    imageUrl?: string | null;
    status: 'en_revision' | 'planeado' | 'en_progreso' | 'completado' | 'descartado' | 'archivado';
    votesCount: number;
    tag: { id: string; name: string; color: string; } | null;
};

export default function DashboardClient({ initialIdeas, boardId, dict }: { initialIdeas: Idea[], boardId: string, dict: Record<string, string> }) {
    const columnsConfig = [
        { id: 'en_revision', title: dict.col_pending, color: 'bg-zinc-100/50 border-zinc-200/50' },
        { id: 'planeado', title: dict.col_planned, color: 'bg-orange-50/50 border-orange-100/40' },
        { id: 'en_progreso', title: dict.col_in_progress || '⚙️ EN PROGRESO', color: 'bg-blue-50/50 border-blue-100/40' },
        { id: 'completado', title: dict.col_done, color: 'bg-green-50/50 border-green-100/40' }
    ] as const;

    const [isPending, startTransition] = useTransition();
    const [ideas, setIdeas] = useState(initialIdeas);
    const [ideaToDelete, setIdeaToDelete] = useState<string | null>(null);
    const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
    const [viewTab, setViewTab] = useState<'activas' | 'descartadas' | 'archivadas'>('activas');

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

        startTransition(() => {
            updateIdeaStatus(ideaId, destinationStatus, boardId);
        });
    };

    const handleDelete = (ideaId: string) => {
        setIdeaToDelete(ideaId);
    };

    const confirmDelete = () => {
        if (!ideaToDelete) return;
        setIdeas(prev => prev.filter(idea => idea.id !== ideaToDelete));
        startTransition(() => {
            deleteIdea(ideaToDelete, boardId);
        });
        setIdeaToDelete(null);
    };

    const updateStatus = (id: string, newStatus: Idea['status'], e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setIdeas(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
        startTransition(() => { updateIdeaStatus(id, newStatus, boardId); });
    };

    const MobileIdeaCard = ({ idea }: { idea: Idea }) => (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div
                    onClick={() => setSelectedIdea(idea)}
                    className="bg-white border border-zinc-200/60 p-5 rounded-[2rem] shadow-sm active:scale-[0.98] transition-all flex items-center justify-between gap-4 relative overflow-hidden"
                >
                    <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                            {idea.tag && (
                                <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest border border-zinc-100 px-2 py-0.5 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: idea.tag.color }} />
                                    {idea.tag.name}
                                </span>
                            )}
                        </div>
                        <h4 className="font-black text-lg text-zinc-900 leading-tight tracking-tight uppercase break-words [word-break:break-word] whitespace-normal line-clamp-2">{idea.title}</h4>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center justify-center bg-zinc-50 border border-zinc-100 rounded-2xl p-2 min-w-[50px] h-12">
                            <ChevronUp className="w-3 h-3 text-[#FF5C00]" />
                            <span className="text-xs font-black text-[#FF5C00]">{idea.votesCount}</span>
                        </div>
                    </div>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64 rounded-2xl p-2 shadow-2xl border-none bg-white/95 backdrop-blur-xl">
                <div className="px-4 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">{dict.move_to}</div>
                {['en_revision', 'planeado', 'en_progreso', 'completado'].map((st) => (
                    idea.status !== st && (
                        <ContextMenuItem key={st} onClick={(e) => updateStatus(idea.id, st as Idea['status'], e)} className="rounded-xl py-3 px-4 font-bold text-zinc-700 focus:bg-orange-50 focus:text-[#FF5C00] active:scale-95 transition-transform">
                            {st === 'en_revision' ? dict.col_pending?.toUpperCase() : st === 'planeado' ? dict.col_planned?.toUpperCase() : st === 'en_progreso' ? dict.col_in_progress?.toUpperCase() : dict.col_done?.toUpperCase()}
                        </ContextMenuItem>
                    )
                ))}

                {idea.status !== 'descartado' && (
                    <ContextMenuItem onClick={(e) => updateStatus(idea.id, 'descartado', e)} className="rounded-xl py-3 px-4 font-bold text-zinc-700 focus:bg-orange-50 focus:text-[#FF5C00] active:scale-95 transition-transform">
                        ❌ {dict.status_discard}
                    </ContextMenuItem>
                )}
                {idea.status !== 'archivado' && (
                    <ContextMenuItem onClick={(e) => updateStatus(idea.id, 'archivado', e)} className="rounded-xl py-3 px-4 font-bold text-purple-600 focus:bg-purple-50 active:scale-95 transition-transform">
                        🗃️ {dict.status_archive}
                    </ContextMenuItem>
                )}
                <ContextMenuSeparator className="bg-zinc-100 my-1" />
                <ContextMenuItem onClick={(e) => { e.stopPropagation(); handleDelete(idea.id); }} className="rounded-xl py-3 px-4 font-bold text-red-500 focus:bg-red-50 focus:text-red-600">
                    <Trash2 className="w-4 h-4 mr-3 opacity-60" /> {dict.cancel}
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );

    return (
        <div className="h-full flex flex-col">
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
                <DialogContent className="w-[92vw] sm:max-w-2xl rounded-[2.5rem] md:rounded-[3.5rem] p-0 border-none shadow-2xl overflow-hidden bg-white z-[100] [&>button]:hidden duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95">
                    <div className="flex flex-col h-full max-h-[90vh]">
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

                        <div className="relative px-5 md:px-12 py-6 md:py-12 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-300/60 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-zinc-400/80">
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
                                            {selectedIdea?.status?.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl md:text-5xl font-black tracking-tighter text-zinc-900 leading-normal pt-2 [word-break:break-word] [hyphens:auto]">
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

                                <div className="space-y-3 pt-6 border-t border-zinc-100">
                                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                                        <span className="w-8 h-px bg-zinc-200" /> {dict.actions_title || 'Acciones de Estado'}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Button size="sm" variant="outline" onClick={() => updateStatus(selectedIdea!.id, 'en_revision')} className="rounded-full font-bold text-xs uppercase tracking-widest">{dict.status_revision || 'Revisión'}</Button>
                                        <Button size="sm" variant="outline" onClick={() => updateStatus(selectedIdea!.id, 'planeado')} className="rounded-full font-bold text-xs uppercase tracking-widest">{dict.status_planned || 'Planeado'}</Button>
                                        <Button size="sm" variant="outline" onClick={() => updateStatus(selectedIdea!.id, 'en_progreso')} className="rounded-full font-bold text-xs uppercase tracking-widest">{dict.status_progress || 'Progreso'}</Button>
                                        <Button size="sm" variant="outline" onClick={() => updateStatus(selectedIdea!.id, 'completado')} className="rounded-full font-bold text-xs uppercase tracking-widest">{dict.status_done || 'Completado'}</Button>
                                        <Button size="sm" variant="outline" onClick={() => updateStatus(selectedIdea!.id, 'descartado')} className="rounded-full font-bold text-xs text-red-500 border-red-200 hover:bg-red-50 uppercase tracking-widest">{dict.status_discard || 'Descartar'}</Button>
                                        <Button size="sm" variant="outline" onClick={() => updateStatus(selectedIdea!.id, 'archivado')} className="rounded-full font-bold text-xs text-purple-600 border-purple-200 hover:bg-purple-50 uppercase tracking-widest">{dict.status_archive || 'Archivar'}</Button>
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

            {/* Premium Pill Tabs UI */}
            <div className="px-6 md:px-10 mt-8 mb-6">
                <div className="bg-zinc-100 p-1.5 rounded-3xl inline-flex gap-1 shadow-inner border border-zinc-200/50">
                    <button
                        onClick={() => setViewTab('activas')}
                        className={cn(
                            "px-6 md:px-8 py-3 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2",
                            viewTab === 'activas'
                                ? "bg-white text-zinc-950 shadow-sm border border-zinc-200/50"
                                : "text-zinc-400 hover:text-zinc-600"
                        )}
                    >
                        {dict.tab_active}
                    </button>
                    <button
                        onClick={() => setViewTab('descartadas')}
                        className={cn(
                            "px-6 md:px-8 py-3 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2",
                            viewTab === 'descartadas'
                                ? "bg-white text-zinc-950 shadow-sm border border-zinc-200/50"
                                : "text-zinc-400 hover:text-zinc-600"
                        )}
                    >
                        {dict.tab_discarded}
                    </button>
                    <button
                        onClick={() => setViewTab('archivadas')}
                        className={cn(
                            "px-6 md:px-8 py-3 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2",
                            viewTab === 'archivadas'
                                ? "bg-white text-zinc-950 shadow-sm border border-zinc-200/50"
                                : "text-zinc-400 hover:text-zinc-600"
                        )}
                    >
                        {dict.tab_archived}
                    </button>
                </div>
            </div>

            {/* Mobile View with Vertical Drag & Drop */}
            <div className="lg:hidden flex-1 flex flex-col min-h-0 bg-[#F3F4F6] overflow-x-hidden w-full max-w-full">
                {viewTab === 'activas' && (
                    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl px-4 py-3 border-b border-zinc-200/50">
                        <div className="flex bg-zinc-100 p-0.5 rounded-xl h-12 hide-scrollbar overflow-x-auto gap-1">
                            {columnsConfig.map((col) => (
                                <button
                                    key={col.id}
                                    onClick={() => {
                                        document.getElementById(`mobile-col-${col.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }}
                                    className="flex-1 min-w-[80px] rounded-lg font-black text-[9px] uppercase tracking-tighter transition-all active:scale-95 flex items-center justify-center gap-1"
                                >
                                    <span className="truncate">{col.title.replace(/[🤔🏗️✅⚙️]/g, '').trim()}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-28 max-w-full">
                    {viewTab === 'activas' ? (
                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className="space-y-10">
                                {columnsConfig.map((col) => (
                                    <div key={col.id} id={`mobile-col-${col.id}`} className="space-y-4 scroll-mt-28">
                                        <div className="flex items-center justify-between px-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
                                                    {col.title}
                                                </h3>
                                            </div>
                                            <span className="bg-white px-2 py-0.5 rounded-full text-[9px] font-black border border-zinc-200 text-zinc-400">
                                                {ideas.filter(i => i.status === col.id).length}
                                            </span>
                                        </div>

                                        <Droppable droppableId={col.id}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.droppableProps}
                                                    className={cn(
                                                        "space-y-4 min-h-[100px] transition-all rounded-[2.5rem] p-1",
                                                        snapshot.isDraggingOver ? "bg-zinc-200/50 ring-2 ring-dashed ring-zinc-300 ring-offset-4" : ""
                                                    )}
                                                >
                                                    {ideas.filter(i => i.status === col.id).map((idea, index) => (
                                                        <Draggable key={idea.id} draggableId={idea.id} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className={cn(
                                                                        "transition-all",
                                                                        snapshot.isDragging ? "z-50" : ""
                                                                    )}
                                                                >
                                                                    <MobileIdeaCard idea={idea} />
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>
                                ))}
                            </div>
                        </DragDropContext>
                    ) : (
                        <div className="space-y-4">
                            {ideas.filter(i => i.status === (viewTab === 'descartadas' ? 'descartado' : 'archivado')).map(idea => (
                                <MobileIdeaCard key={idea.id} idea={idea} />
                            ))}
                            {ideas.filter(i => i.status === (viewTab === 'descartadas' ? 'descartado' : 'archivado')).length === 0 && (
                                <div className="py-24 flex flex-col items-center justify-center text-zinc-400 opacity-60">
                                    <span className="text-4xl mb-4">{viewTab === 'descartadas' ? '💨' : '🗃️'}</span>
                                    <p className="font-bold text-xs tracking-widest uppercase">{dict.empty_section || 'Nada en esta sección'}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop Kanban View */}
            <div className="hidden lg:block h-full">
                {viewTab === 'activas' ? (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="grid grid-cols-4 gap-6 h-[calc(100vh-200px)] p-6 overflow-x-auto">
                            {columnsConfig.map(col => (
                                <div key={col.id} className={`flex flex-col rounded-[2.5rem] border p-8 min-h-0 h-full ${col.color}`}>
                                    <div className="flex items-center justify-between mb-8 px-2">
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
                                                <div className="space-y-6">
                                                    {ideas.filter(i => i.status === col.id).map((idea, index) => (
                                                        <Draggable key={idea.id} draggableId={idea.id} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    onClick={() => setSelectedIdea(idea)}
                                                                    className={`flex-shrink-0 p-8 bg-white border rounded-[2rem] group transition-all duration-300 cursor-pointer
                                                                        ${snapshot.isDragging
                                                                            ? 'shadow-2xl shadow-orange-500/20 border-[#FF5C00] scale-[1.05] rotate-2'
                                                                            : 'border-zinc-200/60 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 hover:border-[#FF5C00]/20'}`}
                                                                    style={provided.draggableProps.style}
                                                                >
                                                                    <div className="flex justify-between items-start gap-4 mb-4">
                                                                        <div
                                                                            {...provided.dragHandleProps}
                                                                            className="cursor-grab active:cursor-grabbing p-2 -ml-3 -mt-2 text-zinc-200 hover:text-[#FF5C00] transition-colors rounded-xl flex-shrink-0"
                                                                        >
                                                                            <GripVertical className="w-5 h-5" />
                                                                        </div>
                                                                        <h4 className="font-black text-xl text-zinc-900 leading-tight flex-1 tracking-tighter uppercase">{idea.title}</h4>
                                                                        <button
                                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(idea.id); }}
                                                                            className="text-zinc-200 hover:text-white hover:bg-red-500 p-2 rounded-xl transition-all shrink-0 -mt-2 -mr-3 md:opacity-0 md:group-hover:opacity-100 active:scale-95"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    </div>

                                                                    <p className="text-sm text-zinc-500 line-clamp-2 mb-4 leading-relaxed font-bold tracking-tight">{idea.description}</p>

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
                                                                        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#FF5C00] bg-orange-50 border border-orange-100 px-4 py-2 rounded-full shadow-sm flex-shrink-0">
                                                                            <span className="text-sm">▲</span> {idea.votesCount} {idea.votesCount === 1 ? dict.vote : dict.votes}
                                                                        </span>
                                                                        {idea.tag && (
                                                                            <span
                                                                                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest border border-zinc-100 px-3 py-2 rounded-full shadow-sm max-w-[120px] truncate"
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
                ) : (
                    <div className="flex-1 overflow-y-auto px-12 py-8 bg-zinc-50/30">
                        <div className="max-w-5xl mx-auto space-y-4">
                            {ideas.filter(i => i.status === (viewTab === 'descartadas' ? 'descartado' : 'archivado')).map(idea => (
                                <div key={idea.id} className="bg-white border border-zinc-200/60 p-6 rounded-[2rem] shadow-sm flex items-center justify-between gap-6 group hover:border-[#FF5C00]/20 transition-all">
                                    <div className="flex items-center gap-6 flex-1 min-w-0">
                                        <div className="flex flex-col items-center justify-center bg-zinc-50 border border-zinc-100 rounded-2xl p-2 min-w-[50px] h-12 shrink-0">
                                            <ChevronUp className="w-3 h-3 text-zinc-400" />
                                            <span className="text-xs font-black text-zinc-400">{idea.votesCount}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 onClick={() => setSelectedIdea(idea)} className="font-black text-lg text-zinc-900 uppercase tracking-tighter cursor-pointer hover:underline truncate">{idea.title}</h4>
                                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1 italic flex items-center gap-2">
                                                <span className="w-4 h-px bg-zinc-200" />
                                                {viewTab === 'descartadas' ? (dict.discarded_desc || 'Fuera de prioridad') : (dict.archived_desc || 'En el archivo')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => updateStatus(idea.id, 'en_revision')}
                                            className="rounded-full font-black text-[10px] tracking-[0.2em] uppercase h-10 px-6 border-zinc-200 hover:bg-orange-50 hover:text-[#FF5C00] hover:border-[#FF5C00]/30 transition-all active:scale-95 flex items-center gap-2"
                                        >
                                            <Reply className="w-3 h-3" /> {dict.status_restore || 'Restaurar'}
                                        </Button>

                                        {viewTab === 'descartadas' && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => updateStatus(idea.id, 'archivado')}
                                                className="rounded-full font-black text-[10px] tracking-[0.2em] uppercase h-10 px-6 text-purple-600 hover:bg-purple-50 transition-all active:scale-95 flex items-center gap-2"
                                            >
                                                <Archive className="w-3 h-3" /> {dict.status_archive || 'Archivar'}
                                            </Button>
                                        )}

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(idea.id)}
                                            className="rounded-full text-zinc-300 hover:text-red-500 hover:bg-red-50 h-10 w-10 p-0 transition-all active:scale-95"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {ideas.filter(i => i.status === (viewTab === 'descartadas' ? 'descartado' : 'archivado')).length === 0 && (
                                <div className="py-32 flex flex-col items-center justify-center text-zinc-400 border-2 border-dashed border-zinc-200 rounded-[3rem] opacity-40">
                                    <span className="text-4xl mb-4">{viewTab === 'descartadas' ? '💨' : '🗃️'}</span>
                                    <p className="font-black text-xs tracking-widest uppercase">{dict.empty || 'Vacío'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
