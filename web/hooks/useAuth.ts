import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export const useAuth = () => {
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const setData = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) console.error('Error getting session', error);
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        };

        setData();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) console.error('Error signing in with Google', error);
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Error signing out', error);
    };

    return { user, session, loading, signInWithGoogle, signOut };
};
