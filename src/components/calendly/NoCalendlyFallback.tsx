"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NoCalendlyFallback() {
    return (
        <div className="w-full mt-10 bg-white border-4 border-[#111] p-10 shadow-[8px_8px_0px_#111] relative text-center">
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#ff6a00]" />

            <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-[#111] bg-[#f4f4f4] flex items-center justify-center text-[#ff6a00]">
                    <AlertCircle size={40} strokeWidth={3} />
                </div>
            </div>

            <h2 className="text-3xl font-black font-sans uppercase text-[#111] mb-4 tracking-tighter">
                SCHEDULING UNAVAILABLE
            </h2>

            <p className="text-[#555] font-bold tracking-widest text-sm uppercase mb-8 max-w-lg mx-auto leading-relaxed">
                This mentor hasn't set up their availability yet. Check back later or reach out via group chat once established.
            </p>

            <button
                disabled
                className="px-8 py-4 bg-[#e5e5e5] text-[#888] font-black font-sans uppercase tracking-widest text-lg border-4 border-[#ccc] cursor-not-allowed shadow-[6px_6px_0px_#e5e5e5]"
            >
                SESSION UNAVAILABLE
            </button>

            <div className="mt-8 text-xs font-bold tracking-widest text-[#888] uppercase border-t-2 border-[#eee] pt-6">
                <Link href="/mentorships" className="hover:text-[#ff6a00] transition-colors">
                    &larr; BACK TO MENTORSHIPS
                </Link>
            </div>
        </div>
    );
}
