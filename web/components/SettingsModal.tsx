'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings2, Bell, Volume2, Timer as TimerIcon, Save } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

export function SettingsModal() {
    const { settings, updateSettings, isLoaded } = useSettings();

    if (!isLoaded) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground/50 hover:text-foreground hover:bg-foreground/10 transition-all duration-500">
                    <Settings2 className="w-5 h-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-background/95 backdrop-blur-3xl border-border text-foreground rounded-[2rem] overflow-hidden shadow-2xl">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
                        <Settings2 className="w-6 h-6 text-orange-500" />
                        PROTOCOL SETTINGS
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="timer" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-muted rounded-xl p-1 mb-8">
                        <TabsTrigger value="timer" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <TimerIcon className="w-4 h-4 mr-2" />
                            Timer
                        </TabsTrigger>
                        <TabsTrigger value="sound" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Volume2 className="w-4 h-4 mr-2" />
                            Sound
                        </TabsTrigger>
                        <TabsTrigger value="info" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Bell className="w-4 h-4 mr-2" />
                            Focus
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="timer" className="space-y-6">
                        <div className="space-y-4">
                            <Label className="text-[10px] uppercase tracking-widest font-black text-foreground/40">Durations (Minutes)</Label>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="focus" className="text-xs font-bold">Focus</Label>
                                    <Input
                                        id="focus"
                                        type="number"
                                        value={settings.focusTime}
                                        onChange={(e) => updateSettings({ focusTime: Number(e.target.value) })}
                                        className="bg-foreground/[0.03] border-border rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="short" className="text-xs font-bold">Short</Label>
                                    <Input
                                        id="short"
                                        type="number"
                                        value={settings.shortBreakTime}
                                        onChange={(e) => updateSettings({ shortBreakTime: Number(e.target.value) })}
                                        className="bg-foreground/[0.03] border-border rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="long" className="text-xs font-bold">Long</Label>
                                    <Input
                                        id="long"
                                        type="number"
                                        value={settings.longBreakTime}
                                        onChange={(e) => updateSettings({ longBreakTime: Number(e.target.value) })}
                                        className="bg-foreground/[0.03] border-border rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border/50">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold">Auto-start Breaks</Label>
                                    <p className="text-[10px] text-foreground/40 lowercase">Initiate next session automatically</p>
                                </div>
                                <Switch
                                    checked={settings.autoStartBreaks}
                                    onCheckedChange={(checked: boolean) => updateSettings({ autoStartBreaks: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold">Auto-start Pomodoros</Label>
                                    <p className="text-[10px] text-foreground/40 lowercase">Resume focus flow automatically</p>
                                </div>
                                <Switch
                                    checked={settings.autoStartPomodoros}
                                    onCheckedChange={(checked: boolean) => updateSettings({ autoStartPomodoros: checked })}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="sound" className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-bold uppercase tracking-widest opacity-60">Alarm Volume</Label>
                                <span className="text-[10px] font-mono text-foreground/40">{settings.alarmVolume}%</span>
                            </div>
                            <Slider
                                value={[settings.alarmVolume]}
                                max={100}
                                step={1}
                                onValueChange={(vals: number[]) => updateSettings({ alarmVolume: vals[0] })}
                            />
                        </div>


                        <div className="space-y-6 pt-4 border-t border-border/50">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold">Ticking Sound</Label>
                                <p className="text-[10px] text-foreground/40 lowercase">Choose ambient sound for focus sessions</p>
                                <select
                                    value={settings.tickingSound}
                                    onChange={(e) => updateSettings({ tickingSound: e.target.value as any })}
                                    className="w-full bg-foreground/[0.03] border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                                >
                                    <option value="none">None</option>
                                    <option value="slow">Ticking Slow</option>
                                    <option value="fast">Ticking Fast</option>
                                </select>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold uppercase tracking-widest opacity-60">Volume</Label>
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-2 text-[10px] font-bold uppercase tracking-wider hover:bg-foreground/5"
                                            onClick={() => {
                                                if (settings.tickingSound === 'none') return;
                                                const TICKING_SOUNDS: Record<string, string> = {
                                                    slow: '/sounds/ticking-slow.mp3',
                                                    fast: '/sounds/ticking-fast.mp3',
                                                };
                                                const url = TICKING_SOUNDS[settings.tickingSound];
                                                if (url) {
                                                    const audio = new Audio(url);
                                                    audio.volume = settings.tickingVolume / 100;
                                                    audio.play().catch(() => { });
                                                }
                                            }}
                                            disabled={settings.tickingSound === 'none'}
                                        >
                                            Test Sound
                                        </Button>
                                        <span className="text-[10px] font-mono text-foreground/40">{settings.tickingVolume}%</span>
                                    </div>
                                </div>
                                <Slider
                                    value={[settings.tickingVolume]}
                                    max={100}
                                    step={1}
                                    disabled={settings.tickingSound === 'none'}
                                    onValueChange={(vals: number[]) => updateSettings({ tickingVolume: vals[0] })}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="info" className="space-y-6">
                        <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                            <p className="text-xs leading-relaxed text-foreground/70">
                                PomoSom protocols are designed for synchronization between your mind and your environment.
                                <br /><br />
                                For maximum efficiency, we recommend 4 focus sessions followed by a 15-minute sanctuary break.
                            </p>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                            <div className="space-y-0.5">
                                <Label className="text-[10px] uppercase font-black text-foreground/40 tracking-widest">Long Break Interval</Label>
                                <p className="text-sm font-bold">{settings.longBreakInterval} Rounds</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg border-border"
                                    onClick={() => updateSettings({ longBreakInterval: Math.max(1, settings.longBreakInterval - 1) })}
                                >-</Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg border-border"
                                    onClick={() => updateSettings({ longBreakInterval: settings.longBreakInterval + 1 })}
                                >+</Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="mt-8 pt-6 border-t border-border flex justify-end">
                    <DialogClose asChild>
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold gap-2">
                            <Save className="w-4 h-4" />
                            COMPLETE PROTOCOL
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}
