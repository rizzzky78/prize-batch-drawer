"use client";

import { DoorprizeMachine } from "@/components/DoorprizeMachine";
import { ParticipantManager } from "@/components/ParticipantManager";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-sans">
      {/* Top Section: Draw Machine (Takes available space) */}
      <section className="">
        <DoorprizeMachine />
      </section>

      {/* Bottom Section: Participant Manager (Fixed height or smaller portion) */}
      <section className="min-h-screen z-20">
        <div className="w-full max-w-7xl mx-auto">
          <ParticipantManager />
        </div>
      </section>

      <footer className="py-8 text-center text-slate-400 text-sm z-30 pb-10">
        <p>
          Made with{" "} ♥️ by{" "}
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
