"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { GraduationCap, Briefcase, ArrowUpRight } from "lucide-react";

export default function Onboarding() {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".onboard-card", {
                y: 50,
                opacity: 0,
                rotation: 2,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out",
            });
            gsap.from(".onboard-title", {
                y: -30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleSelect = (role: "mentor" | "mentee") => {
        if (role === "mentee") {
            router.push("/mentee/assessment");
        } else {
            router.push("/mentor/dashboard");
        }
    };

    return (
        <div
            ref={containerRef}
            className="min-h-screen flex flex-col items-center justify-center bg-[#f4f4f4] text-[#111] p-6 relative overflow-hidden brutalist-grid"
        >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-[#d1d1d1] -z-10" />
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[1px] bg-[#d1d1d1] -z-10" />

            <div className="z-10 w-full max-w-5xl text-center bg-white border-4 border-[#111] p-12 relative shadow-[16px_16px_0px_#111]">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#ff6a00]" />
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#111]" />

                <h1 className="onboard-title text-4xl md:text-6xl font-black font-sans uppercase leading-tight mb-6">
                    CHOOSE YOUR <span className="text-[#ff6a00]">PATH.</span>
                </h1>
                <p className="onboard-title text-[#555] font-mono font-medium text-lg md:text-xl mb-12 max-w-2xl mx-auto">
                    How would you like to use our platform today? Seek guidance or offer your expertise.
                </p>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
                    {/* Mentee Option */}
                    <button
                        onClick={() => handleSelect("mentee")}
                        className="onboard-card group relative p-10 bg-[#f4f4f4] border-2 border-[#111] hover:bg-[#111] transition-colors text-left overflow-hidden shadow-[8px_8px_0px_#111] hover:shadow-[12px_12px_0px_#ff6a00]"
                    >
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="h-16 w-16 bg-[#ff6a00] flex items-center justify-center mb-8 text-white border-2 border-[#111]">
                                <GraduationCap size={32} />
                            </div>
                            <h2 className="text-3xl font-black font-sans uppercase text-[#111] group-hover:text-white mb-4 transition-colors">I'm a Mentee</h2>
                            <p className="text-[#555] group-hover:text-[#aaa] font-mono text-sm leading-relaxed mb-8 transition-colors flex-grow">
                                I'm looking for career guidance, advice, and a mentor to help me grow professionally.
                            </p>
                            <div className="inline-flex items-center text-[#ff6a00] font-sans font-black uppercase text-lg group-hover:text-[#ff6a00] mt-auto">
                                Join As Mentee <ArrowUpRight className="ml-2 group-hover:rotate-45 transition-transform" />
                            </div>
                        </div>
                    </button>

                    {/* Mentor Option */}
                    <button
                        onClick={() => handleSelect("mentor")}
                        className="onboard-card group relative p-10 bg-white border-2 border-[#111] hover:bg-[#111] transition-colors text-left overflow-hidden shadow-[8px_8px_0px_#111] hover:shadow-[12px_12px_0px_#ff6a00]"
                    >
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="h-16 w-16 bg-[#111] group-hover:bg-[#ff6a00] transition-colors flex items-center justify-center mb-8 text-white border-2 border-[#111]">
                                <Briefcase size={32} />
                            </div>
                            <h2 className="text-3xl font-black font-sans uppercase text-[#111] group-hover:text-white mb-4 transition-colors">I'm a Mentor</h2>
                            <p className="text-[#555] group-hover:text-[#aaa] font-mono text-sm leading-relaxed mb-8 transition-colors flex-grow">
                                I want to share my knowledge, experience, and help guide the next generation of professionals.
                            </p>
                            <div className="inline-flex items-center text-[#111] group-hover:text-[#ff6a00] font-sans font-black uppercase text-lg transition-colors mt-auto">
                                Join As Mentor <ArrowUpRight className="ml-2 group-hover:rotate-45 transition-transform" />
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
