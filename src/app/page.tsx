
import { DoorprizeMachine } from "@/components/DoorprizeMachine";
import { ParticipantManager } from "@/components/ParticipantManager";
import Image from "next/image";


export const metadata = {
  title: "OM 70 Synergi Insani",
  description: "Doorprize Machine",
}

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-sans">
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="w-full flex justify-between">
          <div className="pl-8 pr-20 pt-6 pb-4 rounded-br-[100px] bg-white flex items-center">
            <Image
              src="/Logo-OM-70.png"
              alt="Logo"
              width={100}
              height={100}
              quality={100}
              priority
              className="w-30 object-contain mt-3"
            />
          </div>
          <div className="pr-8 pl-20 pt-6 pb-4 rounded-bl-[100px] bg-white flex items-center">
            <Image
              src="/logo-kpi-warna-besar.png"
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

      {/* Bottom Section: Participant Manager (Fixed height or smaller portion) */}
      <section className="min-h-screen z-20">
        <div className="w-full max-w-7xl mx-auto">
          <ParticipantManager />
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
