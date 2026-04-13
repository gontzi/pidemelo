'use client';

import { useState, useTransition, useEffect } from 'react';
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
import { updateBoardSettings, deleteBoard, updateBoardNotificationPreference } from './actions';
import TagsManager from './TagsManager';
import { Switch } from '@/components/ui/switch';

type Tag = {
    id: string;
    name: string;
    color: string;
};

export default function SettingsModal({
    boardId,
    currentName,
    currentSlug,
    trigger,
    dict,
    tags,
    notifyNewIdeas: initialNotifyState,
    open: externalOpen,
    onOpenChange: setExternalOpen
}: {
    boardId: string,
    currentName: string,
    currentSlug: string,
    dict: Record<string, string>,
    trigger?: React.ReactNode,
    tags?: Tag[],
    notifyNewIdeas?: boolean,
    open?: boolean,
    onOpenChange?: (open: boolean) => void
}) {
    const [internalOpen, setInternalOpen] = useState(false);
    
    const isSettingsOpen = externalOpen !== undefined ? externalOpen : internalOpen;
    const setIsSettingsOpen = setExternalOpen !== undefined ? setExternalOpen : setInternalOpen;

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [notify, setNotify] = useState(initialNotifyState ?? true);
    const router = useRouter();

    // Sincronizar el estado local si la prop del servidor cambia (revalidación)
    useEffect(() => {
        setNotify(initialNotifyState ?? true);
    }, [initialNotifyState]);

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

    const handleNotifyChange = (checked: boolean) => {
        // Optimistic update
        setNotify(checked);
        startTransition(async () => {
            const res = await updateBoardNotificationPreference(boardId, checked);
            if (res?.error) {
                // Rollback on error
                setNotify(!checked);
                setError(res.error);
            }
        });
    };

    return (
        <>
            {/* Modal de Ajustes */}
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                    {trigger ? trigger : (
                        <button className="inline-flex items-center justify-center px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 rounded-full text-xs md:text-sm font-bold transition-all shadow-sm active:scale-95">
                            <Settings className="w-3.5 h-3.5 mr-2" /> {dict.settings}
                        </button>
                    )}
                </DialogTrigger>
                <DialogContent className="w-[90vw] md:max-w-3xl lg:max-w-5xl rounded-[2rem] border-zinc-200 p-6 md:p-10">
                    <DialogHeader>
                        <DialogTitle className="font-heading text-xl md:text-3xl font-bold tracking-tight">{dict.board_settings}</DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-2 md:mt-4">
                        <form action={handleUpdate} className="space-y-4 md:space-y-5 flex flex-col">
                            <div className="space-y-1.5 md:space-y-2">
                                <Label htmlFor="name" className="text-xs md:text-sm font-bold text-zinc-700">{dict.name}</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={currentName}
                                    required
                                    className="h-12 md:h-14 rounded-2xl shadow-none border-zinc-200 bg-[#FAFAFA] focus-visible:ring-[#FF5C00] font-medium px-4 text-sm md:text-base"
                                />
                            </div>
                            <div className="space-y-1.5 md:space-y-2">
                                <Label htmlFor="slug" className="text-xs md:text-sm font-bold text-zinc-700">{dict.slug}</Label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 md:px-4 rounded-l-2xl border border-r-0 border-zinc-200 bg-zinc-100 text-zinc-500 text-[10px] md:text-sm font-medium">
                                        /board/
                                    </span>
                                    <Input
                                        id="slug"
                                        name="slug"
                                        defaultValue={currentSlug}
                                        required
                                        className="h-12 md:h-14 rounded-none rounded-r-2xl shadow-none border-zinc-200 bg-[#FAFAFA] focus-visible:ring-[#FF5C00] font-medium text-sm md:text-base"
                                    />
                                </div>
                                {error && <p className="text-[10px] md:text-sm text-red-500 font-medium mt-2">{(dict as any).errors?.[error] || error}</p>}
                            </div>

                            {/* Notificaciones */}
                            <div className="pt-4 border-t border-zinc-100">
                                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-200/50">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-bold text-zinc-900 leading-none">{dict.notify_email}</Label>
                                        <p className="text-[10px] md:text-xs text-zinc-500 font-medium">{dict.notify_desc}</p>
                                    </div>
                                    <Switch
                                        checked={notify}
                                        onCheckedChange={handleNotifyChange}
                                        disabled={isPending}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-4 md:pt-6">
                                <Button
                                    type="button"
                                    onClick={() => setIsSettingsOpen(false)}
                                    disabled={isPending}
                                    variant="outline"
                                    className="w-full h-12 md:h-14 rounded-full font-bold border-zinc-200 hover:bg-zinc-50 order-2 sm:order-1 text-sm"
                                >
                                    {dict.close}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full h-12 md:h-14 rounded-full bg-[#FF5C00] text-white hover:bg-[#E65300] font-bold shadow-md shadow-[#FF5C00]/20 active:scale-95 order-1 sm:order-2 text-sm"
                                >
                                    {isPending ? dict.saving : dict.save}
                                </Button>
                            </div>

                            <div className="pt-4 md:pt-6 mt-4 md:mt-6 border-t border-red-50">
                                <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex flex-col gap-3">
                                    <div>
                                        <h4 className="font-bold text-red-900 text-xs md:text-sm">{dict.danger_zone}</h4>
                                        <p className="text-red-700 font-medium text-[10px] md:text-xs">{dict.delete_warning}</p>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setIsSettingsOpen(false);
                                            // timeout for smoother transition between modals
                                            setTimeout(() => setIsDeleteOpen(true), 150);
                                        }}
                                        disabled={isPending}
                                        className="w-full h-10 rounded-full bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold shadow-sm transition-colors text-xs"
                                    >
                                        {dict.delete_board}
                                    </Button>
                                </div>
                            </div>
                        </form>

                        <div className="hidden md:flex flex-col space-y-4 md:border-l md:pl-8 lg:pl-12 border-zinc-100">
                            {tags !== undefined ? (
                                <TagsManager boardId={boardId} tags={tags} dict={dict} />
                            ) : (
                                <div className="flex-1 border-2 border-dashed border-zinc-100 rounded-2xl bg-zinc-50 flex flex-col items-center justify-center p-8 text-center text-zinc-400 gap-3 min-h-[300px]">
                                    <div className="p-3 bg-white rounded-xl shadow-sm border border-zinc-100">
                                        <Settings className="w-6 h-6 text-zinc-300" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest">{dict.under_construction}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal de Borrado (High-Conversion Style) */}
            < Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} >
                <DialogContent className="w-[90vw] sm:max-w-sm rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border-none shadow-2xl overflow-hidden">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-red-100 rounded-full flex items-center justify-center mb-2 animate-pulse">
                            <AlertTriangle className="w-8 h-8 md:w-10 md:h-10 text-red-600" />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 leading-tight">
                                {dict.delete_confirm_title}
                            </DialogTitle>
                            <DialogDescription className="text-zinc-500 font-semibold leading-relaxed pt-2 text-xs md:text-sm">
                                {dict.delete_confirm_desc}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col w-full gap-3 pt-4 md:pt-6">
                            <Button
                                onClick={handleDelete}
                                disabled={isPending}
                                className="w-full h-14 md:h-16 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-base md:text-lg shadow-xl shadow-red-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <X className="w-4 h-4 md:w-5 md:h-5 animate-spin-fast" />
                                        {dict.deleting}
                                    </>
                                ) : dict.yes_delete}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setIsDeleteOpen(false)}
                                disabled={isPending}
                                className="w-full h-12 md:h-14 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-black tracking-tight text-sm md:text-base"
                            >
                                {dict.changed_my_mind}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog >
        </>
    );
}
