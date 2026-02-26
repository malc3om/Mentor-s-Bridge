"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function MenteeAssessment() {
    const { isLoaded, isSignedIn } = useUser();
    const [currentStep, setCurrentStep] = useState(0);
    const router = useRouter();
    const qContainerRef = useRef<HTMLDivElement>(null);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push("/sign-up?redirect_url=/mentee/assessment");
        }
    }, [isLoaded, isSignedIn, router]);

    if (!isLoaded || !isSignedIn) {
        return (
            <div className="min-h-screen bg-[#f4f4f4] brutalist-grid flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-[#ff6a00] animate-spin" />
                    <p className="font-mono font-bold tracking-widest uppercase">Authorizing...</p>
                </div>
            </div>
        );
    }

    const questions = [
        {
            id: "current_status",
            title: "1. What is your current status?",
            type: "radio",
            options: ["School Student", "College Student", "Graduate", "Working Professional"]
        },
        {
            id: "academic_background",
            title: "2. What is your academic background?",
            type: "radio",
            options: ["Science", "Commerce", "Arts / Humanities", "Engineering / Technical", "Other"]
        },
        {
            id: "current_year",
            title: "3. What is your current year/level?",
            type: "radio",
            options: ["9–12", "1st Year", "2nd Year", "3rd/Final Year", "Completed Studies"]
        },
        {
            id: "primary_goal",
            title: "4. What is your primary goal right now?",
            type: "radio",
            options: ["Get a Job", "Prepare for Government Exam", "Higher Studies", "Start a Business", "Improve Skills"]
        },
        {
            id: "domain_interest",
            title: "5. Which domain are you most interested in?",
            type: "radio",
            options: ["Software Development", "AI / Data Science", "Marketing", "Finance", "Design / UI-UX", "Civil Services", "Entrepreneurship"]
        },
        {
            id: "mentorship_type",
            title: "6. What type of mentorship are you looking for?",
            type: "radio",
            options: ["Career Guidance", "Skill Development", "Resume Building", "Interview Preparation", "Startup Guidance"]
        },
        {
            id: "skill_level",
            title: "7. What is your current skill level in your chosen domain?",
            type: "radio",
            options: ["Beginner", "Intermediate", "Advanced"]
        },
        {
            id: "biggest_challenge",
            title: "8. What is your biggest challenge?",
            type: "radio",
            options: ["Lack of Direction", "Lack of Skills", "Time Management", "Confidence Issues", "Resources / Guidance"]
        },
        {
            id: "timeline",
            title: "9. How soon do you want to achieve your goal?",
            type: "radio",
            options: ["Within 6 Months", "1 Year", "2-3 Years", "Not Sure"]
        },
        {
            id: "connection_frequency",
            title: "10. How often would you like to connect with your mentor?",
            type: "radio",
            options: ["Weekly", "Bi-Weekly", "Monthly"]
        },
        {
            id: "weekly_time",
            title: "11. How much time can you dedicate weekly?",
            type: "radio",
            options: ["2-4 Hours", "5-8 Hours", "8+ Hours"]
        },
        {
            id: "mentorship_mode",
            title: "12. Preferred mentorship mode?",
            type: "radio",
            options: ["Online", "Hybrid", "Offline"]
        },
        {
            id: "expected_outcome",
            title: "13. What outcome do you expect after mentorship?",
            type: "radio",
            options: ["Clear Career Roadmap", "Job Ready Skills", "Government Exam Strategy", "Startup Plan Ready", "Portfolio / Resume Ready"]
        },
        {
            id: "main_blocker",
            title: "14. What is the main thing you want to achieve but feel unable to progress in right now?",
            type: "textarea",
            placeholder: "Describe your main blocker..."
        }
    ];

    const handleNext = async () => {
        if (currentStep < questions.length - 1) {
            animateTransition(() => setCurrentStep(prev => prev + 1));
        } else {
            // Finished
            setIsSubmitting(true);
            sessionStorage.setItem('menteeAssessment', JSON.stringify(answers));

            try {
                const response = await fetch('/api/assessment/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(answers)
                });

                const data = await response.json();

                if (data.success) {
                    if (data.data?.tempProfile) {
                        sessionStorage.setItem('bypassProfileInsights', JSON.stringify(data.data.tempProfile));
                    }
                    router.push(data.redirect || "/profile");
                } else {
                    console.error("Submission failed:", data.error);
                    alert("Failed to generate profile. Please try again.");
                }
            } catch (err) {
                console.error("Error submitting assessment:", err);
                alert("An error occurred. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            animateTransition(() => setCurrentStep(prev => prev - 1), true);
        }
    };

    const animateTransition = (callback: () => void, isBack = false) => {
        const el = qContainerRef.current;
        if (!el) return;

        gsap.to(el, {
            opacity: 0,
            x: isBack ? 50 : -50,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                callback();
                gsap.fromTo(el,
                    { opacity: 0, x: isBack ? -50 : 50 },
                    { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
                );
            }
        });
    };

    useEffect(() => {
        gsap.from(".progress-bar", {
            width: 0,
            duration: 1,
            ease: "power3.out",
        });
    }, []);

    const progress = Math.round(((currentStep + 1) / questions.length) * 100);
    const q = questions[currentStep];

    const handleInput = (val: any) => {
        setAnswers({ ...answers, [q.id]: val });
    };

    return (
        <div className="min-h-screen bg-[#f4f4f4] text-[#111] flex flex-col brutalist-grid">
            {/* Animated Top Progress Bar */}
            <div className="w-full h-3 bg-white border-b-2 border-[#111]">
                <div
                    className="progress-bar h-full bg-[#ff6a00] transition-all duration-300 border-r-2 border-[#111]"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <nav className="px-8 py-6 flex justify-between items-center bg-white border-b-4 border-[#111]">
                <div className="text-xl font-black font-sans uppercase tracking-tight">
                    <span className="text-[#ff6a00] mr-2">/</span> Mentee Profile Setup
                </div>
                <div className="text-[#555] font-mono font-bold text-sm bg-[#f4f4f4] px-4 py-2 border-2 border-[#111]">
                    STEP {currentStep + 1} OF {questions.length}
                </div>
            </nav>

            <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[1px] h-full bg-[#d1d1d1] -z-10" />
                <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-[1px] h-full bg-[#d1d1d1] -z-10" />

                <div className="w-full max-w-3xl z-10 bg-white border-4 border-[#111] p-10 md:p-14 shadow-[16px_16px_0px_#111] relative">
                    {/* Corner accents */}
                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#ff6a00]" />
                    <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#111]" />

                    <div ref={qContainerRef} className="pb-12">
                        <h1 className="text-3xl md:text-5xl font-black font-sans uppercase mb-10 text-[#111] leading-tight">
                            {q.title}
                        </h1>

                        {/* Assessment Component Renderer */}
                        <div className="space-y-4 font-mono font-medium">
                            {q.type === "radio" && q.options?.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => handleInput(opt)}
                                    className={`w-full text-left p-6 border-2 transition-all duration-200 text-lg uppercase shadow-[4px_4px_0px_#111] hover:shadow-[6px_6px_0px_#ff6a00] hover:-translate-y-1 ${answers[q.id] === opt
                                        ? "border-[#ff6a00] bg-[#111] text-white"
                                        : "border-[#111] bg-white text-[#111] hover:bg-[#111] hover:text-[#ff6a00]"
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}

                            {q.type === "text" && (
                                <input
                                    type="text"
                                    autoFocus
                                    className="w-full p-6 border-4 border-[#111] bg-white text-[#111] text-xl font-bold font-sans focus:outline-none focus:border-[#ff6a00] transition-colors shadow-[8px_8px_0px_#111]"
                                    placeholder={q.placeholder}
                                    value={answers[q.id] || ""}
                                    onChange={(e) => handleInput(e.target.value)}
                                />
                            )}

                            {q.type === "textarea" && (
                                <textarea
                                    autoFocus
                                    rows={4}
                                    maxLength={150}
                                    className="w-full p-6 border-4 border-[#111] bg-white text-[#111] text-xl font-bold font-sans focus:outline-none focus:border-[#ff6a00] transition-colors resize-none shadow-[8px_8px_0px_#111]"
                                    placeholder={q.placeholder}
                                    value={answers[q.id] || ""}
                                    onChange={(e) => handleInput(e.target.value)}
                                />
                            )}


                        </div>
                    </div>

                    <div className="flex justify-between mt-12 bg-[#f4f4f4] p-4 border-2 border-[#111]">
                        <button
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-2 px-6 py-4 font-bold font-sans uppercase text-lg transition-colors border-2 ${currentStep === 0
                                ? "opacity-30 cursor-not-allowed border-transparent text-[#555]"
                                : "border-[#111] bg-white text-[#111] hover:bg-[#111] hover:text-white"
                                }`}
                        >
                            <ArrowLeft size={20} strokeWidth={3} /> Back
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={!answers[q.id] || isSubmitting}
                            className={`flex items-center gap-2 px-10 py-4 font-black font-sans text-xl uppercase transition-all border-2 ${!!answers[q.id] && !isSubmitting
                                ? "bg-[#ff6a00] border-[#111] text-[#111] hover:bg-[#111] hover:text-[#ff6a00] shadow-[4px_4px_0px_#111] hover:shadow-[6px_6px_0px_#ff6a00]"
                                : "bg-white border-[#d1d1d1] text-[#aaa] cursor-not-allowed"
                                }`}
                        >
                            {currentStep === questions.length - 1 ? (isSubmitting ? "Processing Profile..." : "Complete Setup") : "Continue"}
                            <ArrowRight size={20} strokeWidth={3} className={isSubmitting ? "animate-pulse" : ""} />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
