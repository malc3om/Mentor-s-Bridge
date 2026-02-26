"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { UserPlus, Star, CheckCircle } from "lucide-react";
import Link from "next/link";
import ScheduleButton from "@/components/calendly/ScheduleButton";
import { calculateMatchScore } from "@/lib/matching/algorithm";

const MOCK_MENTORS_DATA = [
    {
        id: 1,
        name: "Alex Rivera",
        title: "Senior Product Manager",
        industry: "FinTech / SaaS",
        expertise: ["Product Management", "Software Development", "Career Guidance", "Get a Job"],
        modes: ["Online", "Hybrid"],
        bio: "Passionate about building scalable products and driving teams to success. 8 years of experience leading cross-functional teams.",
        match: 96,
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        calendlyUrl: "https://calendly.com", // Mock URL
    },
    {
        id: 2,
        name: "Samantha Lee",
        title: "Lead Frontend Engineer",
        industry: "Web3 / AI",
        expertise: ["React", "Design / UI-UX", "Web3", "Improve Skills"],
        modes: ["Online"],
        bio: "Transitioned from marketing to tech. Expert in React, Next.js, and web animations. Love helping early-career devs find their feet.",
        match: 89,
        avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
        calendlyUrl: "https://calendly.com", // Mock URL
    },
    {
        id: 3,
        name: "David Chen",
        title: "Director of Engineering",
        industry: "E-Commerce / Software Development",
        expertise: ["System Architecture", "Leadership", "Career Guidance", "Get a Job"],
        modes: ["Online", "Offline"],
        bio: "Focused on system architecture and engineering leadership. I help mid-level engineers transition into management roles.",
        match: 82,
        avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
        // No calendly URL for David to test NoCalendlyFallback if needed, or just don't show the button
    }
];

export default function MatchesPage() {
    const [analyzing, setAnalyzing] = useState(true);
    const [mentors, setMentors] = useState(MOCK_MENTORS_DATA);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Calculate dynamic match scores if assessment data exists
        try {
            const savedAnswers = sessionStorage.getItem('menteeAssessment');
            if (savedAnswers) {
                const parsedAnswers = JSON.parse(savedAnswers);
                const updatedMentors = MOCK_MENTORS_DATA.map(m => ({
                    ...m,
                    match: calculateMatchScore(parsedAnswers, m)
                })).sort((a, b) => b.match - a.match); // sort by highest match

                setMentors(updatedMentors);
            }
        } catch (error) {
            console.error("Error reading assessment data", error);
        }
    }, []);

    // Simulate analyzing process
    useEffect(() => {
        let ctx: gsap.Context;

        if (analyzing) {
            ctx = gsap.context(() => {
                // Loader animation
                gsap.to(".loader-dot", {
                    y: -10,
                    stagger: 0.15,
                    duration: 0.5,
                    yoyo: true,
                    repeat: -1,
                    ease: "power1.inOut"
                });

                // Circular progress
                gsap.to(".loader-progress", {
                    rotation: 360,
                    duration: 2,
                    repeat: -1,
                    ease: "linear"
                });
            }, containerRef);

            const timer = setTimeout(() => {
                gsap.to(".analyzing-screen", {
                    opacity: 0,
                    duration: 0.8,
                    onComplete: () => setAnalyzing(false)
                });
            }, 3500);

            return () => {
                clearTimeout(timer);
                ctx.revert();
            };
        } else {
            ctx = gsap.context(() => {
                // Results animation
                gsap.from(".results-header", {
                    y: -30,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out"
                });

                const cards = gsap.utils.toArray(".mentor-card");
                gsap.from(cards, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power3.out",
                    delay: 0.3
                });

                // Animate match counters
                const counters = gsap.utils.toArray(".match-counter");
                counters.forEach((counter: any) => {
                    const target = parseInt(counter.getAttribute("data-target") || "0", 10);
                    gsap.to(counter, {
                        innerHTML: target,
                        duration: 2,
                        snap: { innerHTML: 1 },
                        ease: "power2.out",
                        delay: 0.5,
                        onUpdate: function () {
                            counter.innerHTML = Math.round(this.targets()[0].innerHTML) + "%";
                        }
                    });
                });
            }, containerRef);

            return () => ctx.revert();
        }
    }, [analyzing]);

    return (
        <div ref={containerRef} className="min-h-screen bg-[#f4f4f4] text-[#111] flex flex-col relative overflow-hidden brutalist-grid">
            {/* Analyzing Screen Phase */}
            {analyzing && (
                <div className="analyzing-screen absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#f4f4f4]">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[1px] h-full bg-[#d1d1d1] -z-10" />
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[1px] bg-[#d1d1d1] -z-10" />

                    <div className="relative w-48 h-48 mb-12 flex items-center justify-center bg-white border-4 border-[#111] shadow-[12px_12px_0px_#111]">
                        <div className="loader-progress absolute inset-8 border-4 border-[#111] border-r-[#ff6a00] border-b-[#ff6a00] rounded-sm" />
                        <Star className="text-[#ff6a00] w-12 h-12" fill="#ff6a00" />
                        <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#ff6a00]" />
                        <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#111]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black font-sans uppercase mb-4 text-[#111]">
                        ANALYZING <br />RESPONSES.
                    </h2>
                    <div className="flex gap-4 mt-8">
                        <div className="loader-dot w-6 h-6 bg-[#111] border-2 border-[#111]" />
                        <div className="loader-dot w-6 h-6 bg-[#ff6a00] border-2 border-[#111]" />
                        <div className="loader-dot w-6 h-6 bg-[#111] border-2 border-[#111]" />
                    </div>
                    <p className="mt-8 text-[#555] font-mono font-bold tracking-widest uppercase text-sm bg-white border-2 border-[#111] px-4 py-2">RUNNING MATCHING ALGORITHM...</p>
                </div>
            )}

            {/* Results Phase */}
            {!analyzing && (
                <div className="results-container flex-1 w-full max-w-7xl mx-auto px-6 py-20 z-10">
                    <div className="results-header text-center mb-20 bg-white border-4 border-[#111] p-12 shadow-[16px_16px_0px_#111] relative">
                        <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#ff6a00]" />
                        <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#111]" />

                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff6a00] text-[#111] text-sm font-black font-sans uppercase tracking-widest mb-6 border-2 border-[#111]">
                            <CheckCircle size={18} strokeWidth={3} /> ANALYSIS COMPLETE
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black font-sans uppercase mb-4 text-[#111]">MATCHES FOUND.</h1>
                        <p className="text-[#555] font-mono text-xl font-bold uppercase tracking-widest">WE FOUND {mentors.length} MENTORS ALIGNED WITH YOUR GOALS.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {mentors.map((mentor) => (
                            <div
                                key={mentor.id}
                                className="mentor-card bg-white border-4 border-[#111] overflow-hidden group hover:-translate-y-2 transition-transform duration-300 shadow-[8px_8px_0px_#111] hover:shadow-[12px_12px_0px_#ff6a00] flex flex-col"
                            >
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between mb-8 pb-8 border-b-2 border-[#111]">
                                        <div className="relative border-4 border-[#111] shadow-[4px_4px_0px_#111]">
                                            <img
                                                src={mentor.avatar}
                                                alt={mentor.name}
                                                className="w-20 h-20 object-cover grayscale group-hover:grayscale-0 transition-all"
                                            />
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs font-black font-mono text-[#555] uppercase tracking-widest mb-2 border-b-2 border-[#ff6a00]">MATCH RATE</span>
                                            <div
                                                className="match-counter text-5xl font-black font-sans text-[#111]"
                                                data-target={mentor.match}
                                            >
                                                0%
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-3xl font-black font-sans uppercase text-[#111] mb-2">{mentor.name}</h3>
                                    <div className="text-[#ff6a00] font-bold font-mono text-sm mb-6 flex flex-col gap-1 uppercase tracking-wider">
                                        <span>[ {mentor.title} ]</span>
                                        <span className="text-[#555]">/ {mentor.industry}</span>
                                    </div>

                                    <p className="text-[#333] font-mono text-sm leading-relaxed mb-6 min-h-[80px]">
                                        {mentor.bio}
                                    </p>

                                    <div className="mt-auto space-y-4">
                                        <Link
                                            href={`/mentee/dashboard`}
                                            className="w-full py-4 px-6 font-black font-sans uppercase text-lg flex items-center justify-center gap-3 bg-[#111] text-white hover:bg-[#ff6a00] hover:text-[#111] transition-colors border-2 border-[#111]"
                                        >
                                            CONNECT <UserPlus size={20} strokeWidth={3} />
                                        </Link>

                                        {mentor.calendlyUrl && (
                                            <ScheduleButton
                                                calendlyUrl={mentor.calendlyUrl}
                                                mentorName={mentor.name}
                                                mentorId={mentor.id.toString()}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-24 text-center">
                        <Link
                            href="/mentee/dashboard"
                            className="inline-block p-4 border-b-4 border-transparent hover:border-[#111] text-[#111] font-black font-sans uppercase tracking-widest transition-colors text-xl"
                        >
                            SKIP TO MY DASHBOARD
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
