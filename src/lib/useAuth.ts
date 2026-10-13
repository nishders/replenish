'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { getBrowserSupabase } from './supabase-browser';

// The signed-in user (null when signed out). `ready` is false until the saved session has been read.
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = getBrowserSupabase();
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return { user, ready };
}
