'use client';

import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar({ dict }: { dict: Record<string, string> }) {
    const pathname = usePathname();
    const { isLoaded, isSignedIn } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    if (pathname !== '/') return null;

    const showSignIn = !isLoaded || !isSignedIn;

    return (
        <>
            <nav
                aria-label={dict.nav_menu}
                className="sticky top-0 z-50 w-full bg-card/90 backdrop-blur-md border-b border-border pt-safe"
            >
                <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between gap-3">
                    <Link href="/" onClick={() => setMenuOpen(false)} className="font-heading font-semibold text-xl tracking-tight flex items-center">
                        <span className="transition-colors hover:text-[#FF5C00]">pidemelo</span>
                        <span className="text-[#FF5C00]">.</span>
                        <span>app</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        <Link href="/#que-es" className="text-sm font-semibold text-muted-foreground rounded-lg px-3 py-2 transition-colors hover:text-foreground hover:bg-accent">
                            {dict.what_is}
                        </Link>
                        <Link href="/#faq" className="text-sm font-semibold text-muted-foreground rounded-lg px-3 py-2 transition-colors hover:text-foreground hover:bg-accent">
                            {dict.faq}
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        <LanguageSwitcher />
                        {showSignIn ? (
                            <>
                                <Link href="/sign-in" className="hidden md:inline-flex text-sm font-semibold text-muted-foreground px-4 py-2 rounded-lg transition-colors hover:text-foreground hover:bg-accent">
                                    {dict.login}
                                </Link>
                                <Link href="/sign-in" className="hidden md:block">
                                    <Button size="pill">{dict.start_now}</Button>
                                </Link>
                                <Link href="/sign-in" className="md:hidden">
                                    <Button size="sm" className="rounded-full px-4 h-9">{dict.login_mobile}</Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/dashboard" className="hidden md:block">
                                    <Button size="pill">{dict.dashboard}</Button>
                                </Link>
                                <div className="hidden md:flex items-center">
                                    <UserButton appearance={{ elements: { avatarBox: "w-9 h-9 border border-border shadow-soft" } }} />
                                </div>
                                <div className="flex md:hidden items-center">
                                    <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 border border-border shadow-soft" } }} />
                                </div>
                            </>
                        )}
                        <button
                            aria-label={menuOpen ? dict.close_menu : dict.open_menu}
                            aria-expanded={menuOpen}
                            className="p-2 rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
                            onClick={() => setMenuOpen(p => !p)}
                        >
                            {menuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
                        </button>
                    </div>
                </div>
            </nav>

            {menuOpen && (
                <div className="fixed inset-0 top-16 z-40 md:hidden bg-background/95 backdrop-blur-md">
                    <div className="p-6 space-y-4 animate-pop">
                        <div className="grid gap-2">
                            <Link href="/#que-es" onClick={() => setMenuOpen(false)} className="px-5 py-4 rounded-2xl text-muted-foreground font-semibold hover:bg-accent hover:text-foreground">
                                {dict.mobile_what_is}
                            </Link>
                            <Link href="/#faq" onClick={() => setMenuOpen(false)} className="px-5 py-4 rounded-2xl text-muted-foreground font-semibold hover:bg-accent hover:text-foreground">
                                {dict.mobile_faq}
                            </Link>
                        </div>
                        {showSignIn ? (
                            <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="block">
                                <Button className="w-full" size="xl">{dict.mobile_try_free}</Button>
                            </Link>
                        ) : (
                            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block">
                                <Button className="w-full" size="xl">{dict.mobile_dashboard}</Button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
