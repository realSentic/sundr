"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/app/lib/supabase";

export default function Navbar() {
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [name, setName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        function applyUser(user: User | null) {
            const meta = user?.user_metadata;
            setLoggedIn(!!user);
            setName(meta?.display_name || meta?.username || user?.email?.split("@")[0] || "");
            setAvatarUrl(meta?.avatar_url || "");
        }

        supabase.auth.getUser().then(({ data }) => {
            applyUser(data.user);
            setLoading(false);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            applyUser(session?.user ?? null);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
        }
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }

        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, []);

    async function handleLogout() {
        await supabase.auth.signOut();
        setOpen(false);
        router.push("/");
        router.refresh();
    }

    return (
        <header>
            <nav className="mx-auto flex w-full max-w-7xl items-center gap-20 px-6 py-5">
                <div className="flex items-center justify-center">
                    <Link href="/" className="font-display text-3xl">Sundr.</Link>
                </div>

                <div className="flex flex-1 items-center justify-between">
                    <div>
                        <ul className="flex gap-10 text-sm text-mute">
                            <li className="hover:text-(--accent) duration-300"><Link href="#">Discover</Link></li>
                            <li className="hover:text-(--accent) duration-300"><Link href="#">Challenges</Link></li>
                            <li className="hover:text-(--accent) duration-300"><Link href="#">My Library</Link></li>
                        </ul>
                    </div>

                    {!loading && !loggedIn && (
                        <div>
                            <ul className="flex items-center gap-3 text-sm">
                                <li><Link href="/signin" className="block rounded-md border border-line px-4 py-2">Sign In</Link></li>
                                <li><Link href="/signup" className="block rounded-md border border-line bg-paper text-ink px-4 py-2">Sign Up</Link></li>
                            </ul>
                        </div>
                    )}

                    {!loading && loggedIn && (
                        <div ref={menuRef} className="relative">
                            <button type="button" onClick={() => setOpen(!open)} aria-haspopup="menu" aria-expanded={open} className="flex items-center gap-3 rounded-md border border-line px-3 py-1.5 text-sm hover:border-paper transition-colors">
                                <span className="size-7 shrink-0 overflow-hidden rounded-full border border-line bg-raised flex items-center justify-center font-display text-sm text-mute">{avatarUrl ? <Image src={avatarUrl} alt="" width={28} height={28} className="size-full object-cover" /> : name.charAt(0).toUpperCase()}</span>
                                <span className="max-w-32 truncate">{name}</span>
                                <span className={`text-mute text-xs transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
                            </button>

                            {open && (
                                <div role="menu" className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-line bg-surface py-1 text-sm">
                                    <Link href="/settings" role="menuitem" onClick={() => setOpen(false)} className="block px-4 py-2 text-paper hover:bg-raised transition-colors">Profile</Link>
                                    <Link href="/settings" role="menuitem" onClick={() => setOpen(false)} className="block px-4 py-2 text-paper hover:bg-raised transition-colors">Settings</Link>
                                    <button type="button" role="menuitem" onClick={handleLogout} className="block w-full px-4 py-2 text-left text-paper hover:bg-raised transition-colors">Log out</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}