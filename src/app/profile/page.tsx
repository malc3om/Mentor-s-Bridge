"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import Link from "next/link";
import { ArrowRight, Brain, Target, Compass, Sparkles, BookOpen, AlertTriangle, Cpu, TrendingUp } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface CareerPrediction {
    predicted_career: string;
    confidence: number;
    top_careers?: string[];
    explanation?: string;
}

interface ProfileInsights {
    professional_summary: string;
    career_stage: string;
    industry: string;
    primary_goals: string[];
    key_strengths: string[];
    areas_for_development: string[];
    learning_style: string;
    mentorship_preferences: string;
    success_vision: string;
    recommended_focus_areas: string[];
    personality_insights: string;
    confidence_level: number;
    engagement_score: number;
    /** Attached by the Railway ML backend (optional – may be null) */
    career_prediction?: CareerPrediction | null;
}

export default function MenteeProfilePage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [profile, setProfile] = useState<ProfileInsights | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Refs for GSAP animations
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isLoaded && user) {
            fetchProfile();
        } else if (isLoaded && !user) {
            // Not logged in
            router.push("/sign-in");
        }
    }, [isLoaded, user]);

    useEffect(() => {
        if (profile && !loading && containerRef.current) {
            const ctx = gsap.context(() => {
                gsap.from(".profile-section", {
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".profile-section",
                        start: "top 90%",
                    }
                });
            }, containerRef);
            return () => ctx.revert();
        }
    }, [profile, loading]);

    const fetchProfile = async () => {
        try {
            // First check if we have a temporarily saved profile from the assessment
            const bypassProfile = sessionStorage.getItem('bypassProfileInsights');
            if (bypassProfile) {
                setProfile(JSON.parse(bypassProfile));
                setLoading(false);
                return;
            }

            // Fallback to database
            const response = await fetch("/api/profile");
            const data = await response.json();

            if (!data.success && response.status !== 404) {
                throw new Error(data.error);
            }

            if (!data.hasProfile) {
                // No profile yet, redirect to assessment
                router.push("/mentee/assessment");
                return;
            }

            setProfile(data.profile.profile_insights);
        } catch (err) {
            console.error("Error fetching profile:", err);
            setError(err instanceof Error ? err.message : "Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    if (loading || !isLoaded) {
        return <ProfileSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-[#f4f4f4] text-[#111] brutalist-grid font-mono">
                <div className="bg-[#ff6a00] border-4 border-[#111] shadow-[8px_8px_0px_#111] p-8 max-w-xl text-center">
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-[#111]" />
                    <h2 className="text-3xl font-black mb-2 uppercase">Error Loading Profile</h2>
                    <p className="text-lg font-bold mb-6">{error}</p>
                    <button
                        onClick={() => router.push("/mentee/assessment")}
                        className="px-8 py-4 bg-[#111] text-white font-bold text-xl uppercase hover:bg-white hover:text-[#111] transition-all border-4 border-[#111] shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                    >
                        Retake Assessment
                    </button>
                </div>
            </div>
        );
    }

    if (!profile) return null; // handled by redirect

    return (
        <div ref={containerRef} className="min-h-screen bg-[#f4f4f4] text-[#111] brutalist-grid font-mono pt-24 pb-20 px-6 sm:px-12">
            <div className="max-w-6xl mx-auto">

                {/* Page Header */}
                <div className="profile-section mb-16 border-b-8 border-[#111] pb-8">
                    <div className="inline-block bg-[#ff6a00] text-[#111] px-4 py-1 text-sm font-black tracking-widest uppercase mb-4 shadow-[4px_4px_0px_#111] border-2 border-[#111]">
                        ANALYSIS COMPLETE
                    </div>
                    <h1 className="text-6xl sm:text-8xl font-black tracking-tighter uppercase mb-4">
                        The <span className="text-[#ff6a00]">Blueprint.</span>
                    </h1>
                    <p className="text-2xl font-bold max-w-3xl border-l-8 border-[#111] pl-6 py-2">
                        {profile.professional_summary}
                    </p>
                </div>

                {/* Top Grid: Avatar & Meta Stats */}
                <div className="profile-section grid lg:grid-cols-3 gap-8 mb-16">

                    {/* Identity Card */}
                    <div className="col-span-1 border-4 border-[#111] shadow-[12px_12px_0px_#111] bg-white p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6a00] rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>

                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-[#111] text-[#f4f4f4] text-5xl font-black flex items-center justify-center border-4 border-[#ff6a00] shadow-[6px_6px_0px_#ff6a00] mb-8">
                                {user?.firstName?.charAt(0) || "M"}
                            </div>

                            <h2 className="text-3xl font-black uppercase mb-1">{user?.fullName || "Mentee"}</h2>
                            <div className="inline-flex flex-col gap-2 mt-4">
                                <span className="bg-[#111] text-white px-3 py-1 font-bold text-sm inline-block w-fit">
                                    {profile.career_stage}
                                </span>
                                <span className="bg-white text-[#111] border-2 border-[#111] px-3 py-1 font-bold text-sm inline-block w-fit">
                                    {profile.industry}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Numbers Widget */}
                    <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">

                        <div className="border-4 border-[#111] bg-[#ff6a00] p-8 flex flex-col justify-center shadow-[12px_12px_0px_#111] transform hover:-translate-y-2 transition-transform">
                            <div className="text-sm font-black uppercase tracking-widest border-b-4 border-[#111] pb-2 mb-4">Career Confidence</div>
                            <div className="text-8xl font-black">{profile.confidence_level}<span className="text-4xl">/5</span></div>
                        </div>

                        <div className="border-4 border-[#111] bg-white p-8 flex flex-col justify-center shadow-[12px_12px_0px_#111] transform hover:-translate-y-2 transition-transform">
                            <div className="text-sm font-black uppercase tracking-widest border-b-4 border-[#111] pb-2 mb-4">Engagement Score</div>
                            <div className="text-8xl font-black">{profile.engagement_score}<span className="text-4xl text-gray-400">/10</span></div>
                        </div>
                    </div>
                </div>

                {/* Mentorship Core Section */}
                <div className="profile-section grid md:grid-cols-2 gap-12 mb-16">

                    {/* Visual Goals */}
                    <div className="border-4 border-[#111] bg-white p-10 shadow-[8px_8px_0px_#ff6a00]">
                        <div className="flex items-center gap-4 mb-8">
                            <Target className="w-12 h-12 text-[#ff6a00]" />
                            <h3 className="text-4xl font-black uppercase">Core Objectives</h3>
                        </div>

                        <ul className="space-y-6">
                            {profile.primary_goals.map((goal, idx) => (
                                <li key={idx} className="flex gap-4 items-start group">
                                    <span className="bg-[#111] text-white w-10 h-10 flex items-center justify-center font-black flex-shrink-0 group-hover:bg-[#ff6a00] transition-colors shadow-[4px_4px_0px_#111]">
                                        0{idx + 1}
                                    </span>
                                    <span className="text-lg font-bold leading-tight pt-1">{goal}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Focus Areas */}
                    <div className="border-4 border-[#111] bg-[#111] text-[#f4f4f4] p-10 shadow-[8px_8px_0px_#ff6a00]">
                        <div className="flex items-center gap-4 mb-8">
                            <Compass className="w-12 h-12 text-[#ff6a00]" />
                            <h3 className="text-4xl font-black uppercase">Action Tracks</h3>
                        </div>

                        <div className="space-y-4">
                            {profile.recommended_focus_areas.map((area, idx) => (
                                <div key={idx} className="border-2 border-white/20 p-4 hover:border-[#ff6a00] transition-colors">
                                    <span className="text-[#ff6a00] font-black mr-3">►</span>
                                    <span className="font-bold">{area}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Attributes Ribbon */}
                <div className="profile-section mb-16">
                    <h3 className="text-3xl font-black uppercase mb-8 border-b-4 border-[#111] pb-2 inline-block">Strengths & Gaps</h3>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Strengths */}
                        <div className="border-4 border-[#111] bg-[#f4f4f4] p-6 shadow-[8px_8px_0px_#111]">
                            <div className="font-black text-xl mb-4 text-[#ff6a00] uppercase">Identified Strengths</div>
                            <div className="flex flex-wrap gap-3">
                                {profile.key_strengths.map((str, idx) => (
                                    <span key={idx} className="bg-white border-2 border-[#111] px-4 py-2 font-bold uppercase text-sm shadow-[2px_2px_0px_#111] hover:bg-[#111] hover:text-white transition-colors cursor-default">
                                        + {str}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Development */}
                        <div className="border-4 border-[#111] bg-white p-6 shadow-[8px_8px_0px_#111]">
                            <div className="font-black text-xl mb-4 text-gray-400 uppercase">Growth Edges</div>
                            <div className="flex flex-wrap gap-3">
                                {profile.areas_for_development.map((dev, idx) => (
                                    <span key={idx} className="border-2 border-gray-300 text-gray-500 px-4 py-2 font-bold uppercase text-sm border-dashed">
                                        / {dev}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mindset Analytics Grid */}
                <div className="profile-section grid md:grid-cols-3 gap-8 mb-20">
                    <div className="border-4 border-[#111] p-8 shadow-[8px_8px_0px_#111] bg-white group hover:bg-[#111] hover:text-[#f4f4f4] transition-colors duration-300">
                        <BookOpen className="w-10 h-10 mb-4 group-hover:text-[#ff6a00]" />
                        <h4 className="text-xl font-black uppercase mb-4">Learning Vector</h4>
                        <p className="font-medium text-lg leading-snug">{profile.learning_style}</p>
                    </div>

                    <div className="border-4 border-[#ff6a00] p-8 shadow-[8px_8px_0px_#ff6a00] bg-white">
                        <Sparkles className="w-10 h-10 mb-4 text-[#ff6a00]" />
                        <h4 className="text-xl font-black uppercase mb-4">Mentorship Needs</h4>
                        <p className="font-medium text-lg leading-snug">{profile.mentorship_preferences}</p>
                    </div>

                    <div className="border-4 border-[#111] p-8 bg-[#ff6a00] shadow-[8px_8px_0px_#111]">
                        <Brain className="w-10 h-10 mb-4 text-[#111]" />
                        <h4 className="text-xl font-black uppercase mb-4">Psychometric Intel</h4>
                        <p className="font-bold text-lg leading-snug">"{profile.personality_insights}"</p>
                    </div>
                </div>

                {/* ── Railway ML Career Prediction Card ─────────────────────────────── */}
                {profile.career_prediction && (
                    <div className="profile-section mb-20">
                        <div className="border-4 border-[#111] bg-[#111] text-[#f4f4f4] p-10 shadow-[16px_16px_0px_#ff6a00] relative overflow-hidden">
                            {/* Decorative corner */}
                            <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#ff6a00]" />
                            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-white" />

                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-[#ff6a00] text-[#111] px-4 py-1 text-xs font-black tracking-widest uppercase mb-6 border-2 border-[#ff6a00] shadow-[2px_2px_0px_#fff]">
                                <Cpu className="w-4 h-4" />
                                ML CAREER PREDICTION · RAILWAY ENGINE
                            </div>

                            <div className="flex flex-col md:flex-row md:items-end gap-8 mb-8">
                                <div className="flex-1">
                                    <p className="text-[#ff6a00] font-mono font-bold text-sm uppercase tracking-widest mb-2">Predicted Best-Fit Career</p>
                                    <h2 className="text-5xl md:text-7xl font-black uppercase leading-none">
                                        {profile.career_prediction.predicted_career}
                                    </h2>
                                </div>

                                {/* Confidence Meter */}
                                <div className="flex-shrink-0 border-4 border-[#ff6a00] p-6 min-w-[160px]">
                                    <p className="text-[#ff6a00] font-mono font-bold text-xs uppercase tracking-widest mb-2">Confidence</p>
                                    <div className="text-6xl font-black">
                                        {Math.round((profile.career_prediction.confidence ?? 0) * 100)}
                                        <span className="text-3xl text-[#ff6a00]">%</span>
                                    </div>
                                    {/* Confidence bar */}
                                    <div className="mt-3 h-2 w-full bg-white/20 rounded-none">
                                        <div
                                            className="h-2 bg-[#ff6a00] transition-all duration-700"
                                            style={{ width: `${Math.round((profile.career_prediction.confidence ?? 0) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Explanation */}
                            {profile.career_prediction.explanation && (
                                <p className="text-white/80 font-mono text-sm leading-relaxed mb-6 border-l-4 border-[#ff6a00] pl-4">
                                    {profile.career_prediction.explanation}
                                </p>
                            )}

                            {/* Alternative careers */}
                            {profile.career_prediction.top_careers && profile.career_prediction.top_careers.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <TrendingUp className="w-5 h-5 text-[#ff6a00]" />
                                        <span className="text-[#ff6a00] font-mono font-bold text-xs uppercase tracking-widest">Alternative Career Paths</span>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {profile.career_prediction.top_careers.map((career: string, idx: number) => (
                                            <span
                                                key={idx}
                                                className="border-2 border-white/30 text-white/80 px-4 py-2 font-bold uppercase text-sm hover:border-[#ff6a00] hover:text-[#ff6a00] transition-colors cursor-default"
                                            >
                                                {career}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Massive Call to Action */}
                <div className="profile-section text-center border-t-8 border-[#111] pt-16 mt-16 pb-12">
                    <p className="text-2xl font-black uppercase tracking-widest text-[#ff6a00] mb-8">Ready to interface?</p>
                    <button
                        onClick={() => router.push("/mentee/matches")}
                        className="group relative inline-flex items-center gap-6 px-16 py-8 bg-[#111] text-[#f4f4f4] text-3xl font-black uppercase tracking-tighter shadow-[12px_12px_0px_#ff6a00] hover:translate-x-1 hover:translate-y-1 hover:shadow-[6px_6px_0px_#ff6a00] transition-all duration-200"
                    >
                        <span>Compute Matches</span>
                        <ArrowRight className="w-10 h-10 group-hover:translate-x-4 transition-transform text-[#ff6a00]" strokeWidth={3} />
                    </button>
                </div>

            </div>
        </div>
    );
}
