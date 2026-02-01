'use client';

import { PremiumTimer } from '@/components/PremiumTimer';
import { Notes } from '@/components/Notes';
import { SettingsModal } from '@/components/SettingsModal';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserNav } from '@/components/UserNav';
import Link from 'next/link';
import { Bot } from 'lucide-react';

export function HomeContent() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center transition-all duration-1000">
            <header className="w-full max-w-2xl flex justify-between items-center py-6 px-4">
                <div className="flex items-center gap-2">
                    <img src="/images/logo.png" alt="PomoSom" className="w-10 h-10 object-contain" />
                    <h1 className="text-xl font-black tracking-tighter">POMOSOM</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/bot"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-foreground/5 hover:bg-orange-500/10 hover:text-orange-500 transition-all text-[10px] font-bold uppercase tracking-widest"
                    >
                        <Bot className="w-3.5 h-3.5" />
                        <span>Bot</span>
                    </Link>
                    <div className="flex items-center gap-1 bg-foreground/5 p-1 rounded-xl backdrop-blur-md">
                        <ThemeToggle />
                        <SettingsModal />
                        <UserNav />
                    </div>
                </div>
            </header>

            <main className="w-full max-w-2xl flex flex-col items-center px-4 py-8 gap-8">
                {/* Timer Section */}
                <div className="w-full flex flex-col items-center">
                    <PremiumTimer />
                </div>

                {/* Notes Section */}
                <div className="w-full max-w-xl">
                    <Notes />
                </div>
            </main>

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>
        </div>
    );
}
