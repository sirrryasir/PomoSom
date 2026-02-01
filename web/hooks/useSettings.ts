import { useState, useEffect } from 'react';

export type TickingSound = 'none' | 'slow' | 'fast';

export interface TimerSettings {
    focusTime: number;
    shortBreakTime: number;
    longBreakTime: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
    longBreakInterval: number;
    alarmSound: string;
    alarmVolume: number;
    tickingSound: TickingSound;
    tickingVolume: number;
}

const DEFAULT_SETTINGS: TimerSettings = {
    focusTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    longBreakInterval: 4,
    alarmSound: 'digital',
    alarmVolume: 50,
    tickingSound: 'none',
    tickingVolume: 50,
};

export const useSettings = () => {
    const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('pomosom_settings');
        if (saved) {
            try {
                setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
            } catch (e) {
                console.error('Failed to parse settings', e);
            }
        }
        setIsLoaded(true);
    }, []);

    const updateSettings = (newSettings: Partial<TimerSettings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        localStorage.setItem('pomosom_settings', JSON.stringify(updated));
    };

    return { settings, updateSettings, isLoaded };
};
