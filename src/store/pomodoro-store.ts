import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  saveCompletedSession,
  getCompletedSessions,
  clearCompletedSessions as clearCompletedSessionsAction,
} from '@/actions/pomodoro';
import {
  themePresets,
  ThemePreset,
  BaseThemePreset,
} from '@/constants/theme-presets';

// Session type enum matching the Prisma schema
export enum PomodoroSessionType {
  FOCUS = 'FOCUS',
  SHORT_BREAK = 'SHORT_BREAK',
  LONG_BREAK = 'LONG_BREAK',
}

export type CompletedSession = {
  goal: string;
  duration: number; // in seconds
  completedAt: Date;
  sessionType: PomodoroSessionType; // Type of session
  taskId?: string; // Optional task ID if associated with a task
  workspaceId?: string; // Optional workspace ID if associated with a workspace
};

interface PomodoroState {
  isRunning: boolean;
  isPaused: boolean;
  currentTime: number; // in seconds
  sessionTime: number; // in minutes
  breakTime: number; // in minutes
  longBreakTime: number; // in minutes
  currentSessionType: PomodoroSessionType; // Current type of session
  sessionsUntilLongBreak: number; // Number of focus sessions until a long break
  completedFocusSessions: number; // Counter for completed focus sessions
  currentGoal: string;
  currentTaskId: string | null; // Current task ID if associated with a task
  currentWorkspaceId: string | null; // Current workspace ID if associated with a workspace
  soundsEnabled: boolean;
  activeSounds: Record<string, { volume: number; playing: boolean }>;
  allSoundsPaused: boolean; // Track global sound pause state
  soundsBeforePause: Record<string, boolean>; // Store sound states before pause
  completedSessions: CompletedSession[];
  isInitialized: boolean; // Track if sessions have been loaded from DB
  selectedTheme: ThemePreset;

  // Actions
  setIsRunning: (isRunning: boolean) => void;
  setIsPaused: (isPaused: boolean) => void;
  setCurrentTime: (currentTime: number) => void;
  setSessionTime: (sessionTime: number) => void;
  setBreakTime: (breakTime: number) => void;
  setLongBreakTime: (longBreakTime: number) => void;
  setCurrentSessionType: (sessionType: PomodoroSessionType) => void;
  setCurrentGoal: (currentGoal: string) => void;
  setCurrentTaskId: (taskId: string | null) => void;
  setCurrentWorkspaceId: (workspaceId: string | null) => void;
  startTaskSession: (
    taskTitle: string,
    taskId: string,
    workspaceId: string
  ) => void;
  startBreak: (isLongBreak?: boolean) => void;
  completeSession: () => void;
  setSoundsEnabled: (soundsEnabled: boolean) => void;
  setActiveSounds: (
    activeSounds: Record<string, { volume: number; playing: boolean }>
  ) => void;
  updateSoundVolume: (soundId: string, volume: number) => void;
  toggleSoundPlaying: (soundId: string) => void;
  toggleAllSounds: () => void; // Toggle all sounds at once
  addCompletedSession: (session: CompletedSession) => void;
  clearCompletedSessions: () => void;
  loadSessionsFromDB: () => Promise<void>; // Load sessions from database
  setCompletedSessions: (sessions: CompletedSession[]) => void; // Set sessions directly
  setSelectedTheme: (theme: ThemePreset) => void;
}

const createThemePreset = (
  base: BaseThemePreset,
  isDark: boolean
): ThemePreset => ({
  ...base,
  progressGradient: isDark
    ? base.progressGradientDark
    : base.progressGradientLight,
});

// Get initial theme mode (SSR-safe)
const getInitialIsDark = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('theme') === 'dark';
};

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => {
      // Get initial dark mode state
      const isDark = getInitialIsDark();

      // Create default preset
      const defaultPreset = createThemePreset(themePresets[0], isDark);
      return {
        isRunning: false,
        isPaused: false,
        currentTime: 25 * 60, // 25 minutes in seconds
        sessionTime: 25, // 25 minutes
        breakTime: 5, // 5 minutes
        longBreakTime: 15, // 15 minutes
        currentSessionType: PomodoroSessionType.FOCUS,
        sessionsUntilLongBreak: 4, // Default to long break after 4 focus sessions
        completedFocusSessions: 0,
        currentGoal: '',
        currentTaskId: null,
        currentWorkspaceId: null,
        soundsEnabled: false,
        activeSounds: {
          rain: { volume: 50, playing: false },
          thunder: { volume: 30, playing: false },
          fire: { volume: 40, playing: false },
          stream: { volume: 40, playing: false },
          river: { volume: 40, playing: false },
          sea: { volume: 40, playing: false },
          wind: { volume: 30, playing: false },
          crickets: { volume: 30, playing: false },
        },
        allSoundsPaused: true,
        soundsBeforePause: {},
        completedSessions: [],
        isInitialized: false,
        selectedTheme: defaultPreset,

        setSelectedTheme: (theme) => set({ selectedTheme: theme }),
        setIsRunning: (isRunning) => set({ isRunning }),
        setIsPaused: (isPaused) => set({ isPaused }),
        setCurrentTime: (currentTime) => set({ currentTime }),
        setSessionTime: (sessionTime) => set({ sessionTime }),
        setBreakTime: (breakTime) => set({ breakTime }),
        setLongBreakTime: (longBreakTime) => set({ longBreakTime }),
        setCurrentSessionType: (sessionType) =>
          set({ currentSessionType: sessionType }),
        setCurrentGoal: (currentGoal) => set({ currentGoal }),
        setCurrentTaskId: (taskId) => set({ currentTaskId: taskId }),
        setCurrentWorkspaceId: (workspaceId) =>
          set({ currentWorkspaceId: workspaceId }),

        // Start a Pomodoro session for a specific task
        startTaskSession: (taskTitle, taskId, workspaceId) => {
          set({
            currentGoal: taskTitle,
            currentTaskId: taskId,
            currentWorkspaceId: workspaceId,
            currentTime: get().sessionTime * 60,
            currentSessionType: PomodoroSessionType.FOCUS,
            isRunning: true,
            isPaused: false,
          });
        },

        // Start a break (short or long)
        startBreak: (isLongBreak = false) => {
          const breakDuration = isLongBreak
            ? get().longBreakTime
            : get().breakTime;
          set({
            currentTime: breakDuration * 60,
            currentSessionType: isLongBreak
              ? PomodoroSessionType.LONG_BREAK
              : PomodoroSessionType.SHORT_BREAK,
            isRunning: true,
            isPaused: false,
          });
        },

        // Complete the current session and handle session counting
        completeSession: () => {
          const {
            currentSessionType,
            completedFocusSessions,
            sessionsUntilLongBreak,
          } = get();

          // If completing a focus session, increment the counter
          if (currentSessionType === PomodoroSessionType.FOCUS) {
            const newCompletedSessions = completedFocusSessions + 1;
            const shouldTakeLongBreak =
              newCompletedSessions % sessionsUntilLongBreak === 0;

            set({ completedFocusSessions: newCompletedSessions });

            // Automatically start the appropriate break
            get().startBreak(shouldTakeLongBreak);
          } else {
            // If completing a break, start a new focus session
            set({
              currentTime: get().sessionTime * 60,
              currentSessionType: PomodoroSessionType.FOCUS,
              isRunning: false,
              isPaused: false,
            });
          }
        },

        setSoundsEnabled: (soundsEnabled) => set({ soundsEnabled }),
        setActiveSounds: (activeSounds) => set({ activeSounds }),

        updateSoundVolume: (soundId, volume) =>
          set((state) => ({
            activeSounds: {
              ...state.activeSounds,
              [soundId]: {
                ...state.activeSounds[soundId],
                volume,
              },
            },
          })),

        toggleSoundPlaying: (soundId) =>
          set((state) => {
            const currentSound = state.activeSounds[soundId];
            if (!currentSound) return state;

            const newPlaying = !currentSound.playing;

            // If we're turning on a sound and all sounds are paused,
            // we should unpause everything
            if (newPlaying && state.allSoundsPaused) {
              return {
                activeSounds: {
                  ...state.activeSounds,
                  [soundId]: {
                    ...currentSound,
                    playing: true,
                  },
                },
                allSoundsPaused: false, // Reset the global pause state
                soundsBeforePause: {}, // Clear the saved state
              };
            }

            return {
              activeSounds: {
                ...state.activeSounds,
                [soundId]: {
                  ...currentSound,
                  playing: newPlaying,
                },
              },
            };
          }),

        toggleAllSounds: () =>
          set((state) => {
            if (state.allSoundsPaused) {
              // Resume sounds that were playing before pause
              const updatedSounds = { ...state.activeSounds };
              Object.keys(state.soundsBeforePause).forEach((soundId) => {
                if (state.soundsBeforePause[soundId]) {
                  updatedSounds[soundId] = {
                    ...updatedSounds[soundId],
                    playing: true,
                  };
                }
              });

              return {
                activeSounds: updatedSounds,
                allSoundsPaused: false,
                soundsBeforePause: {},
              };
            } else {
              // Pause all currently playing sounds and store their state
              const soundsBeforePause: Record<string, boolean> = {};
              const updatedSounds = { ...state.activeSounds };

              Object.entries(state.activeSounds).forEach(
                ([soundId, settings]) => {
                  soundsBeforePause[soundId] = settings.playing;
                  if (settings.playing) {
                    updatedSounds[soundId] = {
                      ...settings,
                      playing: false,
                    };
                  }
                }
              );

              return {
                activeSounds: updatedSounds,
                allSoundsPaused: true,
                soundsBeforePause,
              };
            }
          }),

        addCompletedSession: (session) => {
          // Get current task and workspace IDs
          const { currentTaskId, currentWorkspaceId, currentSessionType } =
            get();

          // Create a new session object with task and workspace IDs
          const sessionWithContext: CompletedSession = {
            ...session,
            sessionType: session.sessionType || currentSessionType, // Use provided type or current type
            taskId: currentTaskId || undefined,
            workspaceId: currentWorkspaceId || undefined,
          };

          // Add to local state
          set((state) => ({
            completedSessions: [sessionWithContext, ...state.completedSessions],
          }));

          // Save to database (fire and forget)
          saveCompletedSession(
            sessionWithContext,
            currentWorkspaceId || undefined,
            currentTaskId || undefined
          ).catch((error) => {
            console.error('Failed to save session to database:', error);
          });
        },

        clearCompletedSessions: () => {
          // Clear local state
          set({ completedSessions: [] });

          // Clear from database (fire and forget)
          clearCompletedSessionsAction().catch((error) => {
            console.error('Failed to clear sessions from database:', error);
          });
        },

        // Load sessions from database
        loadSessionsFromDB: async () => {
          try {
            const { success, data } = await getCompletedSessions();

            if (success && data) {
              // Transform dates from strings back to Date objects
              const sessions = data.map((session) => ({
                ...session,
                completedAt: new Date(session.completedAt),
              }));

              // Only update if we have sessions from the database
              if (sessions.length > 0) {
                set({
                  completedSessions: sessions,
                  isInitialized: true,
                });
              } else {
                set({ isInitialized: true });
              }
            } else {
              set({ isInitialized: true });
            }
          } catch (error) {
            console.error('Failed to load sessions from database:', error);
            set({ isInitialized: true });
          }
        },

        // Set completed sessions directly (used when merging local and DB data)
        setCompletedSessions: (sessions) =>
          set({ completedSessions: sessions }),
      };
    },
    {
      name: 'pomodoro-storage',
    }
  )
);

// Helper function to initialize the store with database data
// This should be called once when the app loads
export const initializePomodoroStore = async () => {
  const store = usePomodoroStore.getState();

  // Only load from DB if not already initialized
  if (!store.isInitialized) {
    await store.loadSessionsFromDB();
  }
};
