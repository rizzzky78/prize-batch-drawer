"use client";

import { Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/lib/translations";

export const AudioButton = () => {
  const isAudioEnabled = useStore((state) => state.isAudioEnabled);
  const setAudioEnabled = useStore((state) => state.setAudioEnabled);
  const t = useTranslation();

  return (
    <Button
      variant="secondary"
      className="cursor-pointer"
      onClick={() => setAudioEnabled(!isAudioEnabled)}
      title={isAudioEnabled ? t.audio.mute : t.audio.unmute}
    >
      {t.audio.label}
      {isAudioEnabled ? (
        <Volume2 className="w-4 h-4" />
      ) : (
        <VolumeX className="w-4 h-4 text-slate-400" />
      )}
    </Button>
  );
};
