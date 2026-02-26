"use client";

import { useRef, useEffect } from "react";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import gsap from "gsap";

interface CalendlyEmbedProps {
    url: string;
    mentorName: string;
    onEventScheduled?: (eventData: any) => void;
}

export default function CalendlyEmbed({
    url,
    mentorName,
    onEventScheduled
}: CalendlyEmbedProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // GSAP Animation on mount
    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current,
                {
                    opacity: 0,
                    y: 50,
                    height: 0,
                    overflow: "hidden"
                },
                {
                    opacity: 1,
                    y: 0,
                    height: "auto",
                    duration: 0.8,
                    ease: "power3.out",
                    onComplete: () => {
                        if (containerRef.current) {
                            containerRef.current.style.overflow = "visible";
                        }
                    }
                }
            );
        }
    }, []);

    // Track booking events
    useCalendlyEventListener({
        onEventScheduled: (e) => {
            console.log("Event scheduled:", e.data.payload);
            if (onEventScheduled) {
                onEventScheduled(e.data.payload);
            }
            alert("Session booked successfully with " + mentorName + "!");
        }
    });

    return (
        <div
            ref={containerRef}
            className="w-full mt-10 bg-[#111] border-4 border-[#111] p-6 shadow-[12px_12px_0px_#ff6a00] relative"
        >
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#ff6a00]" />

            {/* Header */}
            <div className="mb-6 pb-4 border-b-2 border-[#333]">
                <h2 className="text-3xl font-black font-sans uppercase text-white mb-2 tracking-tighter">
                    SCHEDULE WITH <span className="text-[#ff6a00]">{mentorName}</span>
                </h2>
                <p className="text-[#888] font-bold tracking-widest text-sm uppercase">
                    Select a time that works best for you.
                </p>
            </div>

            {/* Calendly Widget */}
            <div className="border-4 border-[#111] bg-white overflow-hidden shadow-[8px_8px_0px_#111] relative z-10">
                <InlineWidget
                    url={url}
                    styles={{
                        height: "700px",
                        width: "100%"
                    }}
                    pageSettings={{
                        backgroundColor: "ffffff",
                        hideEventTypeDetails: false,
                        hideLandingPageDetails: false,
                        primaryColor: "ff6a00", // Using brutalist orange
                        textColor: "111111"
                    }}
                />
            </div>
        </div>
    );
}
