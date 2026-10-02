'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Volume2,
  Settings,
  BarChart,
  X,
  Bell,
  BellOff,
  ChevronUp,
  Check,
  Coffee,
  Maximize,
  Minimize,
  EyeOff,
  Eye,
  Sun,
  Moon,
  Palette,
  Music,
  Target,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  usePomodoroStore,
  initializePomodoroStore,
  PomodoroSessionType,
} from '@/store/pomodoro-store';
import { PomodoroHistory } from './pomodoro-history';
import { SoundMixer } from './sound-mixer';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { sounds } from '@/constants/sound-constants';
import TimerCircle from './timer-circle';
import { useThemePresets } from '@/hooks/use-theme-presets';
import useIsMobile from '@/hooks/use-mobile';

export default function PomodoroTimer() {
  const {
    isRunning,
    isPaused,
    currentTime,
    sessionTime,
    breakTime,
    currentGoal,
    currentTaskId,
    currentWorkspaceId,
    soundsEnabled,
    setIsRunning,
    setIsPaused,
    setCurrentTime,
    setSessionTime,
    setBreakTime,
    setCurrentGoal,
    setCurrentTaskId,
    setCurrentWorkspaceId,
    setSoundsEnabled,
    addCompletedSession,
    completedSessions,
    activeSounds,
    allSoundsPaused,
    toggleAllSounds,
    selectedTheme,
    setSelectedTheme,
  } = usePomodoroStore();

  const themePresets = useThemePresets();

  const [isSession, setIsSession] = useState(true);
  const [progress, setProgress] = useState(100);
  const [activeTab, setActiveTab] = useState<string>('timer');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hideDistractions, setHideDistractions] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [showSoundMixer, setShowSoundMixer] = useState(false);
  const [customPresets, setCustomPresets] = useState<
    { id: string; name: string; sessionTime: number; breakTime: number }[]
  >([
    { id: 'preset-1', name: 'Short Focus', sessionTime: 25, breakTime: 5 },
    { id: 'preset-2', name: 'Long Focus', sessionTime: 45, breakTime: 10 },
    { id: 'preset-3', name: 'Short Sprint', sessionTime: 15, breakTime: 3 },
  ]);
  const [newPresetName, setNewPresetName] = useState('');
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const goalInputRef = useRef<HTMLInputElement>(null);
  const timerContainerRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme } = useTheme();

  // Refs for audio elements
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  // Initialize audio elements
  useEffect(() => {
    // Use imported sounds array from sound-mixer.tsx
    sounds.forEach((sound) => {
      if (!audioRefs.current[sound.id]) {
        const audio = new Audio(sound.path);
        audio.loop = true;
        audioRefs.current[sound.id] = audio;
      }
    });

    return () => {
      // Clean up audio elements on component unmount
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, []);

  // Update audio playback and volume based on activeSounds state
  useEffect(() => {
    if (allSoundsPaused) return; // Skip updates if all sounds are paused globally

    Object.entries(activeSounds).forEach(([soundId, settings]) => {
      const audio = audioRefs.current[soundId];
      if (audio) {
        if (settings.playing) {
          audio.volume = settings.volume / 100;
          audio.play().catch((error) => {
            console.error(`Error playing ${soundId}:`, error);
          });
        } else {
          audio.pause();
        }
      }
    });
  }, [activeSounds, allSoundsPaused]);

  // Handle global pause/resume state
  useEffect(() => {
    // When global pause state changes, update all audio elements
    if (allSoundsPaused) {
      // Pause all audio elements when globally paused
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
        }
      });
    } else {
      // Resume only the sounds that should be playing
      Object.entries(activeSounds).forEach(([soundId, settings]) => {
        const audio = audioRefs.current[soundId];
        if (audio && settings.playing) {
          audio.volume = settings.volume / 100;
          audio.play().catch((error) => {
            console.error(`Error resuming ${soundId}:`, error);
          });
        }
      });
    }
  }, [allSoundsPaused, activeSounds]);

  // Initialize timer if needed
  useEffect(() => {
    // Ensure currentTime is valid on component mount
    if (
      typeof currentTime !== 'number' ||
      isNaN(currentTime) ||
      currentTime <= 0
    ) {
      setCurrentTime(sessionTime * 60);
    }

    // Resume timer if it was running before page refresh
    if (isRunning) {
      // Save the start time to calculate elapsed time accurately
      const startTime = Date.now();
      const initialTime = currentTime;

      // Start a new interval with the current time
      intervalRef.current = setInterval(() => {
        // Calculate elapsed seconds since interval started
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const updatedTime = Math.max(0, initialTime - elapsedSeconds);

        setCurrentTime(updatedTime);

        // Update progress
        const totalTime = isSession ? sessionTime * 60 : breakTime * 60;
        const newProgress = (updatedTime / totalTime) * 100;
        setProgress(newProgress);

        if (updatedTime <= 0) {
          // Timer completed
          handleTimerCompletion();
        }
      }, 1000);
    } else if (isPaused) {
      // If timer was paused, keep it paused but don't start interval
      setIsPaused(true);
      setIsRunning(false);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    currentTime,
    sessionTime,
    setCurrentTime,
    isRunning,
    isPaused,
    isSession,
    breakTime,
  ]);

  const isMobile = useIsMobile();

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    // Ensure seconds is a valid number
    if (typeof seconds !== 'number' || isNaN(seconds)) {
      return '00:00';
    }

    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.max(0, seconds) % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Add 5 minutes to the current timer
  const extendTimer = () => {
    const additionalTime = 5 * 60; // 5 minutes in seconds
    const newTime = currentTime + additionalTime;

    // Update the total session/break time to reflect the extension
    if (isSession) {
      setSessionTime(sessionTime + 5);
    } else {
      setBreakTime(breakTime + 5);
    }

    setCurrentTime(newTime);

    // If timer is running, we need to restart it with the new time
    if (isRunning) {
      // Clear existing interval
      clearInterval(intervalRef.current!);

      // Save the start time to calculate elapsed time accurately
      const startTime = Date.now();
      const initialTime = newTime;

      // Start a new interval with the extended time
      intervalRef.current = setInterval(() => {
        // Calculate elapsed seconds since interval started
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const updatedTime = Math.max(0, initialTime - elapsedSeconds);

        setCurrentTime(updatedTime);

        // Update progress
        const totalTime = isSession ? sessionTime * 60 : breakTime * 60;
        const newProgress = (updatedTime / totalTime) * 100;
        setProgress(newProgress);

        if (updatedTime <= 0) {
          // Timer completed
          handleTimerCompletion();
        }
      }, 1000);
    }

    // Recalculate progress
    const totalTime = isSession ? (sessionTime + 5) * 60 : (breakTime + 5) * 60;
    const newProgress = (newTime / totalTime) * 100;
    setProgress(newProgress);

    toast.success(
      `Added 5 minutes to your ${isSession ? 'session' : 'break'}!`,
      {
        duration: 2000,
      }
    );
  };

  // Calculate progress percentage
  useEffect(() => {
    const totalTime = isSession ? sessionTime * 60 : breakTime * 60;
    const progressPercent = (currentTime / totalTime) * 100;
    setProgress(progressPercent);
  }, [currentTime, sessionTime, breakTime, isSession]);

  // Add a function to end the current session early
  const endCurrentSession = () => {
    // Clear any existing interval
    clearInterval(intervalRef.current!);

    // If it's a focus session, add it to completed sessions
    if (isSession) {
      // Calculate how much time was actually used
      const totalSessionTime = sessionTime * 60;
      const timeUsed = totalSessionTime - currentTime;
      const minutesUsed = Math.ceil(timeUsed / 60);

      // Only count if at least 1 minute was used
      if (minutesUsed >= 1) {
        addCompletedSession({
          goal: currentGoal || 'Focus session',
          duration: timeUsed, // Store duration in seconds as expected by the store
          completedAt: new Date(),
          sessionType: PomodoroSessionType.FOCUS,
          taskId: currentTaskId || undefined,
          workspaceId: currentWorkspaceId || undefined,
        });

        // Show completion notification
        toast.success('Session ended early and saved to your history!', {
          duration: 3000,
        });
      } else {
        toast.info('Session was too short to be recorded', { duration: 3000 });
      }
    } else {
      toast.info('Break ended early', { duration: 3000 });
    }

    // Reset to a new focus session
    setIsSession(true);
    setCurrentTime(sessionTime * 60);
    setProgress(0);
    setIsRunning(false);
    setIsPaused(false);
  };

  const startTimer = () => {
    if (isRunning || isPaused) return;

    // Clear any existing interval to prevent multiple intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set initial state
    setIsRunning(true);
    setIsPaused(false);

    // If timer was reset or is at 0, initialize it with the session time
    if (currentTime === 0) {
      const newTime = isSession ? sessionTime * 60 : breakTime * 60;
      setCurrentTime(newTime);
    }

    // Save the start time to calculate elapsed time accurately
    const startTime = Date.now();
    const initialTime = currentTime;

    // Start the interval
    intervalRef.current = setInterval(() => {
      // Calculate elapsed seconds since interval started
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      const newTime = Math.max(0, initialTime - elapsedSeconds);

      setCurrentTime(newTime);

      // Update progress
      const totalTime = isSession ? sessionTime * 60 : breakTime * 60;
      const newProgress = ((totalTime - newTime) / totalTime) * 100;
      setProgress(newProgress);

      if (newTime <= 0) {
        // Timer completed
        handleTimerCompletion();
      }
    }, 1000);
  };

  const pauseTimer = () => {
    if (!isRunning) return;

    clearInterval(intervalRef.current!);
    setIsRunning(false);
    setIsPaused(true);

    // Optionally pause all sounds when timer is paused
    if (anySoundPlaying && !allSoundsPaused) {
      toggleAllSounds();
    }
  };

  const resumeTimer = () => {
    if (!isPaused) return;

    // Set state
    setIsRunning(true);
    setIsPaused(false);

    // Save the start time to calculate elapsed time accurately
    const startTime = Date.now();
    const initialTime = currentTime;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start a new interval
    intervalRef.current = setInterval(() => {
      // Calculate elapsed seconds since interval started
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      const newTime = Math.max(0, initialTime - elapsedSeconds);

      setCurrentTime(newTime);

      // Update progress
      const totalTime = isSession ? sessionTime * 60 : breakTime * 60;
      const newProgress = (newTime / totalTime) * 100;
      setProgress(newProgress);

      if (newTime <= 0) {
        // Timer completed
        handleTimerCompletion();
      }
    }, 1000);

    // Resume sounds if they were paused with the timer
    if (allSoundsPaused) {
      toggleAllSounds();
    }
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current!);

    const newTime = isSession ? sessionTime * 60 : breakTime * 60;
    setCurrentTime(newTime);
    setProgress(0);
    setIsRunning(false);
    setIsPaused(false);
  };

  // Extract timer completion logic to a separate function
  const handleTimerCompletion = () => {
    clearInterval(intervalRef.current!);

    // Play sound notification
    if (soundsEnabled) {
      const audio = new Audio('/sounds/notification.mp3');
      audio.play().catch((err) => console.error('Error playing sound:', err));
    }

    // Show toast notification using Sonner
    toast.success(
      isSession
        ? 'Session completed! Time for a break.'
        : 'Break completed! Ready to focus again?',
      { duration: 4000 }
    );

    // Switch between session and break
    if (isSession) {
      // Session completed, switch to break
      setIsSession(false);
      const breakSeconds = breakTime * 60;
      setCurrentTime(breakSeconds);

      // Add completed session to history with correct structure
      addCompletedSession({
        goal: currentGoal || 'Focus session',
        duration: sessionTime * 60, // Store duration in seconds as expected by the store
        completedAt: new Date(),
        sessionType: PomodoroSessionType.FOCUS,
        taskId: currentTaskId || undefined,
        workspaceId: currentWorkspaceId || undefined,
      });

      // Show notification to start break using Sonner
      toast('Break Time!', {
        description: 'Your focus session is complete. Take a break!',
        action: {
          label: 'Start Break',
          onClick: () => startTimer(),
        },
      });
    } else {
      // Break completed, switch to session and increment completed sessions
      setIsSession(true);
      const sessionSeconds = sessionTime * 60;
      setCurrentTime(sessionSeconds);

      // Add completed session to history with correct structure
      addCompletedSession({
        goal: currentGoal || 'Break',
        duration: breakTime * 60, // Store duration in seconds as expected by the store
        completedAt: new Date(),
        sessionType:
          breakTime > 5
            ? PomodoroSessionType.LONG_BREAK
            : PomodoroSessionType.SHORT_BREAK,
        taskId: currentTaskId || undefined,
        workspaceId: currentWorkspaceId || undefined,
      });

      // Show notification to start new session using Sonner
      toast('Break Complete!', {
        description: 'Ready to start a new focus session?',
        action: {
          label: 'Start Session',
          onClick: () => startTimer(),
        },
      });
    }

    // Reset timer state
    setIsRunning(false);
    setIsPaused(false);
    setProgress(0);
  };

  // Check if any sound is playing
  const anySoundPlaying = Object.values(activeSounds).some(
    (sound) => sound.playing
  );

  // Count active sounds
  const activeCount = Object.values(activeSounds).filter(
    (sound) => sound.playing
  ).length;

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      if (timerContainerRef.current?.requestFullscreen) {
        timerContainerRef.current.requestFullscreen().catch((err) => {
          console.error(
            `Error attempting to enable fullscreen: ${err.message}`
          );
        });
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
        setIsFullscreen(false);
      }
    }
  }, []);

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  // Prevent sounds from stopping when popover closes
  const handleSoundMixerChange = (open: boolean) => {
    setShowSoundMixer(open);
    // No need to stop sounds when popover closes
  };

  // Handle toggling all sounds from the footer
  const handleToggleAllSounds = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleAllSounds();
  };

  // Initialize store with database data on component mount
  useEffect(() => {
    initializePomodoroStore();
  }, []);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleSkip = () => {
    if (isRunning) {
      pauseTimer();
    }

    // If skipping a session, add it to completed sessions with actual time used
    if (isSession) {
      const timeUsed = sessionTime * 60 - currentTime;
      if (timeUsed > 0) {
        // Only add if some time was actually used
        addCompletedSession({
          goal: currentGoal || 'Focus session',
          duration: timeUsed, // Store duration in seconds as expected by the store
          completedAt: new Date(),
          sessionType: PomodoroSessionType.FOCUS,
          taskId: currentTaskId || undefined,
          workspaceId: currentWorkspaceId || undefined,
        });

        // Show completion notification
        toast.success('Session skipped but time recorded', {
          duration: 3000,
        });
      }
    } else {
      // If skipping a break, add it to completed sessions with actual time used
      const timeUsed = breakTime * 60 - currentTime;
      if (timeUsed > 0) {
        // Only add if some time was actually used
        addCompletedSession({
          goal: currentGoal || 'Break',
          duration: timeUsed, // Store duration in seconds as expected by the store
          completedAt: new Date(),
          sessionType:
            breakTime > 5
              ? PomodoroSessionType.LONG_BREAK
              : PomodoroSessionType.SHORT_BREAK,
          taskId: currentTaskId || undefined,
          workspaceId: currentWorkspaceId || undefined,
        });
      }
    }
  };

  return (
    <div
      ref={timerContainerRef}
      className={`w-full h-full flex flex-col transition-all duration-500 ${isFullscreen ? 'h-screen' : ''} ${hideDistractions ? 'bg-background/95' : ''}`}
    >
      <Tabs
        defaultValue='timer'
        value={activeTab}
        onValueChange={setActiveTab}
        className={`w-full h-[100dvh] flex flex-col ${hideDistractions ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}
      >
        <div className='flex justify-between items-center border-b bg-background backdrop-blur-sm'>
          <TabsList variant='line'>
            <TabsTrigger value='timer' className='inline-flex gap-2 group'>
              <Clock className='mr-2 h-4 w-4' />
              Timer
            </TabsTrigger>
            <TabsTrigger value='history' className='inline-flex gap-2 group'>
              <BarChart className='mr-2 h-4 w-4' />
              History
            </TabsTrigger>
            <TabsTrigger value='settings' className='inline-flex gap-2 group'>
              <Settings className='mr-2 h-4 w-4' />
              Settings
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='timer' className='h-full'>
          <Card className='shadow-xl border-0 flex-1 flex flex-col relative bg-gradient-to-br from-primary/5 via-background to-background h-full rounded-none'>
            <CardHeader className='pb-2 relative z-10 px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 border-b border-border/10 flex-shrink-0'>
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2'>
                <div>
                  <CardTitle className='text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-foreground to-foreground/70'>
                    {isSession ? 'Focus Session' : 'Break Time'}
                  </CardTitle>
                  <CardDescription className='text-sm sm:text-base'>
                    {isSession
                      ? 'Stay focused on your current task'
                      : 'Take a moment to relax and recharge'}
                  </CardDescription>
                </div>
                <Badge
                  variant={isSession ? 'default' : 'secondary'}
                  className='transition-all duration-300 text-xs sm:text-sm px-3 py-1 shadow-md rounded-full'
                >
                  {isSession ? 'Focus' : 'Break'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className='relative px-4 sm:px-6 md:px-8 flex-grow overflow-auto'>
              <div className='flex flex-col gap-6 sm:gap-8 items-center justify-center py-4'>
                {/* Timer display */}
                <div className='flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative'>
                  <div className='w-full max-w-md mx-auto flex flex-col items-center'>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className='flex flex-col items-center'
                    >
                      <div className='relative flex flex-col items-center'>
                        {/* Timer circle */}

                        <TimerCircle
                          isSession={isSession}
                          selectedTheme={selectedTheme}
                          progress={progress}
                          formatTime={formatTime}
                          currentTime={currentTime}
                          sessionTime={sessionTime}
                          breakTime={breakTime}
                        />

                        {/* Goal input */}
                        <div className='flex flex-col items-center justify-center space-y-4 w-full'>
                          <div className='relative flex w-full flex-col items-center'>
                            <div className='mb-2 w-full block px-4 sm:px-36'>
                              <div className='flex items-center justify-center'>
                                {currentTaskId && (
                                  <div className='flex items-center pr-2'>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant='ghost'
                                            size='icon'
                                            className='h-6 w-6 p-0 text-primary hover:text-primary/80 transition-colors duration-200 group'
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              e.preventDefault();
                                            }}
                                          >
                                            <Target className='h-4 w-4 group-hover:scale-110 transition-transform duration-200' />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent
                                          side='bottom'
                                          className='p-2'
                                        >
                                          <div className='text-xs space-y-1'>
                                            <p className='font-medium'>
                                              Task linked
                                            </p>
                                            <p className='text-muted-foreground text-[10px] truncate max-w-[150px]'>
                                              {currentGoal}
                                            </p>
                                            <Button
                                              variant='ghost'
                                              size='sm'
                                              className='mt-1 h-6 w-full px-2 py-0 text-xs hover:bg-destructive/10 hover:text-destructive transition-colors duration-200'
                                              onClick={() => {
                                                setCurrentTaskId(null);
                                                setCurrentWorkspaceId(null);
                                              }}
                                            >
                                              <X className='mr-1 h-3 w-3' />
                                              Unlink
                                            </Button>
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                )}
                                <Input
                                  ref={goalInputRef}
                                  type='text'
                                  placeholder='What are you working on?'
                                  value={currentGoal}
                                  onChange={(e) =>
                                    setCurrentGoal(e.target.value)
                                  }
                                  className='w-full rounded-md border-none bg-background/50 text-center text-xs sm:text-md font-medium transition-all duration-200 focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:ring-offset-0'
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className='inline-flex sm:flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6 w-full'>
                          {!isRunning && !isPaused ? (
                            <Button
                              variant='default'
                              size='lg'
                              className='flex items-center gap-1 sm:gap-2 shadow-md transition-all duration-200 min-w-[80px] sm:min-w-[90px] bg-primary/90 hover:bg-primary hover:shadow-lg group'
                              onClick={startTimer}
                            >
                              <Play className='h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 group-hover:scale-110' />
                              <span className='hidden sm:inline'>Start</span>
                            </Button>
                          ) : isRunning ? (
                            <Button
                              variant='default'
                              size='lg'
                              className='flex items-center gap-1 sm:gap-2 shadow-md transition-all duration-200 min-w-[80px] sm:min-w-[90px] bg-primary/90 hover:bg-primary hover:shadow-lg group'
                              onClick={pauseTimer}
                            >
                              <Pause className='h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 group-hover:scale-110' />
                              <span className='hidden sm:inline'>Pause</span>
                            </Button>
                          ) : (
                            <Button
                              variant='default'
                              size='lg'
                              className='flex items-center gap-1 sm:gap-2 shadow-md transition-all duration-200 min-w-[80px] sm:min-w-[90px] bg-primary/90 hover:bg-primary hover:shadow-lg group'
                              onClick={resumeTimer}
                            >
                              <Play className='h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 group-hover:scale-110' />
                              <span className='hidden sm:inline'>Resume</span>
                            </Button>
                          )}

                          <Button
                            variant='outline'
                            size='lg'
                            className='flex items-center gap-1 sm:gap-2 min-w-[80px] sm:min-w-[90px] border-border/50 hover:bg-background/80 transition-all duration-200 hover:shadow-sm group'
                            onClick={resetTimer}
                          >
                            <RotateCcw className='h-4 w-4 transition-transform duration-200 group-hover:rotate-12' />
                            <span className='hidden sm:inline'>Reset</span>
                          </Button>

                          <Button
                            variant='outline'
                            size='lg'
                            className='flex items-center gap-1 sm:gap-2 min-w-[80px] sm:min-w-[90px] border-border/50 hover:bg-background/80 transition-all duration-200 hover:shadow-sm group'
                            onClick={extendTimer}
                          >
                            <ChevronUp className='h-4 w-4 transition-transform duration-200 group-hover:translate-y-[-2px]' />
                            <span className='hidden sm:inline'>+5 min</span>
                          </Button>

                          {/* Only show the end session button if timer is running or paused */}
                          {(isRunning || isPaused) && (
                            <Button
                              variant='outline'
                              size='lg'
                              className='flex items-center gap-1 sm:gap-2 min-w-[80px] sm:min-w-[90px] border-border/50 hover:bg-destructive/10 hover:border-destructive/30 transition-all duration-200 hover:shadow-sm group'
                              onClick={endCurrentSession}
                            >
                              <X className='h-4 w-4 transition-transform duration-200 group-hover:rotate-[-12deg]' />
                              <span className='hidden sm:inline'>
                                End Session
                              </span>
                            </Button>
                          )}
                        </div>

                        <div className='flex justify-center overflow-x-auto no-scrollbar pb-2 mt-2 sm:mt-4 w-full'>
                          {customPresets.map((preset) => (
                            <Button
                              key={preset.id}
                              variant='outline'
                              size='sm'
                              className='px-2 py-1 sm:px-3 sm:py-1 h-auto text-xs border-border/50 bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all duration-200 whitespace-nowrap flex-shrink-0 mr-2 last:mr-0'
                              onClick={() => {
                                setSessionTime(preset.sessionTime);
                                setBreakTime(preset.breakTime);
                                clearInterval(intervalRef.current!);
                                setCurrentTime(
                                  isSession
                                    ? preset.sessionTime * 60
                                    : preset.breakTime * 60
                                );
                                setProgress(0);
                                setIsRunning(false);
                                setIsPaused(false);
                              }}
                              disabled={isRunning}
                            >
                              <span className='sm:hidden'>
                                {preset.sessionTime}m/{preset.breakTime}m
                              </span>
                              <span className='hidden sm:inline'>
                                {preset.name} ({preset.sessionTime}m/
                                {preset.breakTime}m)
                              </span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className='p-0 fixed sm:sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t pb-[env(safe-area-inset-bottom)]'>
              <div className='w-full border-t bg-background/80 backdrop-blur-sm flex-shrink-0'>
                <div className='flex justify-between py-4 px-6 md:px-8'>
                  <div className='flex items-center space-x-2'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 rounded-full'
                            onClick={toggleTheme}
                          >
                            {theme === 'dark' ? (
                              <Sun className='h-4 w-4' />
                            ) : (
                              <Moon className='h-4 w-4' />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Toggle theme</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 rounded-full'
                            onClick={() => setShowThemes(!showThemes)}
                          >
                            <Palette className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Change timer theme</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 rounded-full'
                            onClick={() =>
                              setHideDistractions(!hideDistractions)
                            }
                          >
                            {hideDistractions ? (
                              <Eye className='h-4 w-4' />
                            ) : (
                              <EyeOff className='h-4 w-4' />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {hideDistractions
                              ? 'Show interface'
                              : 'Hide distractions'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Popover
                      open={showSoundMixer}
                      onOpenChange={handleSoundMixerChange}
                    >
                      <PopoverTrigger asChild>
                        <div className='flex items-center group'>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className={`h-8 w-8 rounded-full transition-all duration-200 ${anySoundPlaying || allSoundsPaused ? 'text-primary hover:text-primary/90' : 'hover:text-foreground/80'}`}
                                >
                                  <Music className='h-4 w-4 transition-transform duration-200 group-hover:scale-110' />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Sound mixer</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          {(anySoundPlaying || allSoundsPaused) && (
                            <div className='flex items-center ml-1'>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant='ghost'
                                      size='icon'
                                      className={`h-8 w-8 rounded-full transition-all duration-200 ${allSoundsPaused ? 'text-green-500 hover:text-green-600' : 'text-primary hover:bg-primary/10'}`}
                                      onClick={handleToggleAllSounds}
                                    >
                                      {allSoundsPaused ? (
                                        <Play className='h-4 w-4 transition-transform duration-200 hover:scale-110' />
                                      ) : (
                                        <Pause className='h-4 w-4 transition-transform duration-200 hover:scale-110' />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      {allSoundsPaused
                                        ? 'Resume all sounds'
                                        : 'Pause all sounds'}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              {activeCount > 0 && (
                                <Badge
                                  variant='outline'
                                  className='ml-1 h-5 px-1 text-xs transition-all duration-200 hover:scale-105 bg-background/60 backdrop-blur-sm'
                                >
                                  {activeCount}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        className='w-80 p-0 shadow-lg border-border/30 bg-background/95 backdrop-blur-md'
                        align='start'
                        sideOffset={5}
                        disablePortal={!isMobile}
                      >
                        <div className='p-4'>
                          <SoundMixer audioRefs={audioRefs} />
                        </div>
                        <div className='border-t p-2 flex justify-end'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => setShowSoundMixer(false)}
                            className='text-xs transition-all duration-200 hover:bg-background/80'
                          >
                            Close
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='hidden sm:block h-8 w-8 rounded-full'
                            onClick={toggleFullscreen}
                          >
                            {isFullscreen ? (
                              <Minimize className='h-4 w-4' />
                            ) : (
                              <Maximize className='h-4 w-4' />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {isFullscreen
                              ? 'Exit fullscreen'
                              : 'Enter fullscreen'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 rounded-full'
                            onClick={() => setSoundsEnabled(!soundsEnabled)}
                          >
                            {soundsEnabled ? (
                              <Bell className='h-4 w-4' />
                            ) : (
                              <BellOff className='h-4 w-4' />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {soundsEnabled
                              ? 'Disable notification sounds'
                              : 'Enable notification sounds'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value='history' className='flex-grow overflow-auto'>
          <Card className='shadow-xl border-0 flex flex-col relative bg-gradient-to-br from-primary/5 via-background to-background h-full rounded-none'>
            <CardHeader className='flex-shrink-0'>
              <CardTitle className='text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary via-foreground to-foreground/70'>
                Session History
              </CardTitle>
              <CardDescription>
                Track your productivity and completed sessions
              </CardDescription>
            </CardHeader>
            <CardContent className='flex-grow overflow-auto pb-8'>
              <PomodoroHistory />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='settings' className='flex-grow overflow-auto'>
          <Card className='shadow-xl border-0 flex flex-col relative bg-gradient-to-br from-primary/5 via-background to-background h-full rounded-none'>
            <CardHeader className='flex-shrink-0'>
              <div className='flex justify-between items-center'>
                <div>
                  <CardTitle className='text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary via-foreground to-foreground/70'>
                    Timer Settings
                  </CardTitle>
                  <CardDescription>
                    Customize your Pomodoro experience
                  </CardDescription>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='outline'
                        size='sm'
                        className='flex items-center gap-1.5 bg-background/60 backdrop-blur-sm border-border/30 transition-all duration-200 hover:border-border/50'
                        onClick={() => {
                          setCustomPresets([
                            {
                              id: 'preset-1',
                              name: 'Short Focus',
                              sessionTime: 25,
                              breakTime: 5,
                            },
                            {
                              id: 'preset-2',
                              name: 'Long Focus',
                              sessionTime: 45,
                              breakTime: 10,
                            },
                            {
                              id: 'preset-3',
                              name: 'Short Sprint',
                              sessionTime: 15,
                              breakTime: 3,
                            },
                          ]);
                          toast.success('Presets reset to default', {
                            description: `Updated "${newPresetName}" with current timer settings`,
                          });
                        }}
                      >
                        <RotateCcw className='h-3.5 w-3.5' />
                        Reset Defaults
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset all presets to default values</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent className='overflow-auto pb-8'>
              <div className='space-y-6'>
                <div className='space-y-4'>
                  <h3 className='text-lg font-medium flex items-center'>
                    <Clock className='h-5 w-5 mr-2 text-primary' />
                    Timer Duration
                  </h3>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <div className='space-y-4 p-6 rounded-2xl border border-border/30 shadow-md bg-background/40 backdrop-blur-sm'>
                      <div className='flex justify-between items-center'>
                        <Label
                          htmlFor='session-time'
                          className='text-base flex items-center'
                        >
                          <Play className='h-4 w-4 mr-2 text-primary' />
                          Focus Session
                        </Label>
                        <Badge
                          variant='outline'
                          className='bg-background/60 backdrop-blur-sm rounded-full transition-all duration-200'
                        >
                          {sessionTime} min
                        </Badge>
                      </div>
                      <Slider
                        id='session-time'
                        min={5}
                        max={60}
                        step={5}
                        value={[sessionTime]}
                        onValueChange={(value) => {
                          setSessionTime(value[0]);
                          if (!isRunning && !isPaused && isSession) {
                            setCurrentTime(value[0] * 60);
                          }

                          // Update the active preset if in edit mode
                          if (editingPresetId) {
                            setCustomPresets(
                              customPresets.map((item) =>
                                item.id === editingPresetId
                                  ? { ...item, sessionTime: value[0] }
                                  : item
                              )
                            );
                          }
                        }}
                        disabled={isRunning || isPaused}
                        className='py-1'
                      />
                      <div className='flex justify-between text-xs text-muted-foreground'>
                        <span>5 min</span>
                        <span>30 min</span>
                        <span>60 min</span>
                      </div>
                    </div>

                    <div className='space-y-4 p-6 rounded-2xl border border-border/30 shadow-md bg-background/40 backdrop-blur-sm'>
                      <div className='flex justify-between items-center'>
                        <Label
                          htmlFor='break-time'
                          className='text-base flex items-center'
                        >
                          <Coffee className='h-4 w-4 mr-2 text-primary' />
                          Break Time
                        </Label>
                        <Badge
                          variant='outline'
                          className='bg-background/60 backdrop-blur-sm rounded-full transition-all duration-200'
                        >
                          {breakTime} min
                        </Badge>
                      </div>
                      <Slider
                        id='break-time'
                        min={1}
                        max={30}
                        step={1}
                        value={[breakTime]}
                        onValueChange={(value) => {
                          setBreakTime(value[0]);
                          if (!isRunning && !isPaused && !isSession) {
                            setCurrentTime(value[0] * 60);
                          }

                          // Update the active preset if in edit mode
                          if (editingPresetId) {
                            setCustomPresets(
                              customPresets.map((item) =>
                                item.id === editingPresetId
                                  ? { ...item, breakTime: value[0] }
                                  : item
                              )
                            );
                          }
                        }}
                        disabled={isRunning || isPaused}
                        className='py-1'
                      />
                      <div className='flex justify-between text-xs text-muted-foreground'>
                        <span>1 min</span>
                        <span>15 min</span>
                        <span>30 min</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className='bg-border/30' />

                <div className='space-y-4'>
                  <h3 className='text-lg font-medium flex items-center'>
                    <Target className='h-5 w-5 mr-2 text-primary' />
                    Timer Presets
                  </h3>

                  <div className='flex flex-col space-y-4'>
                    {customPresets.map((preset) => (
                      <div
                        key={preset.id}
                        className={`flex items-center justify-between p-4 rounded-2xl border bg-background/40 backdrop-blur-sm transition-all duration-200 hover:border-border/50 hover:shadow-sm ${
                          editingPresetId === preset.id
                            ? 'border-primary/50 shadow-sm'
                            : 'border-border/30 hover:border-border/50'
                        }`}
                      >
                        <div className='flex items-center space-x-3'>
                          {editingPresetId === preset.id ? (
                            <Input
                              type='text'
                              value={newPresetName}
                              onChange={(e) => setNewPresetName(e.target.value)}
                              className='bg-background/50 backdrop-blur-sm border-border/30 focus:border-primary/50 transition-all duration-200 text-sm h-8 w-[120px]'
                            />
                          ) : (
                            <Label
                              htmlFor={preset.id}
                              className='text-base font-medium'
                            >
                              {preset.name}
                            </Label>
                          )}
                          <Badge
                            variant='outline'
                            className='bg-background/60 backdrop-blur-sm rounded-full'
                          >
                            {editingPresetId === preset.id
                              ? `${sessionTime}m / ${breakTime}m`
                              : `${preset.sessionTime}m / ${preset.breakTime}m`}
                          </Badge>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='rounded-full h-8 w-8 transition-all duration-200 hover:bg-primary/10'
                                  onClick={() => {
                                    if (editingPresetId === preset.id) {
                                      // Save changes
                                      if (newPresetName.trim()) {
                                        setCustomPresets(
                                          customPresets.map((item) =>
                                            item.id === preset.id
                                              ? {
                                                  ...item,
                                                  name: newPresetName,
                                                  sessionTime: sessionTime,
                                                  breakTime: breakTime,
                                                }
                                              : item
                                          )
                                        );
                                        toast.success('Preset updated', {
                                          description: `Updated "${newPresetName}" with current timer settings`,
                                        });
                                      }
                                      setEditingPresetId(null);
                                      setNewPresetName('');
                                    } else {
                                      // Start editing - also apply the preset values to the sliders
                                      setEditingPresetId(preset.id);
                                      setNewPresetName(preset.name);
                                      setSessionTime(preset.sessionTime);
                                      setBreakTime(preset.breakTime);

                                      if (
                                        !isRunning &&
                                        !isPaused &&
                                        isSession
                                      ) {
                                        setCurrentTime(preset.sessionTime * 60);
                                      } else if (
                                        !isRunning &&
                                        !isPaused &&
                                        !isSession
                                      ) {
                                        setCurrentTime(preset.breakTime * 60);
                                      }
                                    }
                                  }}
                                >
                                  {editingPresetId === preset.id ? (
                                    <Check className='h-4 w-4' />
                                  ) : (
                                    <Settings className='h-4 w-4' />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {editingPresetId === preset.id
                                    ? 'Save changes'
                                    : 'Edit preset'}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className='bg-border/30' />

                <div className='space-y-4'>
                  <h3 className='text-lg font-medium flex items-center'>
                    <Bell className='h-5 w-5 mr-2 text-primary' />
                    Notifications
                  </h3>

                  <div className='flex items-center justify-between p-6 rounded-2xl border border-border/30 bg-background/40 backdrop-blur-sm transition-all duration-200 hover:border-border/50 hover:shadow-sm'>
                    <div className='space-y-0.5'>
                      <Label
                        htmlFor='sounds-enabled'
                        className='text-base flex items-center'
                      >
                        <Volume2 className='h-4 w-4 mr-2 text-primary' />
                        Sound Notifications
                      </Label>
                      <div className='text-sm text-muted-foreground'>
                        Play a sound when a session or break ends
                      </div>
                    </div>
                    <Switch
                      id='sounds-enabled'
                      checked={soundsEnabled}
                      onCheckedChange={setSoundsEnabled}
                      className='data-[state=checked]:bg-primary'
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <AnimatePresence mode='wait'>
        {showThemes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center'
            onClick={() => setShowThemes(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className='bg-card/90 backdrop-blur-md shadow-xl rounded-xl w-full max-w-2xl overflow-hidden border border-border/30'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='p-6 border-b border-border/10'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-xl font-semibold'>Choose Timer Theme</h2>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setShowThemes(false)}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              </div>

              <div className='p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[80vh] sm:max-h-[70vh]'>
                {themePresets.map((theme) => (
                  <motion.div
                    key={theme.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'relative overflow-hidden rounded-xl border border-border/30 shadow-md cursor-pointer h-36 sm:h-40 min-w-[90%] sm:min-w-0',
                      theme.background,
                      selectedTheme.id === theme.id &&
                        'ring-2 ring-primary ring-offset-2 ring-offset-background'
                    )}
                    onClick={() => {
                      setSelectedTheme(theme);
                      setShowThemes(false);
                      toast.success(`Theme changed to ${theme.name}`, {
                        position: 'top-center',
                      });
                    }}
                  >
                    {/* Wave animation for the progress circle */}
                    <div className='absolute inset-0 overflow-hidden'>
                      <svg
                        className='w-full h-full'
                        viewBox='0 0 100 100'
                        preserveAspectRatio='none'
                      >
                        <defs>
                          <linearGradient
                            id={`gradient-${theme.id}`}
                            x1='0%'
                            y1='0%'
                            x2='100%'
                            y2='100%'
                          >
                            <stop
                              offset='0%'
                              stopColor={theme.progressGradient
                                .split(',')[0]
                                .replace('linear-gradient(45deg, ', '')}
                            />
                            <stop
                              offset='100%'
                              stopColor={theme.progressGradient
                                .split(',')[1]
                                .replace(')', '')}
                            />
                          </linearGradient>
                        </defs>

                        {/* Background waves */}
                        <motion.path
                          d='M-50,80 Q-25,70 0,80 Q25,90 50,80 Q75,70 100,80 Q125,90 150,80 L150,100 L-50,100 Z'
                          fill={theme.wavesColor}
                          fillOpacity='0.3'
                          animate={{
                            d: [
                              'M-50,80 Q-25,70 0,80 Q25,90 50,80 Q75,70 100,80 Q125,90 150,80 L150,100 L-50,100 Z',
                              'M-50,80 Q-25,90 0,80 Q25,70 50,80 Q75,90 100,80 Q125,70 150,80 L150,100 L-50,100 Z',
                              'M-50,80 Q-25,70 0,80 Q25,90 50,80 Q75,70 100,80 Q125,90 150,80 L150,100 L-50,100 Z',
                            ],
                          }}
                          transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />

                        <motion.path
                          d='M-50,90 Q-25,80 0,90 Q25,100 50,90 Q75,80 100,90 Q125,100 150,90 L150,100 L-50,100 Z'
                          fill={theme.wavesColor}
                          fillOpacity='0.5'
                          animate={{
                            d: [
                              'M-50,90 Q-25,80 0,90 Q25,100 50,90 Q75,80 100,90 Q125,100 150,90 L150,100 L-50,100 Z',
                              'M-50,90 Q-25,100 0,90 Q25,80 50,90 Q75,100 100,90 Q125,80 150,90 L150,100 L-50,100 Z',
                              'M-50,90 Q-25,80 0,90 Q25,100 50,90 Q75,80 100,90 Q125,100 150,90 L150,100 L-50,100 Z',
                            ],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />
                      </svg>
                    </div>

                    {/* Theme info */}
                    <div className='absolute inset-0 p-4 flex flex-col justify-between'>
                      <div className='flex items-center space-x-2'>
                        <div className='bg-background/40 backdrop-blur-sm rounded-full p-2 shadow-sm'>
                          {theme.icon}
                        </div>
                        <span className='font-medium text-foreground/90'>
                          {theme.name}
                        </span>
                      </div>

                      <div className='flex items-center space-x-2'>
                        <div
                          className='w-6 h-6 sm:w-8 sm:h-8 rounded-full'
                          style={{ background: theme.progressGradient }}
                        />
                        {selectedTheme.id === theme.id && (
                          <Badge
                            variant='outline'
                            className='bg-background/40 backdrop-blur-sm text-xs sm:text-sm'
                          >
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Distraction-free mode overlay */}
        {hideDistractions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center overflow-hidden'
            onClick={() => setHideDistractions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className='relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center'
            >
              <div className='absolute inset-0'>
                {/* Animated waves - rendered first */}
                {selectedTheme.animation === 'wave' && (
                  <div className='absolute inset-0 overflow-hidden rounded-full z-0'>
                    <svg
                      className='w-full h-full'
                      viewBox='0 0 100 180'
                      preserveAspectRatio='none'
                    >
                      <defs>
                        <linearGradient
                          id='distraction-gradient'
                          x1='0%'
                          y1='0%'
                          x2='100%'
                          y2='100%'
                        >
                          <stop
                            offset='0%'
                            stopColor={selectedTheme.progressGradient
                              .split(',')[0]
                              .replace('linear-gradient(45deg, ', '')}
                          />
                          <stop
                            offset='100%'
                            stopColor={selectedTheme.progressGradient
                              .split(',')[1]
                              .replace(')', '')}
                          />
                        </linearGradient>
                      </defs>

                      {/* Background waves */}
                      <motion.path
                        d='M-50,75 Q-25,65 0,75 Q25,85 50,75 Q75,65 100,75 Q125,85 150,75 L150,180 L-50,180 Z'
                        fill={selectedTheme.wavesColor}
                        fillOpacity='0.3'
                        animate={{
                          d: [
                            'M-50,75 Q-25,65 0,75 Q25,85 50,75 Q75,65 100,75 Q125,85 150,75 L150,180 L-50,180 Z',
                            'M-50,75 Q-25,85 0,75 Q25,65 50,75 Q75,85 100,75 Q125,65 150,75 L150,180 L-50,180 Z',
                            'M-50,75 Q-25,65 0,75 Q25,85 50,75 Q75,65 100,75 Q125,85 150,75 L150,180 L-50,180 Z',
                          ],
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />

                      <motion.path
                        d='M-50,95 Q-25,85 0,95 Q25,105 50,95 Q75,85 100,95 Q125,105 150,95 L150,180 L-50,180 Z'
                        fill={selectedTheme.wavesColor}
                        fillOpacity='0.5'
                        animate={{
                          d: [
                            'M-50,95 Q-25,85 0,95 Q25,105 50,95 Q75,85 100,95 Q125,105 150,95 L150,180 L-50,180 Z',
                            'M-50,95 Q-25,105 0,95 Q25,85 50,95 Q75,105 100,95 Q125,85 150,95 L150,180 L-50,180 Z',
                            'M-50,95 Q-25,85 0,95 Q25,105 50,95 Q75,85 100,95 Q125,105 150,95 L150,180 L-50,180 Z',
                          ],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    </svg>
                  </div>
                )}

                {/* Main SVG with circles - rendered after waves */}
                <svg className='w-full h-full' viewBox='0 0 100 100'>
                  <defs>
                    <linearGradient
                      id='distraction-progress-gradient'
                      x1='0%'
                      y1='0%'
                      x2='100%'
                      y2='100%'
                    >
                      <stop
                        offset='0%'
                        stopColor={
                          isSession
                            ? selectedTheme.progressGradient
                                .split(',')[0]
                                .replace('linear-gradient(45deg, ', '')
                            : 'var(--secondary)'
                        }
                      />
                      <stop
                        offset='100%'
                        stopColor={
                          isSession
                            ? selectedTheme.progressGradient
                                .split(',')[1]
                                .replace(')', '')
                            : 'var(--secondary)'
                        }
                        stopOpacity='0.5'
                      />
                    </linearGradient>
                    <filter
                      id='distraction-glow'
                      x='-20%'
                      y='-20%'
                      width='140%'
                      height='140%'
                    >
                      <feGaussianBlur stdDeviation='3' result='blur' />
                      <feComposite
                        in='SourceGraphic'
                        in2='blur'
                        operator='over'
                      />
                    </filter>
                    <filter
                      id='distraction-focus-glow'
                      filterUnits='userSpaceOnUse'
                    >
                      <feGaussianBlur stdDeviation='1.5' result='blur' />
                      <feFlood
                        floodColor={selectedTheme.wavesColor}
                        floodOpacity='0.5'
                        result='coloredBlur'
                      />
                      <feComposite
                        in='coloredBlur'
                        in2='blur'
                        operator='in'
                        result='coloredBlurOpaque'
                      />
                      <feComposite
                        in='SourceGraphic'
                        in2='coloredBlurOpaque'
                        operator='over'
                      />
                    </filter>
                  </defs>

                  {/* Background circle */}
                  <circle
                    cx='50'
                    cy='50'
                    r='46'
                    fill='none'
                    stroke='currentColor'
                    strokeOpacity='0.1'
                    strokeWidth='8'
                  />

                  {/* Progress circle with glow */}
                  <circle
                    cx='50'
                    cy='50'
                    r='46'
                    fill='none'
                    stroke='url(#distraction-progress-gradient)'
                    strokeWidth='8'
                    strokeLinecap='round'
                    strokeDasharray='289.02652413026095'
                    strokeDashoffset={
                      289.02652413026095 - (289.02652413026095 * progress) / 100
                    }
                    transform='rotate(-90 50 50)'
                    filter='url(#distraction-focus-glow)'
                  />
                </svg>
              </div>

              {/* Timer text */}
              <div className='absolute inset-0 flex flex-col items-center justify-center'>
                <motion.span
                  className='text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter'
                  animate={
                    isRunning
                      ? {
                          scale: [1, 1.02, 1],
                          textShadow: [
                            '0 0 0px rgba(var(--primary-rgb), 0)',
                            '0 0 10px rgba(var(--primary-rgb), 0.3)',
                            '0 0 0px rgba(var(--primary-rgb), 0)',
                          ],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {formatTime(currentTime)}
                </motion.span>
                <span className='text-xs sm:text-sm text-foreground mt-1 sm:mt-2'>
                  {isSession
                    ? `${sessionTime} min session`
                    : `${breakTime} min break`}
                </span>
              </div>

              <Button
                variant='outline'
                size='icon'
                className='absolute top-4 right-4 bg-background/40 backdrop-blur-sm rounded-full h-8 w-8'
                onClick={() => setHideDistractions(false)}
              >
                <X className='h-4 w-4' />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
