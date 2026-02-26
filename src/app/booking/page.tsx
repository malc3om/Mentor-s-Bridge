"use client";

import React, { useEffect } from 'react';
import gsap from 'gsap';
import ScheduleButton from '@/components/calendly/ScheduleButton';
import { Calendar, Clock, Video } from 'lucide-react';
import Link from 'next/link';

export default function BookingPage() {
    const containerRef = React.useRef<HTMLDivElement>(null);

    // GSAP Entrance Animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".booking-header", {
                y: -50,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            });

            gsap.from(".session-card", {
                y: 50,
                opacity: 0,
                duration: 0.6,
                stagger: 0.15,
                ease: "power3.out",
                delay: 0.2
            });
        }, containerRef);

        return () => ctx.revert(); // Cleanup for React Strict Mode
    }, []);

    // Mock upcoming sessions
    const upcomingSessions = [
        {
            id: "s1",
            mentorName: "Alex Rivera",
            date: "OCTOBER 15, 2026",
            time: "10:00 AM PST",
            topic: "Product Management Growth Plan",
            meetingLink: "https://zoom.us/mock-link-1"
        },
        {
            id: "s2",
            mentorName: "David Chen",
            date: "OCTOBER 22, 2026",
            time: "2:30 PM PST",
            topic: "Backend Architecture Review",
            meetingLink: "https://zoom.us/mock-link-2"
        }
    ];

    // Mock mentors to immediately book
    const discoverMentors = [
        {
            id: 2,
            name: "Samantha Lee",
            title: "Lead Frontend Engineer",
            calendlyUrl: "https://calendly.com", // Mock URL
        },
        {
            id: 4,
            name: "Marcus Johnson",
            title: "Senior UX Researcher",
            calendlyUrl: "https://calendly.com", // Mock URL
        }
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-[#f4f4f4] text-[#111] p-10 brutalist-grid font-mono relative overflow-hidden">
            <div className="absolute top-0 left-1/3 w-[1px] h-full bg-[#d1d1d1] -z-10" />

            <div className="max-w-7xl mx-auto space-y-16 relative z-10">

                {/* Header */}
                <header className="booking-header border-b-4 border-[#111] pb-8 relative">
                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#ff6a00]" />
                    <h1 className="text-5xl md:text-7xl font-black font-sans uppercase tracking-tighter text-[#111]">
                        YOUR <span className="text-[#ff6a00]">SESSIONS.</span>
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Column - Upcoming Sessions */}
                    <div className="col-span-1 lg:col-span-2 space-y-8">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="p-2 bg-[#111] text-white border-2 border-[#111]"><Calendar size={24} /></span>
                            <h2 className="text-3xl font-black font-sans uppercase tracking-tight">UPCOMING.</h2>
                        </div>

                        {upcomingSessions.length === 0 ? (
                            <div className="session-card bg-white border-4 border-[#111] p-10 shadow-[8px_8px_0px_#111] text-center">
                                <h3 className="text-2xl font-black font-sans uppercase tracking-tight mb-2">NO SESSIONS YET</h3>
                                <p className="text-[#555] font-bold uppercase tracking-widest text-sm">BOOK A MENTOR TO GET STARTED.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {upcomingSessions.map((session) => (
                                    <div key={session.id} className="session-card group bg-white border-4 border-[#111] p-8 shadow-[8px_8px_0px_#111] hover:shadow-[12px_12px_0px_#ff6a00] hover:-translate-y-2 transition-all duration-300 relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#111] group-hover:bg-[#ff6a00] transition-colors" />

                                        <div className="space-y-2 flex-1">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f4f4f4] border-2 border-[#111] text-xs font-bold uppercase tracking-wider mb-2">
                                                <Clock size={14} /> {session.date} @ {session.time}
                                            </div>
                                            <h3 className="text-3xl font-black font-sans uppercase hover:text-[#ff6a00] transition-colors cursor-pointer">{session.mentorName}</h3>
                                            <p className="text-[#555] font-bold tracking-widest uppercase text-sm">{session.topic}</p>
                                        </div>

                                        <div className="w-full md:w-auto mt-4 md:mt-0">
                                            <a
                                                href={session.meetingLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#111] text-white font-black font-sans uppercase tracking-wider border-2 border-[#111] hover:bg-[#ff6a00] hover:text-[#111] transition-colors shadow-[4px_4px_0px_#111]"
                                            >
                                                JOIN CALL <Video size={18} />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Discover Mentors */}
                    <div className="col-span-1 space-y-8">
                        <div className="flex items-center gap-4 mb-6">
                            <h2 className="text-3xl font-black font-sans uppercase tracking-tight">DISCOVER.</h2>
                        </div>

                        <div className="bg-[#111] text-white border-4 border-[#111] p-8 shadow-[8px_8px_0px_#ff6a00] relative">
                            <div className="space-y-8">
                                <p className="font-bold tracking-widest uppercase text-sm border-b-2 border-[#333] pb-4">
                                    AVAILABLE NOW
                                </p>

                                {discoverMentors.map((mentor) => (
                                    <div key={mentor.id} className="space-y-4">
                                        <div>
                                            <h4 className="text-xl font-black font-sans uppercase text-[#ff6a00]">{mentor.name}</h4>
                                            <p className="text-[#aaa] text-xs font-bold tracking-widest uppercase">{mentor.title}</p>
                                        </div>
                                        <ScheduleButton
                                            calendlyUrl={mentor.calendlyUrl}
                                            mentorName={mentor.name}
                                            mentorId={mentor.id.toString()}
                                        />
                                    </div>
                                ))}

                                <Link href="/mentorships" className="block text-center pt-4 border-t-2 border-[#333] hover:text-[#ff6a00] font-bold tracking-widest uppercase transition-colors">
                                    VIEW ALL MENTORS +
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
