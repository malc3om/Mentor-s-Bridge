"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UserButton } from "@clerk/nextjs";
import { BookOpen, Calendar, Clock, Trophy, ChevronRight, MessageSquare } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function MenteeDashboard() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header Animation
            gsap.from(".header-section", {
                y: -30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            });

            // Stats Stagger
            gsap.from(".stat-card", {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.15,
                delay: 0.3,
                ease: "back.out(1.2)"
            });

            // Progress Bar
            gsap.to(".progress-fill", {
                width: "65%",
                duration: 1.5,
                ease: "power2.out",
                delay: 0.6
            });

            // Section fades with ScrollTrigger
            const sections = gsap.utils.toArray(".dashboard-section");
            sections.forEach((section: any) => {
                gsap.from(section, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: section,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                });
            });

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-[#f4f4f4] text-[#111] p-6 md:p-10 lg:p-14 relative overflow-hidden brutalist-grid font-mono">
            <div className="absolute top-0 left-1/4 w-[1px] h-full bg-[#d1d1d1] -z-10" />
            <div className="absolute top-0 left-3/4 w-[1px] h-full bg-[#d1d1d1] -z-10" />

            {/* Header */}
            <header className="header-section flex justify-between items-end mb-16 max-w-7xl mx-auto border-b-4 border-[#111] pb-8 relative">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#ff6a00]" />
                <div>
                    <h1 className="text-4xl md:text-6xl font-black font-sans uppercase tracking-tighter text-[#111]">
                        Welcome back,<br /> <span className="text-[#ff6a00]">Mentee.</span>
                    </h1>
                    <p className="text-[#555] font-bold mt-4 tracking-widest text-sm uppercase border-2 border-[#111] inline-block px-4 py-2 bg-white">READY FOR YOUR NEXT BREAKTHROUGH?</p>
                </div>
                <div className="flex items-center gap-6">
                    <button className="px-6 py-3 border-2 border-[#111] bg-white text-[#111] font-bold uppercase hover:bg-[#111] hover:text-[#ff6a00] transition-colors shadow-[4px_4px_0px_#111] hover:shadow-[6px_6px_0px_#ff6a00] flex gap-2 items-center">
                        <MessageSquare size={18} strokeWidth={3} /> <span className="hidden sm:inline">Messages</span>
                    </button>
                    <div className="w-12 h-12 border-4 border-[#111] bg-white flex items-center justify-center overflow-hidden shadow-[4px_4px_0px_#111]">
                        <UserButton afterSignOutUrl="/sign-in" appearance={{ elements: { avatarBox: "w-full h-full rounded-none" } }} />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto space-y-12">
                {/* Stats Grid */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="stat-card bg-white border-4 border-[#111] p-6 flex flex-col justify-between shadow-[8px_8px_0px_#111] group hover:-translate-y-1 transition-transform">
                        <div className="text-[#111] mb-6 p-3 border-2 border-[#111] w-max group-hover:bg-[#ff6a00] group-hover:text-white transition-colors"><Calendar strokeWidth={3} /></div>
                        <div>
                            <div className="text-5xl font-black font-sans text-[#111] mb-2 group-hover:text-[#ff6a00] transition-colors">3</div>
                            <div className="text-[#555] text-xs font-bold uppercase tracking-widest">Upcoming Sessions</div>
                        </div>
                    </div>
                    <div className="stat-card bg-white border-4 border-[#111] p-6 flex flex-col justify-between shadow-[8px_8px_0px_#111] group hover:-translate-y-1 transition-transform">
                        <div className="text-[#111] mb-6 p-3 border-2 border-[#111] w-max group-hover:bg-[#ff6a00] group-hover:text-white transition-colors"><Clock strokeWidth={3} /></div>
                        <div>
                            <div className="text-5xl font-black font-sans text-[#111] mb-2 group-hover:text-[#ff6a00] transition-colors">12h</div>
                            <div className="text-[#555] text-xs font-bold uppercase tracking-widest">Mentorship Logged</div>
                        </div>
                    </div>
                    <div className="stat-card bg-white border-4 border-[#111] p-6 flex flex-col justify-between shadow-[8px_8px_0px_#111] group hover:-translate-y-1 transition-transform">
                        <div className="text-[#111] mb-6 p-3 border-2 border-[#111] w-max group-hover:bg-[#ff6a00] group-hover:text-white transition-colors"><Trophy strokeWidth={3} /></div>
                        <div>
                            <div className="text-5xl font-black font-sans text-[#111] mb-2 group-hover:text-[#ff6a00] transition-colors">2/5</div>
                            <div className="text-[#555] text-xs font-bold uppercase tracking-widest">Goals Completed</div>
                        </div>
                    </div>
                    <div className="stat-card bg-white border-4 border-[#111] p-6 flex flex-col justify-between shadow-[8px_8px_0px_#111] group hover:-translate-y-1 transition-transform">
                        <div className="text-[#111] mb-6 p-3 border-2 border-[#111] w-max group-hover:bg-[#ff6a00] group-hover:text-white transition-colors"><BookOpen strokeWidth={3} /></div>
                        <div>
                            <div className="text-5xl font-black font-sans text-[#111] mb-2 group-hover:text-[#ff6a00] transition-colors">8</div>
                            <div className="text-[#555] text-xs font-bold uppercase tracking-widest">Resources Viewed</div>
                        </div>
                    </div>
                </section>

                <div className="grid lg:grid-cols-3 gap-10 dashboard-section">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Goal Progress */}
                        <div className="bg-white border-4 border-[#111] p-10 shadow-[12px_12px_0px_#111] relative">
                            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#111]" />
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                                <div>
                                    <h2 className="text-3xl font-black font-sans uppercase tracking-tight text-[#111] mb-2">Current Goal Progress</h2>
                                    <p className="text-[#555] font-bold uppercase text-xs tracking-widest border-l-4 border-[#ff6a00] pl-3 py-1 bg-[#f4f4f4]">Transition to Full-Stack Architect</p>
                                </div>
                                <div className="text-5xl font-black font-sans text-[#ff6a00]">65%</div>
                            </div>
                            <div className="h-4 w-full bg-[#f4f4f4] border-2 border-[#111] overflow-hidden">
                                <div className="progress-fill h-full bg-[#111] w-0 border-r-2 border-[#ff6a00]" />
                            </div>
                        </div>

                        {/* Upcoming Mentorship Sessions */}
                        <div className="bg-white border-4 border-[#111] p-10 shadow-[12px_12px_0px_#111] relative">
                            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-[#ff6a00]" />
                            <h2 className="text-3xl font-black font-sans uppercase mb-10 pb-4 border-b-2 border-[#111] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <span>UPCOMING SESSIONS</span>
                                <button className="text-sm font-bold tracking-widest bg-[#111] text-white px-4 py-2 hover:bg-[#ff6a00] hover:text-[#111] transition-colors">VIEW CALENDAR</button>
                            </h2>

                            <div className="space-y-6">
                                {[
                                    { name: "Alex Rivera", role: "Senior PM", date: "Tomorrow, 2:00 PM EST", type: "Portfolio Review" },
                                    { name: "Samantha Lee", role: "Lead Engineer", date: "Friday, 11:00 AM EST", type: "System Design Mock" }
                                ].map((session, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-2 border-[#111] bg-[#f4f4f4] hover:bg-[#111] hover:text-white transition-colors group cursor-pointer shadow-[4px_4px_0px_#111] hover:shadow-[6px_6px_0px_#ff6a00] hover:-translate-y-1">
                                        <div className="flex gap-6 items-center mb-4 sm:mb-0">
                                            <div className="w-14 h-14 border-2 border-[#111] bg-white group-hover:bg-[#ff6a00] flex-shrink-0 transition-colors" />
                                            <div>
                                                <h4 className="font-black font-sans uppercase text-xl text-[#111] group-hover:text-white">{session.name}</h4>
                                                <div className="text-xs font-bold uppercase tracking-widest text-[#555] group-hover:text-[#aaa]">{session.type}</div>
                                            </div>
                                        </div>
                                        <div className="font-bold text-[#ff6a00] flex items-center gap-3 tracking-wider">
                                            <Clock size={18} strokeWidth={3} /> {session.date}
                                            <ChevronRight size={20} className="text-[#111] group-hover:text-[#ff6a00] transition-colors" strokeWidth={3} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-10">
                        {/* Action Items */}
                        <div className="bg-white border-4 border-[#111] p-10 shadow-[12px_12px_0px_#111]">
                            <h2 className="text-2xl font-black font-sans uppercase mb-8 pb-4 border-b-2 border-[#111]">ACTION ITEMS</h2>
                            <ul className="space-y-6">
                                {[
                                    "Update resume with recent React project",
                                    "Read 'System Design' Ch. 4",
                                    "Schedule 1-on-1 with Alex"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 font-bold text-[#333] tracking-tight uppercase group cursor-pointer hover:text-[#ff6a00] transition-colors border-2 border-transparent hover:border-[#ff6a00] hover:bg-[#111] p-2 -ml-2">
                                        <div className="mt-1 w-5 h-5 border-2 border-[#111] group-hover:border-[#ff6a00] group-hover:bg-white flex-shrink-0 transition-colors" />
                                        <span className="leading-tight">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resource Library Mini */}
                        <div className="bg-[#111] text-white border-4 border-[#ff6a00] p-10 shadow-[12px_12px_0px_#111]">
                            <h2 className="text-2xl font-black font-sans uppercase mb-8 pb-4 border-b-2 border-[#333] text-[#f4f4f4]">RESOURCES</h2>
                            <div className="space-y-4">
                                {[
                                    { title: "Negotiating Salary Offers", type: "Article" },
                                    { title: "Advanced React Patterns", type: "Video" },
                                    { title: "Leadership Communication", type: "Podcast" }
                                ].map((res, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 border-2 border-[#333] hover:border-[#ff6a00] bg-[#1a1a1a] cursor-pointer transition-colors group">
                                        <div>
                                            <div className="font-bold uppercase tracking-tight text-[#f4f4f4] mb-1 group-hover:text-[#ff6a00]">{res.title}</div>
                                            <div className="text-xs text-[#555] font-bold tracking-widest uppercase">{res.type}</div>
                                        </div>
                                        <BookOpen size={20} className="text-[#333] group-hover:text-[#ff6a00] transition-colors" strokeWidth={2} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
