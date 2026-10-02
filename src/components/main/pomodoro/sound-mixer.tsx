'use client';

import { useEffect, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sounds, presets } from '@/constants/sound-constants';
import {
  Volume,
  VolumeX,
  Volume1,
  Volume2,
  Play,
  Pause,
  Music,
  VolumeX as MuteIcon,
  Info,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { usePomodoroStore } from '@/store/pomodoro-store';

interface SoundMixerProps {
  audioRefs: React.MutableRefObject<Record<string, HTMLAudioElement | null>>;
}

export function SoundMixer({ audioRefs }: SoundMixerProps) {
  const {
    activeSounds,
    updateSoundVolume,
    toggleSoundPlaying,
    setActiveSounds,
    toggleAllSounds,
    allSoundsPaused,
  } = usePomodoroStore();

  const [activeTab, setActiveTab] = useState('individual');
  const [lastAppliedPreset, setLastAppliedPreset] = useState<string | null>(
    null
  );
  const [anySoundPlaying, setAnySoundPlaying] = useState(false);

  // Check if any sound is playing
  useEffect(() => {
    const isAnyPlaying = Object.values(activeSounds).some(
      (sound) => sound.playing
    );
    setAnySoundPlaying(isAnyPlaying);
  }, [activeSounds]);

  // Apply a preset
  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (!preset) return;

    // First pause all current sounds
    Object.values(audioRefs.current).forEach((audio) => {
      if (audio) {
        audio.pause();
      }
    });

    // Create a new active sounds state with all sounds set to not playing
    const newActiveSounds: Record<
      string,
      { volume: number; playing: boolean }
    > = {};

    // Initialize all sounds with default values (not playing)
    sounds.forEach((sound) => {
      newActiveSounds[sound.id] = {
        volume: activeSounds[sound.id]?.volume || 50, // Keep previous volume if exists
        playing: false,
      };
    });

    // Apply preset settings (only for sounds in the preset)
    Object.entries(preset.sounds).forEach(([soundId, settings]) => {
      newActiveSounds[soundId] = settings;
    });

    // If all sounds were paused, we need to handle this differently
    if (allSoundsPaused) {
      // First apply the new sounds state
      setActiveSounds(newActiveSounds);

      // Then manually reset the global pause state without using toggleAllSounds
      // This avoids the issue where toggleAllSounds tries to resume previously playing sounds
      usePomodoroStore.setState({
        allSoundsPaused: false,
        soundsBeforePause: {},
      });
    } else {
      // Normal case - just apply the new sounds
      setActiveSounds(newActiveSounds);
    }

    // Track the last applied preset
    setLastAppliedPreset(presetId);
  };

  // Count active sounds
  const activeCount = Object.values(activeSounds).filter(
    (sound) => sound.playing
  ).length;

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center space-x-2'>
          <Music className='h-4 w-4 text-primary' />
          <h3 className='text-sm font-medium'>Sound Mixer</h3>
          {activeCount > 0 && (
            <Badge
              variant='outline'
              className='ml-2 transition-all duration-200 bg-background/60 backdrop-blur-sm'
            >
              {activeCount} active
            </Badge>
          )}
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className={`transition-all duration-200 ${allSoundsPaused ? 'text-green-500 hover:bg-green-500/10' : anySoundPlaying ? 'text-primary hover:bg-primary/10' : 'text-muted-foreground'}`}
                onClick={toggleAllSounds}
                disabled={!anySoundPlaying && !allSoundsPaused}
              >
                {allSoundsPaused ? (
                  <Play className='h-4 w-4 mr-1' />
                ) : (
                  <Pause className='h-4 w-4 mr-1' />
                )}
                {allSoundsPaused ? 'Resume' : 'Pause'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {allSoundsPaused ? 'Resume all sounds' : 'Pause all sounds'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='grid w-full grid-cols-2 mb-2'>
          <TabsTrigger
            value='individual'
            className='transition-all duration-200'
          >
            Individual
          </TabsTrigger>
          <TabsTrigger value='presets' className='transition-all duration-200'>
            Presets
          </TabsTrigger>
        </TabsList>

        <TabsContent value='individual' className='pt-2'>
          <ScrollArea className='h-[280px] pr-4'>
            <div className='grid grid-cols-1 gap-3'>
              {sounds.map((sound) => (
                <motion.div
                  key={sound.id}
                  className='flex items-center space-x-3 p-2 rounded-lg hover:bg-background/60 transition-all duration-200'
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant={
                      activeSounds[sound.id]?.playing ? 'default' : 'outline'
                    }
                    size='icon'
                    className='w-10 h-10 flex-shrink-0 transition-all duration-200 shadow-sm'
                    onClick={() => toggleSoundPlaying(sound.id)}
                  >
                    {activeSounds[sound.id]?.playing ? (
                      <Pause className='h-4 w-4' />
                    ) : (
                      <Play className='h-4 w-4' />
                    )}
                  </Button>

                  <div className='flex-1 space-y-1'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium flex items-center gap-1.5'>
                        <span className='text-base'>{sound.icon}</span>{' '}
                        {sound.name}
                      </span>
                      <motion.div className='text-muted-foreground transition-all duration-200'>
                        {activeSounds[sound.id]?.volume === 0 ? (
                          <VolumeX className='h-3.5 w-3.5' />
                        ) : activeSounds[sound.id]?.volume < 50 ? (
                          <Volume className='h-3.5 w-3.5' />
                        ) : activeSounds[sound.id]?.volume < 80 ? (
                          <Volume1 className='h-3.5 w-3.5' />
                        ) : (
                          <Volume2 className='h-3.5 w-3.5' />
                        )}
                      </motion.div>
                    </div>

                    <div className='relative h-6'>
                      <Slider
                        value={[activeSounds[sound.id]?.volume || 0]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) =>
                          updateSoundVolume(sound.id, value[0])
                        }
                        disabled={!activeSounds[sound.id]?.playing}
                        className={`transition-all duration-200 ${
                          !activeSounds[sound.id]?.playing ? 'opacity-50' : ''
                        }`}
                      />

                      {activeSounds[sound.id]?.playing && (
                        <div
                          className='absolute top-1/2 -translate-y-1/2 h-1 bg-primary/20 rounded-full transition-all duration-200'
                          style={{
                            width: `${activeSounds[sound.id]?.volume || 0}%`,
                            opacity:
                              activeSounds[sound.id]?.volume > 0 ? 0.2 : 0,
                          }}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value='presets' className='pt-2'>
          <ScrollArea className='h-[280px] pr-4'>
            <div className='grid grid-cols-1 gap-3'>
              {presets.map((preset) => (
                <motion.div
                  key={preset.id}
                  className='p-3 rounded-md border bg-card/30 backdrop-blur-sm'
                  transition={{ duration: 0.2 }}
                >
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center space-x-1.5'>
                      <span className='font-medium text-sm'>{preset.name}</span>
                      <span className='text-xs text-muted-foreground'>
                        ({Object.keys(preset.sounds).length} sounds)
                      </span>
                    </div>

                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-7 w-7 p-0 rounded-full hover:bg-background/80 transition-all duration-200'
                      onClick={() => applyPreset(preset.id)}
                    >
                      <Play className='h-3.5 w-3.5' />
                    </Button>
                  </div>

                  <div className='flex flex-wrap gap-1.5'>
                    {Object.entries(preset.sounds).map(
                      ([soundId, settings]) => {
                        const sound = sounds.find((s) => s.id === soundId);
                        if (!sound) return null;
                        return (
                          <Badge
                            key={soundId}
                            variant='outline'
                            className={`text-xs ${
                              settings.playing
                                ? 'bg-primary/10 text-primary'
                                : 'bg-muted/50'
                            }`}
                          >
                            {sound.icon} {sound.name}
                          </Badge>
                        );
                      }
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className='flex items-center justify-center mt-4 text-xs text-muted-foreground'>
              <Info className='h-3 w-3 mr-1.5' />
              <span>
                Presets completely replace your current sound selection
              </span>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
