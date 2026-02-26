"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import CalendlyEmbed from "./CalendlyEmbed";

interface ScheduleButtonProps {
    calendlyUrl: string;
    mentorName: string;
    mentorId: string;
}

export default function ScheduleButton({
    calendlyUrl,
    mentorName,
    mentorId
}: ScheduleButtonProps) {
    const [showCalendly, setShowCalendly] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!buttonRef.current) return;
        const button = buttonRef.current;

        const handleMouseEnter = () => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.2,
                ease: "power2.out"
            });
        };

        const handleMouseLeave = () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.2,
                ease: "power2.out"
            });
        };

        button.addEventListener("mouseenter", handleMouseEnter);
        button.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            button.removeEventListener("mouseenter", handleMouseEnter);
            button.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    const handleClick = () => {
        setShowCalendly(!showCalendly);

        // Smooth scroll if opening
        if (!showCalendly) {
            setTimeout(() => {
                const element = document.getElementById("calendly-widget-" + mentorId);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 100);
        }
    };

    return (
        <div className="schedule-button-container mt-6">
            <button
                ref={buttonRef}
                onClick={handleClick}
                className="w-full sm:w-auto px-8 py-4 bg-[#ff6a00] text-[#111] font-black font-sans uppercase tracking-widest text-lg border-4 border-[#111] hover:bg-white hover:text-[#111] transition-colors shadow-[6px_6px_0px_#111] flex items-center justify-center gap-2"
            >
                {showCalendly ? "HIDE CALENDAR" : "BOOK SESSION"}
            </button>

            {showCalendly && (
                <div id={"calendly-widget-" + mentorId}>
                    <CalendlyEmbed
                        url={calendlyUrl}
                        mentorName={mentorName}
                    />
                </div>
            )}
        </div>
    );
}
