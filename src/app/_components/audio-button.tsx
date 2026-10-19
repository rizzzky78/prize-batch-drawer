"use client";

import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/lib/translations";
import { Hint } from "./help-tip";

export const AudioButton = () => {
  const isAudioEnabled = useStore((state) => state.isAudioEnabled);
  const setAudioEnabled = useStore((state) => state.setAudioEnabled);
  const t = useTranslation();

  return (
    <Hint text={t.help.audio}>
      <Button
        variant="outline"
        className="cursor-pointer border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
        onClick={() => setAudioEnabled(!isAudioEnabled)}
        aria-label={isAudioEnabled ? t.audio.mute : t.audio.unmute}
        aria-pressed={isAudioEnabled}
      >
        {isAudioEnabled ? (
          <Volume2 className="w-4 h-4 text-sky-300" />
        ) : (
          <VolumeX className="w-4 h-4 text-slate-500" />
        )}
        {t.audio.label}
      </Button>
    </Hint>
  );
};
