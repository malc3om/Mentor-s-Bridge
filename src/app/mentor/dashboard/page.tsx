"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { UserButton } from "@clerk/nextjs";
import { Users, TrendingUp, Presentation, ChevronRight, Plus, X } from "lucide-react";
import CalendlySetupGuide from "@/components/calendly/CalendlySetupGuide";

export default function MentorDashboard() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showCalendlySetup, setShowCalendlySetup] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header Animation
            gsap.from(".header-section", {
                y: -30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            });

            // Metric Counters
            const counters = gsap.utils.toArray(".metric-counter");
            counters.forEach((counter: any) => {
                const target = parseInt(counter.getAttribute("data-target") || "0", 10);
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 2.5,
                    snap: { innerHTML: 1 },
                    ease: "power2.out",
                    delay: 0.2
                });
            });

            // Card Staggers
            gsap.from(".panel-card", {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out",
                delay: 0.4
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleCalendlyComplete = (url: string) => {
        console.log("Calendly URL saved:", url);
        alert("Availability link saved successfully!");
        setShowCalendlySetup(false);
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-[#f4f4f4] text-[#111] p-6 md:p-10 lg:p-14 relative overflow-hidden brutalist-grid font-mono">
            <div className="absolute top-0 left-1/3 w-[1px] h-full bg-[#d1d1d1] -z-10" />
            <div className="absolute top-0 left-2/3 w-[1px] h-full bg-[#d1d1d1] -z-10" />

            {/* Calendly Setup Modal Overlay */}
            {showCalendlySetup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111]/80 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="relative w-full max-w-4xl mt-20 mb-10">
                        <button
                            onClick={() => setShowCalendlySetup(false)}
                            className="absolute -top-6 -right-6 lg:-top-10 lg:-right-10 w-12 h-12 bg-white border-4 border-[#111] text-[#111] hover:bg-[#ff6a00] hover:text-[#111] flex items-center justify-center transition-colors shadow-[4px_4px_0px_#111] z-50 group"
                        >
                            <X size={28} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                        </button>
                        <CalendlySetupGuide
                            onComplete={handleCalendlyComplete}
                            onSkip={() => setShowCalendlySetup(false)}
                        />
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="header-section flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 max-w-7xl mx-auto border-b-4 border-[#111] pb-8 relative">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#ff6a00]" />
                <div>
                    <h1 className="text-4xl md:text-6xl font-black font-sans uppercase tracking-tighter text-[#111]">
                        Mentor <span className="text-[#ff6a00]">Overview.</span>
                    </h1>
                    <p className="text-[#555] font-bold mt-4 tracking-widest text-sm uppercase border-2 border-[#111] inline-block px-4 py-2 bg-white">MANAGE MENTEES & TRACK IMPACT.</p>
                </div>
                <div className="flex items-center gap-6 z-10">
                    <button
                        onClick={() => setShowCalendlySetup(true)}
                        className="px-6 py-3 border-2 border-[#111] bg-[#ff6a00] text-[#111] font-black font-sans text-xl uppercase tracking-widest hover:bg-[#111] hover:text-[#ff6a00] transition-colors shadow-[4px_4px_0px_#111] hover:shadow-[6px_6px_0px_#ff6a00] flex gap-2 items-center"
                    >
                        <Plus size={24} strokeWidth={3} /> NEW AVAILABILITY
                    </button>
                    <div className="w-14 h-14 border-4 border-[#111] bg-white flex items-center justify-center overflow-hidden shadow-[4px_4px_0px_#111]">
                        <UserButton afterSignOutUrl="/sign-in" appearance={{ elements: { avatarBox: "w-full h-full rounded-none" } }} />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto space-y-12">

                {/* Core Metrics */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="panel-card bg-white border-4 border-[#111] p-8 flex items-center justify-between shadow-[8px_8px_0px_#111] hover:-translate-y-1 transition-transform group">
                        <div>
                            <p className="text-[#555] font-bold text-sm tracking-widest uppercase mb-2">Active Mentees</p>
                            <div className="text-6xl font-black font-sans text-[#111] metric-counter group-hover:text-[#ff6a00] transition-colors" data-target="4">0</div>
                        </div>
                        <div className="w-16 h-16 bg-[#111] flex items-center justify-center text-white border-2 border-[#111] group-hover:bg-[#ff6a00] group-hover:text-[#111] transition-colors shadow-[4px_4px_0px_#111]">
                            <Users size={32} strokeWidth={2} />
                        </div>
                    </div>

                    <div className="panel-card bg-white border-4 border-[#111] p-8 flex items-center justify-between shadow-[8px_8px_0px_#111] hover:-translate-y-1 transition-transform group">
                        <div>
                            <p className="text-[#555] font-bold text-sm tracking-widest uppercase mb-2">Hours Mentored</p>
                            <div className="text-6xl font-black font-sans text-[#111] metric-counter group-hover:text-[#ff6a00] transition-colors" data-target="42">0</div>
                        </div>
                        <div className="w-16 h-16 bg-[#111] flex items-center justify-center text-white border-2 border-[#111] group-hover:bg-[#ff6a00] group-hover:text-[#111] transition-colors shadow-[4px_4px_0px_#111]">
                            <TrendingUp size={32} strokeWidth={2} />
                        </div>
                    </div>

                    <div className="panel-card bg-[#111] text-white border-4 border-[#111] p-8 flex items-center justify-between shadow-[8px_8px_0px_#ff6a00] hover:-translate-y-1 transition-transform group">
                        <div>
                            <p className="text-[#aaa] font-bold text-sm tracking-widest uppercase mb-2">Sessions This Month</p>
                            <div className="text-6xl font-black font-sans text-[#ff6a00] metric-counter" data-target="15">0</div>
                        </div>
                        <div className="w-16 h-16 bg-white flex items-center justify-center text-[#111] border-2 border-white group-hover:bg-[#ff6a00] transition-colors shadow-[4px_4px_0px_#ff6a00]">
                            <Presentation size={32} strokeWidth={2} />
                        </div>
                    </div>
                </section>

                {/* Dashboard Sections */}
                <div className="grid lg:grid-cols-2 gap-10">

                    {/* Mentee Requests */}
                    <div className="panel-card bg-white border-4 border-[#111] p-10 shadow-[12px_12px_0px_#111] relative">
                        <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-[#ff6a00]" />
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-4 border-b-2 border-[#111] gap-4">
                            <h2 className="text-3xl font-black font-sans uppercase">Incoming Requests</h2>
                            <span className="text-sm font-bold tracking-widest px-4 py-2 bg-[#ff6a00] text-[#111] border-2 border-[#111] shadow-[2px_2px_0px_#111]">2 NEW</span>
                        </div>

                        <div className="space-y-6">
                            {[
                                { name: "Jordan Smith", role: "Junior Developer", match: 92, status: "Awaiting Review" },
                                { name: "Emily Chen", role: "Graphic Designer", match: 88, status: "Awaiting Review" }
                            ].map((req, i) => (
                                <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-[#f4f4f4] border-2 border-[#111] hover:bg-[#111] hover:text-white transition-colors group shadow-[4px_4px_0px_#111] gap-4">
                                    <div className="flex gap-6 items-center">
                                        <div className="w-14 h-14 border-2 border-[#111] bg-white group-hover:bg-[#ff6a00] transition-colors" />
                                        <div>
                                            <div className="font-black font-sans uppercase text-2xl text-[#111] group-hover:text-white">{req.name}</div>
                                            <div className="text-xs font-bold tracking-widest text-[#555] group-hover:text-[#aaa] uppercase">{req.role} / <span className="text-[#ff6a00]">{req.match}% MATCH</span></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                                        <button className="flex-1 sm:flex-none px-6 py-3 bg-[#ff6a00] text-[#111] font-black font-sans uppercase text-lg hover:bg-white hover:text-[#111] border-2 border-[#111] transition-colors shadow-[2px_2px_0px_#111]">ACCEPT</button>
                                        <button className="flex-1 sm:flex-none px-6 py-3 bg-white text-[#111] font-black font-sans uppercase text-lg border-2 border-[#111] hover:bg-[#111] hover:text-white transition-colors shadow-[2px_2px_0px_#111]">VIEW</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className="panel-card bg-[#111] text-white border-4 border-[#111] p-10 shadow-[12px_12px_0px_#ff6a00] relative">
                        <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#ff6a00]" />
                        <h2 className="text-3xl font-black font-sans uppercase mb-10 pb-4 border-b-2 border-[#333]">Today's Schedule</h2>
                        <div className="relative border-l-4 border-[#333] pl-8 space-y-10 py-4 ml-4">
                            {[
                                { time: "10:00 AM", mentee: "Marcus T.", topic: "System Design Review", done: true },
                                { time: "2:30 PM", mentee: "Sarah K.", topic: "Resume Optimization", done: false },
                                { time: "4:00 PM", mentee: "David L.", topic: "Salary Negotiation Prep", done: false }
                            ].map((session, i) => (
                                <div key={i} className="relative group cursor-pointer">
                                    {/* Timeline dot */}
                                    <div className={`absolute -left-[46px] top-1/2 -translate-y-1/2 w-6 h-6 border-4 border-[#111] ${session.done ? 'bg-[#333]' : 'bg-[#ff6a00]'}`} />

                                    <div className={`p-6 border-2 transition-all group hover:-translate-y-1 ${session.done ? 'bg-[#1a1a1a] border-[#333] opacity-60' : 'bg-[#fff] text-[#111] border-[#ff6a00] shadow-[4px_4px_0px_#ff6a00]'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`font-black font-sans uppercase text-2xl ${session.done ? 'text-[#888]' : 'text-[#111]'}`}>{session.mentee}</div>
                                            <div className={`text-sm font-bold tracking-widest uppercase ${session.done ? 'text-[#555]' : 'text-[#ff6a00]'}`}>{session.time}</div>
                                        </div>
                                        <div className={`text-sm tracking-widest font-bold flex items-center justify-between uppercase ${session.done ? 'text-[#555]' : 'text-[#555]'}`}>
                                            {session.topic}
                                            {!session.done && <ChevronRight size={20} className="text-[#111] group-hover:text-[#ff6a00] transition-transform group-hover:translate-x-1" strokeWidth={3} />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
