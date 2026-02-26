"use client";

import React from 'react';
import ScheduleButton from '@/components/calendly/ScheduleButton';

export default function MentorshipsPage() {

    // Mock mentor data to test the Calendly integration
    const mockMentors = [
        {
            id: "m001",
            name: "Sarah Jenkins",
            role: "Senior UX Designer",
            calendlyUrl: "https://calendly.com", // Using general calendly for generic testing
            matchScore: 98,
            bio: "Helping juniors transition into senior roles and master design systems."
        },
        {
            id: "m002",
            name: "David Chen",
            role: "Lead Software Engineer",
            calendlyUrl: "https://calendly.com", // Using general calendly for generic testing
            matchScore: 92,
            bio: "Specializing in robust backend architecture and interview preparation."
        },
    ];

    return (
        <div className="min-h-screen bg-[#f4f4f4] text-[#111] p-10 brutalist-grid font-mono relative">
            <div className="absolute top-0 left-1/3 w-[1px] h-full bg-[#d1d1d1] -z-10" />

            <div className="max-w-7xl mx-auto space-y-12">
                <header className="border-b-4 border-[#111] pb-8 relative">
                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#ff6a00]" />
                    <h1 className="text-5xl md:text-7xl font-black font-sans uppercase tracking-tighter text-[#111]">
                        Explore <span className="text-[#ff6a00]">Mentorships.</span>
                    </h1>
                </header>

                <div className="space-y-12">
                    {mockMentors.map((mentor) => (
                        <div key={mentor.id} className="bg-white border-4 border-[#111] p-10 shadow-[12px_12px_0px_#111] relative group hover:-translate-y-2 transition-transform">
                            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#111] group-hover:bg-[#ff6a00] transition-colors" />

                            <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                                {/* Mentor Info */}
                                <div className="flex gap-8 items-start">
                                    <div className="w-24 h-24 border-4 border-[#111] bg-[#f4f4f4] flex-shrink-0" />
                                    <div>
                                        <h2 className="text-4xl font-black font-sans uppercase mb-2 group-hover:text-[#ff6a00] transition-colors">{mentor.name}</h2>
                                        <p className="text-[#555] font-bold tracking-widest uppercase mb-4">{mentor.role}</p>
                                        <p className="text-[#111] max-w-2xl">{mentor.bio}</p>
                                    </div>
                                </div>

                                {/* Match Score & Action */}
                                <div className="flex flex-col items-start lg:items-end w-full lg:w-auto">
                                    <div className="text-right mb-4">
                                        <span className="text-xs font-bold tracking-widest text-[#555] uppercase">Compatibility</span>
                                        <div className="text-4xl font-black font-sans text-[#ff6a00]">{mentor.matchScore}% MATCH</div>
                                    </div>
                                    <ScheduleButton
                                        calendlyUrl={mentor.calendlyUrl}
                                        mentorName={mentor.name}
                                        mentorId={mentor.id}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
