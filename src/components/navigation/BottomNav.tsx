'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Monitor, Plus, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { createBoard } from '@/app/dashboard/actions';
import { useState } from 'react';
import { UserButton } from '@clerk/nextjs';

type BottomNavDict = {
    navbar: { dashboard?: string; widgets?: string; profile?: string; nav_menu?: string };
    dashboard_index: { new_board: string; project_name_ph: string; create_btn: string };
};

export default function BottomNav({ dict }: { dict: BottomNavDict }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const isActive = (path: string) => {
        if (path === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(path);
    };

    const navItems = [
        {
            href: '/dashboard',
            label: dict.navbar.dashboard?.replace('🏠', '').trim() || 'Panel',
            icon: Home,
        },
        {
            href: '/dashboard/widgets',
            label: dict.navbar.widgets || 'Widgets',
            icon: Monitor,
        },
        {
            href: '/dashboard/profile',
            label: dict.navbar.profile || 'Perfil',
            icon: User,
            isProfile: true,
        },
    ];

    const leftItems = navItems.slice(0, 2);
    const rightItems = navItems.slice(2);

    return (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pointer-events-none">
            <div className="max-w-md mx-auto relative h-20 pointer-events-none">
                {/* Botón de acción flotante: crear tablero */}
                <div className="absolute left-1/2 -top-4 -translate-x-1/2 z-[70] pointer-events-auto">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button
                                aria-label={dict.dashboard_index.new_board}
                                className="w-16 h-16 rounded-full bg-[#FF5C00] hover:bg-[#E65300] text-white shadow-[0_12px_30px_rgba(255,92,0,0.45)] flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95 border-[4px] border-white"
                            >
                                <Plus className="w-8 h-8 stroke-[3]" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[92vw] max-w-md rounded-[2rem] p-6 border-none shadow-2xl bg-white/95 backdrop-blur-xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black tracking-tighter text-zinc-900 text-center mb-2">
                                    {dict.dashboard_index.new_board}
                                </DialogTitle>
                            </DialogHeader>
                            <form
                                action={async (formData) => {
                                    await createBoard(formData);
                                    setOpen(false);
                                }}
                                className="space-y-5"
                            >
                                <div className="space-y-2">
                                    <label htmlFor="mobile-board-name" className="text-[10px] uppercase tracking-widest font-black text-zinc-400 ml-1">
                                        {dict.dashboard_index.new_board}
                                    </label>
                                    <Input
                                        id="mobile-board-name"
                                        name="name"
                                        placeholder={dict.dashboard_index.project_name_ph}
                                        required
                                        autoComplete="off"
                                        enterKeyHint="done"
                                        className="h-14 shadow-none border-zinc-100 focus-visible:ring-[#FF5C00] focus-visible:border-[#FF5C00] bg-zinc-50 rounded-2xl text-lg px-4 font-bold"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full h-14 bg-[#FF5C00] text-white hover:bg-[#E65300] shadow-lg shadow-orange-500/20 rounded-full font-black text-sm tracking-widest uppercase transition-colors"
                                >
                                    {dict.dashboard_index.create_btn}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Barra de navegación principal */}
                <nav
                    aria-label={dict.navbar.nav_menu || 'Main navigation'}
                    className="absolute inset-x-0 bottom-0 h-16 bg-white/95 backdrop-blur-xl border border-zinc-200/60 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.15)] px-2 flex items-center justify-between pointer-events-auto"
                >
                    <div className="flex flex-1 justify-around items-stretch h-full">
                        {leftItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={isActive(item.href) ? 'page' : undefined}
                                className={cn(
                                    'flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[44px] rounded-2xl transition-colors active:scale-95',
                                    isActive(item.href) ? 'text-[#FF5C00]' : 'text-zinc-400'
                                )}
                            >
                                <item.icon className="w-6 h-6" aria-hidden="true" />
                                <span className="text-[10px] font-black uppercase tracking-tight leading-none">{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Hueco para el FAB */}
                    <div className="w-16 h-full" aria-hidden="true" />

                    <div className="flex flex-1 justify-around items-stretch h-full">
                        {rightItems.map((item) =>
                            item.isProfile ? (
                                <div key="profile" className="flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[44px] px-1">
                                    <UserButton
                                        appearance={{ elements: { avatarBox: 'w-7 h-7 border border-zinc-200' } }}
                                    />
                                    <span className="text-[10px] font-black uppercase tracking-tight text-zinc-400 leading-none">
                                        {dict.navbar.profile || 'Perfil'}
                                    </span>
                                </div>
                            ) : (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={isActive(item.href) ? 'page' : undefined}
                                    className={cn(
                                        'flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[44px] rounded-2xl transition-colors active:scale-95',
                                        isActive(item.href) ? 'text-[#FF5C00]' : 'text-zinc-400'
                                    )}
                                >
                                    <item.icon className="w-6 h-6" aria-hidden="true" />
                                    <span className="text-[10px] font-black uppercase tracking-tight leading-none">{item.label}</span>
                                </Link>
                            )
                        )}
                    </div>
                </nav>
            </div>
        </div>
    );
}
