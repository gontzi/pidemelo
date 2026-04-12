'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Monitor, Zap, Plus, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { createBoard } from '@/app/dashboard/actions';
import { useState, useEffect } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';

export default function BottomNav({ dict }: { dict: any }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const { user } = useUser();

    const isActive = (path: string) => {
        if (path === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(path);
    };

    const navItems = [
        { 
            href: '/dashboard', 
            label: dict.navbar.dashboard?.replace('🏠', '').trim() || 'Panel', 
            icon: Home 
        },
        { 
            href: '/dashboard/widgets', 
            label: dict.navbar.widgets || 'Widgets', 
            icon: Monitor 
        },

        { 
            href: '/dashboard/profile', 
            label: 'Perfil', 
            icon: User,
            isProfile: true
        },
    ];

    return (
        <div className="lg:hidden fixed bottom-6 left-0 right-0 z-50 px-6 pointer-events-none overflow-visible">
            <div className="max-w-md mx-auto relative h-24 pointer-events-none overflow-visible">
                {/* Floating Action Button */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 z-[70] pointer-events-auto">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-16 h-16 rounded-full bg-[#FF5C00] hover:bg-[#E65300] text-white shadow-[0_12px_30px_rgba(255,92,0,0.45)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 border-[4px] border-white">
                                <Plus className="w-8 h-8 stroke-[3]" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[92vw] rounded-[2.5rem] p-8 border-none shadow-2xl bg-white/95 backdrop-blur-xl">
                            <DialogHeader>
                                <DialogTitle className="text-3xl font-black tracking-tighter text-zinc-900 text-center mb-4">
                                    {dict.dashboard_index.new_board} 🚀
                                </DialogTitle>
                            </DialogHeader>
                            <form action={async (formData) => {
                                await createBoard(formData);
                                setOpen(false);
                            }} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-zinc-400 ml-1">{dict.dashboard_index.new_board}</label>
                                    <Input
                                        name="name"
                                        placeholder={dict.dashboard_index.project_name_ph}
                                        required
                                        className="h-14 shadow-none border-zinc-100 focus-visible:ring-[#FF5C00] focus-visible:border-[#FF5C00] bg-zinc-50 rounded-2xl text-lg px-4 font-bold"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full h-14 bg-[#FF5C00] text-white hover:bg-[#E65300] shadow-lg shadow-orange-500/20 rounded-full font-black text-sm tracking-widest uppercase transition-all"
                                >
                                    {dict.dashboard_index.create_btn}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                
                {/* Main Navigation Bar */}
                <nav className="absolute inset-x-0 bottom-2 h-16 bg-white/95 backdrop-blur-xl border border-zinc-200/50 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.15)] px-4 flex items-center justify-between pointer-events-auto overflow-visible">
                    <div className="flex flex-1 justify-around items-center h-full">
                        {navItems.slice(0, 2).map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center gap-1 transition-all active:scale-90 px-1",
                                    isActive(item.href) ? "text-[#FF5C00]" : "text-zinc-400"
                                )}
                            >
                                <item.icon className={cn("w-6 h-6", isActive(item.href) && "fill-current/10")} />
                                <span className="text-[9px] font-black uppercase tracking-tighter leading-none">{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Spacer for FAB area */}
                    <div className="w-16 h-full" />

                    <div className="flex flex-1 justify-around items-center h-full">
                        {navItems.slice(2).map((item) => (
                            item.isProfile ? (
                                <div key="profile" className="flex flex-col items-center gap-1 active:scale-90 transition-all px-1">
                                    <UserButton appearance={{ elements: { avatarBox: "w-6 h-6 border border-zinc-200" } }} />
                                    <span className="text-[9px] font-black uppercase tracking-tighter text-zinc-400 leading-none">Perfil</span>
                                </div>
                            ) : (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex flex-col items-center gap-1 transition-all active:scale-90 px-1",
                                        isActive(item.href) ? "text-[#FF5C00]" : "text-zinc-400"
                                    )}
                                >
                                    <item.icon className={cn("w-6 h-6", isActive(item.href) && "fill-current/10")} />
                                    <span className="text-[9px] font-black uppercase tracking-tighter leading-none">{item.label}</span>
                                </Link>
                            )
                        ))}
                    </div>
                </nav>
            </div>
        </div>
    );
}
