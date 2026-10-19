import { DoorprizeMachine } from "@/components/DoorprizeMachine";
import { ParticipantManager } from "@/components/ParticipantManager";
import { PrizeManager } from "@/components/PrizeManager";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import Image from "next/image";
import { AudioButton } from "@/components/AudioButton";
import { SetupGuide } from "@/components/SetupGuide";

export const metadata = {
  title: "Collaboration FOC I | Pertamina Patra Niaga",
  description: "Doorprize Machine",
};

export default function Home() {
  return (
    <main className="relative isolate flex flex-col min-h-screen bg-background font-sans overflow-x-clip">
      {/* Ambient stage lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[110vh] bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.6_0.2_258/0.28),transparent_70%),radial-gradient(40%_35%_at_85%_30%,oklch(0.75_0.15_80/0.10),transparent_70%)]"
      />

      <header className="sticky top-0 left-0 right-0 z-50">
        <div className="w-full flex justify-between">
          <div className="pl-8 pr-16 h-16 rounded-br-[100px] bg-white flex items-center shadow-lg shadow-black/20">
            <Image
              src="/logo-production-1-black-refined.png"
              alt="Logo"
              width={100}
              height={100}
              quality={100}
              priority
              className="w-30 scale-80 mt-1 object-contain"
            />
          </div>
          <div className="pr-8 pl-16 pt-0 h-16 rounded-bl-[100px] bg-white flex items-center shadow-lg shadow-black/20">
            <Image
              src="/pertamina_patra_niaga_logo.svg"
              alt="Logo"
              width={100}
              height={100}
              quality={100}
              priority
              className="w-30 object-contain"
            />
          </div>
        </div>
      </header>

      {/* Stage: Draw Machine */}
      <section>
        <DoorprizeMachine />
      </section>

      {/* Setup & Management */}
      <section className="z-20 pb-20 px-4 sm:px-8">
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-t border-white/10 pt-10">
            <SetupGuide />
            <div className="flex items-center gap-2 shrink-0">
              <AudioButton />
              <LanguageSwitcher />
            </div>
          </div>
          <PrizeManager />
          <ParticipantManager />
        </div>
      </section>

      <footer className="py-8 text-center text-slate-500 text-sm z-30 pb-10 border-t border-white/5">
        <p>
          Made with ♥️ by{" "}
          <a
            href="https://codebyrzky.site"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300 transition-colors font-medium"
          >
            codebyrzky
          </a>
        </p>
      </footer>
    </main>
  );
}
