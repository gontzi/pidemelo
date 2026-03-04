'use client';

import { useState } from 'react';
import { upvoteIdea } from './actions';
import { Search } from 'lucide-react';

type Idea = {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'planned' | 'done';
    votes: { id: string }[];
};

export default function PublicBoardClient({ initialIdeas, boardSlug }: { initialIdeas: Idea[], boardSlug: string }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'planned' | 'done'>('all');

    const filteredIdeas = initialIdeas.filter(idea => {
        const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            idea.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || idea.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="font-[family-name:var(--font-jakarta)] text-2xl font-bold tracking-tight text-zinc-900">Mostradas 🔥</h2>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Buscar peticiones..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-11 pl-9 pr-4 rounded-2xl border border-zinc-200 bg-[#FAFAFA] focus-visible:bg-white text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/20 focus:border-[#FF5C00] transition-colors w-full sm:w-64 shadow-sm"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'planned' | 'done')}
                        className="h-11 px-4 rounded-2xl border border-zinc-200 bg-[#FAFAFA] text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/20 focus:border-[#FF5C00] transition-colors cursor-pointer shadow-sm"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="pending">🤔 Pendiente</option>
                        <option value="planned">🏗️ Planeado</option>
                        <option value="done">✅ Hecho</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                {filteredIdeas.map((idea) => (
                    <div key={idea.id} className="group flex gap-5 p-6 bg-white border border-zinc-200 rounded-3xl hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50 transition-all">
                        <form action={upvoteIdea.bind(null, idea.id, boardSlug)} className="shrink-0">
                            <button
                                type="submit"
                                className="flex flex-col items-center justify-center w-16 h-20 border border-zinc-200 bg-[#FAFAFA] rounded-2xl hover:bg-[#FF5C00]/10 hover:border-[#FF5C00] hover:text-[#FF5C00] transition-colors active:scale-95 group/btn shadow-sm"
                            >
                                <span className="text-zinc-400 font-black mb-1 text-sm group-hover/btn:text-[#FF5C00]">▲</span>
                                <span className="text-zinc-900 font-extrabold text-xl leading-none group-hover/btn:text-[#FF5C00]">{idea.votes.length}</span>
                            </button>
                        </form>

                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-[family-name:var(--font-jakarta)] text-xl font-bold tracking-tight text-zinc-900 truncate">
                                    {idea.title}
                                </h3>
                                {idea.status !== 'pending' && (
                                    <span className={`px-3 py-1 rounded-full text-[11px] uppercase font-bold tracking-wider 
                                        ${idea.status === 'done' ? 'bg-green-100 text-green-700 border border-green-200' :
                                            idea.status === 'planned' ? 'bg-amber-100 text-amber-700 border border-amber-200' : ''}`}>
                                        {idea.status === 'done' ? '✅ Hecho' : '🏗️ Planeado'}
                                    </span>
                                )}
                            </div>
                            <p className="text-zinc-600 font-medium leading-relaxed whitespace-pre-wrap line-clamp-3">
                                {idea.description}
                            </p>
                        </div>
                    </div>
                ))}

                {filteredIdeas.length === 0 && (
                    <div className="p-16 text-center bg-white border-2 border-zinc-200 rounded-3xl border-dashed">
                        <span className="text-4xl block mb-4">👀</span>
                        <p className="text-zinc-500 font-bold text-lg">No hemos encontrado nada.</p>
                        <p className="text-zinc-400 font-medium mt-1">Prueba con otros filtros o sé el primero en proponerlo.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
