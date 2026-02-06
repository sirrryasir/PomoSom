'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, Trash2 } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    const hardReset = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground text-center">
            <div className="w-full max-w-md p-8 rounded-3xl bg-muted/10 border border-border backdrop-blur-xl flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-black tracking-tight">Something went wrong!</h2>
                    <p className="text-muted-foreground text-sm">
                        An unexpected error occurred. This might be due to a corrupted local state or a temporary glitch.
                    </p>
                    {error.message && (
                        <div className="p-2 bg-red-500/5 border border-red-500/10 rounded-lg text-[10px] font-mono text-red-400 mt-2 break-all">
                            {error.message}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Button
                        onClick={() => reset()}
                        className="w-full h-12 rounded-xl font-bold bg-foreground text-background hover:bg-foreground/90"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>

                    <Button
                        variant="outline"
                        onClick={hardReset}
                        className="w-full h-12 rounded-xl font-bold border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-600"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Reset App (Clear Data)
                    </Button>
                </div>
            </div>
        </div>
    );
}
