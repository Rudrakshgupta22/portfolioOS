import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JetBrains_Mono } from "next/font/google";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

export default function ClosingCTA() {
  return (
    <section className="px-6 pb-16 md:px-[8%] md:pb-24">
      <div className="rounded-[2rem] border border-[#cfc29f]/20 bg-[#cfc29f]/[0.03] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.28)] md:p-12">
        <p className={`${mono.className} text-[10px] uppercase tracking-[0.22em] text-[#8d939d]`}>
          Ready for the next mission
        </p>

        <h3 className="mt-6 max-w-3xl text-[clamp(2rem,5vw,4rem)] font-light leading-[1.02] tracking-tight text-[#ebe8e2]">
          Let&apos;s turn research, product thinking, and deployment into the next working system.
        </h3>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/contact"
            className={`${mono.className} inline-flex min-h-11 items-center gap-2 rounded-full border border-[#cfc29f]/30 bg-[#cfc29f]/10 px-6 py-3 text-[10px] uppercase tracking-[0.22em] text-[#cfc29f] transition-all duration-500 hover:scale-[1.02] active:scale-95`}
          >
            Start a conversation
            <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
          </Link>

          <Link
            href="/hub"
            className={`${mono.className} inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-6 py-3 text-[10px] uppercase tracking-[0.22em] text-[#ebe8e2] transition-all duration-500 hover:border-[#cfc29f]/40 hover:text-[#cfc29f] active:scale-95`}
          >
            Return to hub
          </Link>
        </div>
      </div>
    </section>
  );
}
