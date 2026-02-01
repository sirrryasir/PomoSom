'use client';

import { useTimer } from '@/hooks/useTimer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function PremiumTimer() {
    const {
        remainingTime,
        isRunning,
        type,
        round,
        dailySessions,
        start,
        pause,
        reset,
        setType,
        formatTime,
        progress,
    } = useTimer();

    const getTheme = () => {
        switch (type) {
            case 'focus':
                return {
                    color: 'text-orange-400',
                    bg: 'bg-orange-500/10',
                    border: 'border-orange-500/20',
                    ring: 'text-orange-500',
                    button: 'bg-orange-500 hover:bg-orange-600',
                };
            case 'short_break':
                return {
                    color: 'text-emerald-400',
                    bg: 'bg-emerald-500/10',
                    border: 'border-emerald-500/20',
                    ring: 'text-emerald-500',
                    button: 'bg-emerald-500 hover:bg-emerald-600',
                };
            case 'long_break':
                return {
                    color: 'text-blue-400',
                    bg: 'bg-blue-500/10',
                    border: 'border-blue-500/20',
                    ring: 'text-blue-500',
                    button: 'bg-blue-500 hover:bg-blue-600',
                };
            default:
                return {
                    color: 'text-orange-400',
                    bg: 'bg-orange-500/10',
                    border: 'border-orange-500/20',
                    ring: 'text-orange-500',
                    button: 'bg-orange-500 hover:bg-orange-600',
                };
        }
    };

    const theme = getTheme();

    return (
        <div className="w-full max-w-md mx-auto">
            <Card
                className={cn(
                    'border backdrop-blur-3xl shadow-2xl p-8 rounded-[2rem] transition-all duration-700',
                    theme.bg,
                    theme.border
                )}
            >
                {/* Type Toggles */}
                <div className="flex justify-center gap-1 mb-12 p-1 bg-foreground/[0.03] rounded-2xl">
                    {(['focus', 'short_break', 'long_break'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setType(t)}
                            className={cn(
                                'flex-1 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-500',
                                type === t
                                    ? 'bg-background text-foreground shadow-lg scale-100'
                                    : 'text-foreground/30 hover:text-foreground/60 hover:bg-foreground/5'
                            )}
                        >
                            {t.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {/* Circular Timer (DaisyUI Radial) */}
                <div className="relative flex items-center justify-center mb-12 group">
                    <div
                        className="radial-progress text-foreground/5 opacity-50 transition-all duration-500"
                        style={{ '--value': 100, '--size': '18rem', '--thickness': '0.4rem' } as any}
                    />
                    <div
                        className={cn(
                            'radial-progress absolute transition-all duration-1000 ease-linear drop-shadow-[0_0_15px_rgba(0,0,0,0.1)]',
                            theme.ring
                        )}
                        style={
                            {
                                '--value': 100 - progress,
                                '--size': '18rem',
                                '--thickness': '0.4rem',
                            } as any
                        }
                    />

                    <div className="absolute flex flex-col items-center">
                        <span className="text-7xl font-light tracking-tight tabular-nums text-foreground drop-shadow-md">
                            {formatTime(remainingTime)}
                        </span>
                        <div className="flex flex-col items-center gap-1 mt-4">
                            <div className={cn('text-[10px] uppercase tracking-[0.3em] font-bold opacity-50 transition-colors', theme.color)}>
                                {isRunning ? 'Flowing' : 'Paused'}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="text-[8px] uppercase tracking-[0.2em] font-black text-foreground/20">
                                    Round {round}
                                </div>
                                <div className="w-1 h-1 rounded-full bg-foreground/10" />
                                <div className="text-[8px] uppercase tracking-[0.2em] font-black text-foreground/20">
                                    {dailySessions} Today
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6">
                    <Button
                        size="lg"
                        className={cn(
                            'h-16 px-12 rounded-[1.25rem] text-lg font-black uppercase tracking-[0.15em] transition-all active:scale-95 shadow-xl',
                            theme.button,
                            'text-white border-none'
                        )}
                        onClick={isRunning ? pause : start}
                    >
                        {isRunning ? <Pause className="fill-current" /> : <Play className="fill-current translate-x-0.5" />}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-16 w-16 rounded-[1.25rem] text-foreground/30 hover:text-foreground hover:bg-foreground/10 hover:rotate-[-18deg] transition-all duration-500"
                        onClick={reset}
                    >
                        <RotateCcw className="w-6 h-6" />
                    </Button>
                </div>
            </Card>
        </div>
    );
}
