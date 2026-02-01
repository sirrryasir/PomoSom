'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Users,
    MessageSquare,
    Trophy,
    Zap,
    Shield,
    ChevronRight,
    Plus,
    BarChart3,
    Timer
} from 'lucide-react';
import Link from 'next/link';

export function BotShowcase() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-orange-500/30">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <Zap className="w-3 h-3 text-orange-500" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">Trusted by 10,000+ Students</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                        MEET <span className="text-orange-500">POMOSOM</span>:<br />
                        THE ULTIMATE STUDY BOT.
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg text-foreground/40 mb-12 font-medium leading-relaxed">
                        Transform your Discord server into a high-performance study hub.
                        Automatic voice channel timers, visual progress cards, and competitive leaderboards.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            size="lg"
                            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-7 rounded-2xl text-lg font-black uppercase tracking-wider group transition-all active:scale-95"
                        >
                            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                            Add to Discord
                        </Button>
                        <Link href="/">
                            <Button
                                variant="outline"
                                size="lg"
                                className="px-8 py-7 rounded-2xl text-lg font-black uppercase tracking-wider border-foreground/10 hover:bg-foreground/5 transition-all"
                            >
                                Try Web Timer
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[150px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full" />
                </div>
            </section>

            {/* Stats Grid */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Study Servers', value: '1,200+', icon: MessageSquare },
                        { label: 'Active Users', value: '45k+', icon: Users },
                        { label: 'Hours Focused', value: '1.2M', icon: Timer },
                        { label: 'Global Rank', value: '#1', icon: Trophy },
                    ].map((stat, i) => (
                        <Card key={i} className="bg-foreground/[0.02] border-foreground/5 p-8 rounded-3xl flex flex-col items-center text-center group hover:bg-foreground/[0.04] transition-all">
                            <stat.icon className="w-6 h-6 mb-4 text-foreground/20 group-hover:text-orange-500 transition-colors" />
                            <div className="text-3xl font-black tracking-tighter mb-1">{stat.value}</div>
                            <div className="text-[10px] uppercase tracking-widest font-bold text-foreground/30">{stat.label}</div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 px-4 relative">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-20 items-center">
                        <div className="flex-1 space-y-8">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                                VISUAL PROGRESS<br />
                                <span className="text-orange-500">REAL-TIME SYNC.</span>
                            </h2>

                            <div className="space-y-6">
                                {[
                                    { title: 'Automatic VC Detection', desc: 'Join a voice channel and PomoSom starts your timer immediately. No commands needed.', icon: Zap },
                                    { title: 'Dynamic Status Cards', desc: 'Beautifully rendered images updated every minute to show everyone who is focusing.', icon: BarChart3 },
                                    { title: 'Server Leaderboards', desc: 'Automatic daily, weekly, and monthly reports to gamify productivity in your community.', icon: Trophy },
                                    { title: 'Premium Audio Alerts', desc: 'High-quality sound effects and voice prompts for focus and break transitions.', icon: Zap },
                                ].map((feature, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="shrink-0 w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                                            <feature.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                                            <p className="text-foreground/40 text-sm leading-relaxed">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 w-full max-w-lg">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                                <div className="relative bg-zinc-950 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                    <img
                                        src="/images/bot-preview.png"
                                        alt="Bot Interface"
                                        className="w-full h-auto"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-32 px-4">
                <Card className="max-w-4xl mx-auto bg-orange-500 p-12 md:p-20 rounded-[3rem] text-center border-none relative overflow-hidden group">
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-8">
                            Ready to boost your<br />server's productivity?
                        </h2>
                        <Button
                            size="lg"
                            className="bg-white text-orange-500 hover:bg-zinc-100 px-12 py-8 rounded-2xl text-xl font-black uppercase tracking-wider shadow-2xl transition-all active:scale-95"
                        >
                            Invite PomoSom Now
                        </Button>
                    </div>

                    {/* Decorative Background for CTA */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/20 blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-black/10 blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
                </Card>
            </section>

            {/* Footer */}
            <footer className="py-20 px-4 border-t border-foreground/5">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <img src="/images/logo.png" alt="PomoSom" className="w-8 h-8 opacity-50" />
                        <span className="font-black tracking-tighter opacity-50 uppercase">Pomosom</span>
                    </div>

                    <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-foreground/30">
                        <Link href="/" className="hover:text-orange-500 transition-colors">Web Timer</Link>
                        <Link href="/bot" className="hover:text-orange-500 transition-colors">Bot Showcase</Link>
                        <a href="#" className="hover:text-orange-500 transition-colors">Terms</a>
                        <a href="#" className="hover:text-orange-500 transition-colors">Privacy</a>
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/20">
                        © 2026 PomoSom by Yasir
                    </div>
                </div>
            </footer>
        </div>
    );
}
