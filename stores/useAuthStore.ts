import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import { useNotesStore } from './useNotesStore';
import { useMemoriesStore } from './useMemoriesStore';
import { useCountdownsStore } from './useCountdownsStore';
import { useTimelineStore } from './useTimelineStore';
import { useBucketStore } from './useBucketStore';
import { useMoodStore } from './useMoodStore';
import { useLocationStore } from './useLocationStore';
import { useNicknameStore } from './useNicknameStore';
import { useCoupleStore } from './useCoupleStore';
import { useProfileStore } from './useProfileStore';
import { useDateIdeasStore } from './useDateIdeasStore';
import { useJournalStore } from './useJournalStore';
import { useQuestionsStore } from './useQuestionsStore';
import { useSongStore } from './useSongStore';
import { usePartnerNotesStore } from './usePartnerNotesStore';
import { useThinkingStore } from './useThinkingStore';
import { useSleepWakeStore } from './useSleepWakeStore';
import type { PartnerRole } from '@/lib/types';
import type { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  spaceId: string | null;
  myRole: PartnerRole | null;
  inviteCode: string | null;
  isLoading: boolean;
  error: string | null;

  setSession: (session: Session | null) => void;
  setSpaceInfo: (spaceId: string, role: PartnerRole, inviteCode: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  signUp: (email: string, password: string) => Promise<'session' | 'confirmation' | false>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;

  createSpace: () => Promise<string | null>;
  joinSpace: (inviteCode: string) => Promise<boolean>;

  loadSpaceInfo: () => Promise<void>;
  reset: () => void;
}

const generateInviteCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      user: null,
      spaceId: null,
      myRole: null,
      inviteCode: null,
      isLoading: false,
      error: null,

      setSession: (session) =>
        set({
          session,
          user: session?.user ?? null,
          error: null,
        }),

      setSpaceInfo: (spaceId, role, inviteCode) =>
        set({ spaceId, myRole: role, inviteCode }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      signUp: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: 'us-couple-app://auth/confirm',
            },
          });

          if (error) {
            set({ isLoading: false, error: error.message });
            return false;
          }

          if (data.session) {
            set({
              session: data.session,
              user: data.user,
              isLoading: false,
            });
            return 'session';
          }

          // No session means email confirmation is required
          set({ isLoading: false });
          return 'confirmation';
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Something went wrong. Please try again.';
          set({ isLoading: false, error: message });
          return false;
        }
      },

      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            set({ isLoading: false, error: error.message });
            return false;
          }

          // Load space info BEFORE setting session to prevent race condition
          // where protected route sees session but no spaceId and redirects to create-space
          let spaceId: string | null = null;
          let myRole: PartnerRole | null = null;
          let inviteCodeValue: string | null = null;

          try {
            const { data: member } = await supabase
              .from('space_members')
              .select('space_id, role, spaces(invite_code)')
              .eq('user_id', data.user.id)
              .single();

            if (member) {
              spaceId = member.space_id;
              myRole = member.role as PartnerRole;
              const spaceData = member.spaces;
              if (
                spaceData &&
                typeof spaceData === 'object' &&
                !Array.isArray(spaceData) &&
                'invite_code' in spaceData &&
                typeof (spaceData as Record<string, unknown>).invite_code === 'string'
              ) {
                inviteCodeValue = (spaceData as Record<string, unknown>).invite_code as string;
              }
            }
          } catch {
            // Space info query failed — still proceed with session
          }

          set({
            session: data.session,
            user: data.user,
            spaceId,
            myRole,
            inviteCode: inviteCodeValue,
            isLoading: false,
          });

          return true;
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Something went wrong. Please try again.';
          set({ isLoading: false, error: message });
          return false;
        }
      },

      signOut: async () => {
        await supabase.auth.signOut();
        // Clear all local stores
        useNotesStore.getState().reset();
        useMemoriesStore.getState().reset();
        useCountdownsStore.getState().reset();
        useTimelineStore.getState().reset();
        useBucketStore.getState().reset();
        useMoodStore.getState().reset();
        useLocationStore.getState().reset();
        useNicknameStore.getState().reset();
        useCoupleStore.getState().reset();
        useProfileStore.getState().reset();
        useDateIdeasStore.getState().reset();
        useJournalStore.getState().reset();
        useQuestionsStore.getState().reset();
        useSongStore.getState().reset();
        usePartnerNotesStore.getState().reset();
        useThinkingStore.getState().reset();
        useSleepWakeStore.getState().reset();
        set({
          session: null,
          user: null,
          spaceId: null,
          myRole: null,
          inviteCode: null,
          error: null,
        });
      },

      createSpace: async () => {
        const { user } = get();
        if (!user) return null;

        set({ isLoading: true, error: null });
        const inviteCode = generateInviteCode();

        const { data, error } = await supabase
          .from('spaces')
          .insert({
            invite_code: inviteCode,
            created_by: user.id,
          })
          .select()
          .single();

        if (error) {
          set({ isLoading: false, error: error.message });
          return null;
        }

        // Join as partner1
        const { error: memberError } = await supabase
          .from('space_members')
          .insert({
            space_id: data.id,
            user_id: user.id,
            role: 'partner1',
          });

        if (memberError) {
          set({ isLoading: false, error: memberError.message });
          return null;
        }

        set({
          spaceId: data.id,
          myRole: 'partner1',
          inviteCode,
          isLoading: false,
        });

        return inviteCode;
      },

      joinSpace: async (inviteCode) => {
        const { user } = get();
        if (!user) return false;

        // Validate invite code format before querying
        const trimmed = inviteCode.trim().toUpperCase();
        if (!/^[A-Z2-9]{6}$/.test(trimmed)) {
          set({ error: 'Invalid invite code format. Code should be 6 characters.' });
          return false;
        }

        set({ isLoading: true, error: null });

        // Find space by invite code
        const { data: space, error: spaceError } = await supabase
          .from('spaces')
          .select('id')
          .eq('invite_code', inviteCode.toUpperCase())
          .single();

        if (spaceError || !space) {
          set({ isLoading: false, error: 'Invalid invite code. Please check and try again.' });
          return false;
        }

        // Check if space already has 2 members
        const { count } = await supabase
          .from('space_members')
          .select('*', { count: 'exact', head: true })
          .eq('space_id', space.id);

        if (count && count >= 2) {
          set({ isLoading: false, error: 'This space already has two partners.' });
          return false;
        }

        // Join as partner2
        const { error: joinError } = await supabase
          .from('space_members')
          .insert({
            space_id: space.id,
            user_id: user.id,
            role: 'partner2',
          });

        if (joinError) {
          set({ isLoading: false, error: joinError.message });
          return false;
        }

        set({
          spaceId: space.id,
          myRole: 'partner2',
          inviteCode,
          isLoading: false,
        });

        return true;
      },

      loadSpaceInfo: async () => {
        const { user } = get();
        if (!user) return;

        const { data: member } = await supabase
          .from('space_members')
          .select('space_id, role, spaces(invite_code)')
          .eq('user_id', user.id)
          .single();

        if (member) {
          // Safely extract invite_code from the joined spaces relation
          let inviteCodeValue: string | null = null;
          const spaceData = member.spaces;
          if (
            spaceData &&
            typeof spaceData === 'object' &&
            !Array.isArray(spaceData) &&
            'invite_code' in spaceData &&
            typeof (spaceData as Record<string, unknown>).invite_code === 'string'
          ) {
            inviteCodeValue = (spaceData as Record<string, unknown>).invite_code as string;
          }
          set({
            spaceId: member.space_id,
            myRole: member.role as PartnerRole,
            inviteCode: inviteCodeValue,
          });
        }
      },

      reset: () =>
        set({
          session: null,
          user: null,
          spaceId: null,
          myRole: null,
          inviteCode: null,
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: 'auth-storage',
      storage: zustandStorage,
      partialize: (state) => ({
        spaceId: state.spaceId,
        myRole: state.myRole,
        inviteCode: state.inviteCode,
      }),
    }
  )
);
