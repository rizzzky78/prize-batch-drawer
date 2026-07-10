import { DoorprizeMachine } from "@/components/DoorprizeMachine";
import { ParticipantManager } from "@/components/ParticipantManager";
import { PrizeManager } from "@/components/PrizeManager";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import Image from "next/image";
import { AudioButton } from "@/components/AudioButton";

export const metadata = {
  title: "Collaboration FOC I | Pertamina Patra Niaga",
  description: "Doorprize Machine",
};

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-sans">
      <header className="sticky top-0 left-0 right-0 z-50">
        <div className="w-full flex justify-between">
          <div className="pl-8 pr-16 h-16 rounded-br-[100px] bg-white flex items-center">
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
          <div className="pr-8 pl-16 pt-0 h-16 rounded-bl-[100px] bg-white flex items-center">
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
      {/* Top Section: Draw Machine (Takes available space) */}
      <section className="">
        <DoorprizeMachine />
      </section>

      {/* Bottom Section: Management (Fixed height or smaller portion) */}
      <section className="min-h-screen z-20 pb-20">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-1 gap-4">
          <div className="w-full flex items-center justify-end">
            <div className="flex items-center space-x-3">
              <AudioButton />
              <LanguageSwitcher />
            </div>
          </div>
          <div className="min-h-[400px]">
            <PrizeManager />
          </div>
          <div className="min-h-screen">
            <ParticipantManager />
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-slate-400 text-sm z-30 pb-10">
        <p>
          Made with ♥️ by{" "}
          <a
            href="https://codebyrzky.site"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            codebyrzky
          </a>
        </p>
      </footer>
    </main>
  );
}
