'use client';

import { useState, useTransition } from 'react';
import { Settings, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { updateBoardSettings, deleteBoard } from './actions';

export default function SettingsModal({
    boardId,
    currentName,
    currentSlug,
    trigger
}: {
    boardId: string,
    currentName: string,
    currentSlug: string,
    trigger?: React.ReactNode
}) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleUpdate = async (formData: FormData) => {
        setError(null);
        const newName = formData.get('name') as string;
        const newSlug = formData.get('slug') as string;

        startTransition(async () => {
            const res = await updateBoardSettings(boardId, newName, newSlug);
            if (res?.error) {
                setError(res.error);
            } else {
                setIsSettingsOpen(false);
            }
        });
    };

    const handleDelete = () => {
        startTransition(async () => {
            const res = await deleteBoard(boardId);
            if (res.success) {
                setIsDeleteOpen(false);
                setIsSettingsOpen(false);
                router.push('/dashboard');
            }
        });
    };

    return (
        <>
            {/* Modal de Ajustes */}
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                    {trigger ? trigger : (
                        <button className="inline-flex items-center justify-center px-4 py-3 bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 rounded-full text-sm font-bold transition-all shadow-sm active:scale-95">
                            <Settings className="w-4 h-4 mr-2" /> Ajustes
                        </button>
                    )}
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-[2rem] border-zinc-200 p-8">
                    <DialogHeader>
                        <DialogTitle className="font-heading text-2xl font-bold tracking-tight">Ajustes del Tablón ⚙️</DialogTitle>
                    </DialogHeader>

                    <form action={handleUpdate} className="space-y-5 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-bold text-zinc-700">Nombre</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={currentName}
                                required
                                className="h-14 rounded-2xl shadow-none border-zinc-200 bg-[#FAFAFA] focus-visible:ring-[#FF5C00] font-medium px-4"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug" className="text-sm font-bold text-zinc-700">URL (Slug)</Label>
                            <div className="flex">
                                <span className="inline-flex items-center px-4 rounded-l-2xl border border-r-0 border-zinc-200 bg-zinc-100 text-zinc-500 text-sm font-medium">
                                    /board/
                                </span>
                                <Input
                                    id="slug"
                                    name="slug"
                                    defaultValue={currentSlug}
                                    required
                                    className="h-14 rounded-none rounded-r-2xl shadow-none border-zinc-200 bg-[#FAFAFA] focus-visible:ring-[#FF5C00] font-medium"
                                />
                            </div>
                            {error && <p className="text-sm text-red-500 font-medium mt-2">{error}</p>}
                        </div>

                        <div className="flex gap-3 pt-6">
                            <Button
                                type="button"
                                onClick={() => setIsSettingsOpen(false)}
                                disabled={isPending}
                                variant="outline"
                                className="w-full h-14 rounded-full font-bold border-zinc-200 hover:bg-zinc-50"
                            >
                                Cerrar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-14 rounded-full bg-[#FF5C00] text-white hover:bg-[#E65300] font-bold shadow-md shadow-[#FF5C00]/20 active:scale-95"
                            >
                                {isPending ? 'Guardando...' : 'Guardar ✅'}
                            </Button>
                        </div>

                        <div className="pt-6 mt-6 border-t border-red-50">
                            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex flex-col gap-3">
                                <div>
                                    <h4 className="font-bold text-red-900 text-sm">Zona de peligro</h4>
                                    <p className="text-red-700 font-medium text-xs">Eliminar definitivamente este tablón y sus datos.</p>
                                </div>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setIsSettingsOpen(false);
                                        // timeout for smoother transition between modals
                                        setTimeout(() => setIsDeleteOpen(true), 150);
                                    }}
                                    disabled={isPending}
                                    className="w-full h-10 rounded-full bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold shadow-sm transition-colors"
                                >
                                    Borrar Tablón
                                </Button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal de Borrado (High-Conversion Style) */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-sm rounded-[2.5rem] p-8 border-none shadow-2xl overflow-hidden">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-2 animate-pulse">
                            <AlertTriangle className="w-10 h-10 text-red-600" />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tight text-zinc-900 leading-tight">
                                ¡Cuidado! Estás a punto de borrarlo todo
                            </DialogTitle>
                            <DialogDescription className="text-zinc-500 font-semibold leading-relaxed pt-2">
                                Esta acción es irreversible. Se borrarán todos los votos e ideas acumuladas. ¿Seguro que quieres seguir?
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col w-full gap-3 pt-6">
                            <Button
                                onClick={handleDelete}
                                disabled={isPending}
                                className="w-full h-16 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-lg shadow-xl shadow-red-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <X className="w-5 h-5 animate-spin-fast" />
                                        Borrando...
                                    </>
                                ) : 'Sí, borrar definitivamente 🗑️'}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setIsDeleteOpen(false)}
                                disabled={isPending}
                                className="w-full h-14 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-black tracking-tight"
                            >
                                Me lo he pensado mejor
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
