'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash, Plus, StickyNote, Loader2 } from 'lucide-react';

interface Note {
    id: string;
    content: string;
    createdAt: string;
}

export function Notes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState('');
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [isGuest, setIsGuest] = useState(true); // Default to guest for now

    const fetchNotes = useCallback(async () => {
        setLoading(true);
        try {
            // Try fetching from API first
            const res = await fetch('http://localhost:5000/api/notes');
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setNotes(data);
                    setIsGuest(false);
                    // Save to local as backup
                    localStorage.setItem('pomosom_notes_backup', JSON.stringify(data));
                    return;
                }
            }
        } catch (error) {
            console.warn('API unavailable, falling back to LocalStorage');
        }

        // Fallback to LocalStorage
        const local = localStorage.getItem('pomosom_notes');
        if (local) {
            setNotes(JSON.parse(local));
        }
        setIsGuest(true);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const addNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim() || adding) return;

        const tempId = Math.random().toString(36).substr(2, 9);
        const tempNote: Note = {
            id: tempId,
            content: newNote,
            createdAt: new Date().toISOString(),
        };

        if (isGuest) {
            const updatedNotes = [tempNote, ...notes];
            setNotes(updatedNotes);
            localStorage.setItem('pomosom_notes', JSON.stringify(updatedNotes));
            setNewNote('');
        } else {
            setAdding(true);
            try {
                const res = await fetch('http://localhost:5000/api/notes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: newNote }),
                });
                if (res.ok) {
                    const savedNote = await res.json();
                    setNotes([savedNote, ...notes]);
                    setNewNote('');
                }
            } catch (error) {
                console.error('Failed to add note to API', error);
            } finally {
                setAdding(false);
            }
        }
    };

    const deleteNote = async (id: string) => {
        if (isGuest) {
            const updatedNotes = notes.filter((n) => n.id !== id);
            setNotes(updatedNotes);
            localStorage.setItem('pomosom_notes', JSON.stringify(updatedNotes));
        } else {
            try {
                const res = await fetch(`http://localhost:5000/api/notes/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    setNotes(notes.filter((n) => n.id !== id));
                }
            } catch (error) {
                console.error('Failed to delete note from API', error);
            }
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto bg-card/40 backdrop-blur-3xl border-border/50 p-8 shadow-2xl rounded-[2rem] transition-all duration-500">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-foreground/5 rounded-xl">
                        <StickyNote className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-foreground">Deep Focus</h2>
                        <p className="text-[10px] uppercase tracking-widest text-foreground/30 font-bold">Session Notes</p>
                    </div>
                </div>
                {isGuest && (
                    <div className="px-2 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-[8px] uppercase font-black text-orange-500">
                        Guest Mode
                    </div>
                )}
            </div>

            <form onSubmit={addNote} className="flex gap-3 mb-8">
                <Input
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Capture a thought..."
                    className="bg-foreground/[0.03] border-border text-foreground rounded-xl placeholder:text-foreground/20 focus-visible:ring-orange-500/50"
                />
                <Button
                    type="submit"
                    size="icon"
                    disabled={adding}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg transition-transform active:scale-90 shrink-0"
                >
                    {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-5 h-5" />}
                </Button>
            </form>

            <ScrollArea className="h-[320px] pr-4">
                {loading && notes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 opacity-20 text-foreground">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Syncing</span>
                    </div>
                ) : notes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-20 text-foreground">
                        <StickyNote className="w-10 h-10 mb-2" />
                        <p className="text-xs italic">Your mind is clear.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                className="group flex justify-between items-start gap-4 p-4 rounded-2xl bg-foreground/[0.02] hover:bg-foreground/[0.05] transition-all border border-transparent hover:border-border/50"
                            >
                                <p className="text-sm text-foreground/70 break-words leading-relaxed flex-1">{note.content}</p>
                                <button
                                    onClick={() => deleteNote(note.id)}
                                    className="text-foreground/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                                >
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </Card>
    );
}
