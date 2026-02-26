"use client";

import { useState } from "react";

interface CalendlySetupGuideProps {
    onComplete: (calendlyUrl: string) => void;
    onSkip?: () => void;
}

export default function CalendlySetupGuide({ onComplete, onSkip }: CalendlySetupGuideProps) {
    const [calendlyUrl, setCalendlyUrl] = useState("");
    const [error, setError] = useState("");
    const [isValidating, setIsValidating] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsValidating(true);

        // Basic Validation
        if (!calendlyUrl.includes("calendly.com") && calendlyUrl !== "") {
            setError("Please enter a valid Calendly URL (e.g., https://calendly.com/yourname/30min)");
            setIsValidating(false);
            return;
        }

        try {
            // Intentionally mocking backend call here for MVP. 
            // Supabase endpoints will go here
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network check
            onComplete(calendlyUrl);
        } catch (err) {
            setError("Failed to save Calendly URL. Please try again.");
        } finally {
            setIsValidating(false);
        }
    };

    return (
        <div className="bg-white border-4 border-[#111] p-10 shadow-[12px_12px_0px_#111] max-w-3xl mx-auto relative mt-10">
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#ff6a00] border-4 border-[#111]" />

            {/* Header */}
            <div className="mb-10 text-center border-b-4 border-[#111] pb-6">
                <h2 className="text-4xl md:text-5xl font-black font-sans uppercase tracking-tighter text-[#111] mb-2">
                    CONNECT <span className="text-[#ff6a00]">CALENDAR.</span>
                </h2>
                <p className="text-[#555] font-bold tracking-widest text-sm uppercase">
                    Enable automatic scheduling for your mentees
                </p>
            </div>

            {/* Benefits */}
            <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-[#f4f4f4] border-2 border-[#111] shadow-[4px_4px_0px_#111] hover:-translate-y-1 transition-transform">
                    <div className="text-3xl mb-3">⚡</div>
                    <h3 className="font-black font-sans uppercase text-[#111] text-xl mb-1">Instant</h3>
                    <p className="text-xs font-bold tracking-widest text-[#555] uppercase">No Back-And-Forth</p>
                </div>
                <div className="text-center p-6 bg-[#f4f4f4] border-2 border-[#111] shadow-[4px_4px_0px_#111] hover:-translate-y-1 transition-transform">
                    <div className="text-3xl mb-3">🔄</div>
                    <h3 className="font-black font-sans uppercase text-[#111] text-xl mb-1">Auto Sync</h3>
                    <p className="text-xs font-bold tracking-widest text-[#555] uppercase">Live Availability</p>
                </div>
                <div className="text-center p-6 bg-[#f4f4f4] border-2 border-[#111] shadow-[4px_4px_0px_#111] hover:-translate-y-1 transition-transform">
                    <div className="text-3xl mb-3">🎯</div>
                    <h3 className="font-black font-sans uppercase text-[#111] text-xl mb-1">Zero Setup</h3>
                    <p className="text-xs font-bold tracking-widest text-[#555] uppercase">Do it once</p>
                </div>
            </div>

            {/* Instructions */}
            <div className="mb-10 bg-[#111] text-white rounded-none p-8 border-4 border-[#111] shadow-[8px_8px_0px_#ff6a00]">
                <h3 className="text-xl font-black font-sans uppercase mb-6 text-[#ff6a00]">
                    How to Setup (2 Min)
                </h3>
                <ol className="space-y-4 font-mono text-sm leading-relaxed">
                    <li className="flex items-start">
                        <span className="font-black text-[#ff6a00] mr-4 text-lg">1.</span>
                        <span>
                            Go to{" "}
                            <a
                                href="https://calendly.com/signup"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-[#ff6a00] underline font-bold transition-colors"
                            >
                                calendly.com
                            </a>
                            {" "}and create a free account.
                        </span>
                    </li>
                    <li className="flex items-start">
                        <span className="font-black text-[#ff6a00] mr-4 text-lg">2.</span>
                        <span>Connect your Google or Outlook calendar.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="font-black text-[#ff6a00] mr-4 text-lg">3.</span>
                        <span>Set your availability (when you're free to mentor).</span>
                    </li>
                    <li className="flex items-start">
                        <span className="font-black text-[#ff6a00] mr-4 text-lg">4.</span>
                        <span>Create a <strong>"Mentorship Session"</strong> event (30 mins).</span>
                    </li>
                    <li className="flex items-start">
                        <span className="font-black text-[#ff6a00] mr-4 text-lg">5.</span>
                        <span>
                            Copy your unique link (<code className="bg-[#333] px-2 py-1 text-[#ff6a00]">calendly.com/name/30min</code>) and paste it below.
                        </span>
                    </li>
                </ol>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="mb-2">
                <label htmlFor="calendlyUrl" className="block text-sm font-bold tracking-widest text-[#111] uppercase mb-3">
                    Your Calendly Link
                </label>
                <input
                    id="calendlyUrl"
                    type="url"
                    value={calendlyUrl}
                    onChange={(e) => setCalendlyUrl(e.target.value)}
                    placeholder="https://calendly.com/yourname/30min"
                    className="w-full px-6 py-4 bg-[#f4f4f4] border-4 border-[#111] font-mono focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/30 transition-all text-[#111]"
                    required
                />
                {error && (
                    <p className="mt-3 text-sm font-bold text-red-600 bg-red-100 p-2 border-l-4 border-red-600">{error}</p>
                )}

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <button
                        type="submit"
                        disabled={isValidating}
                        className="flex-1 px-8 py-4 bg-[#ff6a00] text-[#111] font-black font-sans uppercase tracking-widest text-lg border-4 border-[#111] hover:bg-[#111] hover:text-[#ff6a00] transition-colors shadow-[6px_6px_0px_#111] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isValidating ? "Validating..." : "Save Link"}
                    </button>

                    {onSkip && (
                        <button
                            type="button"
                            onClick={onSkip}
                            className="px-8 py-4 bg-white text-[#111] font-black font-sans uppercase tracking-widest text-lg border-4 border-[#111] hover:bg-[#111] hover:text-white transition-colors shadow-[6px_6px_0px_#111]"
                        >
                            Skip
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
