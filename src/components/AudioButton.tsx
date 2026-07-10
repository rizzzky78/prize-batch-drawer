"use client";

import { Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { useStore } from "@/store/useStore";

export const AudioButton = () => {
  const isAudioEnabled = useStore((state) => state.isAudioEnabled);
  const setAudioEnabled = useStore((state) => state.setAudioEnabled);

  return (
    <Button
      variant="secondary"
      className="cursor-pointer"
      onClick={() => setAudioEnabled(!isAudioEnabled)}
      title={isAudioEnabled ? "Mute Audio" : "Unmute Audio"}
    >
      Audio Play
      {isAudioEnabled ? (
        <Volume2 className="w-4 h-4" />
      ) : (
        <VolumeX className="w-4 h-4 text-slate-400" />
      )}
    </Button>
  );
};
