"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobContainerRef = useRef<HTMLDivElement>(null);

  // Liquid metaball animation
  useEffect(() => {
    const blobs = blobContainerRef.current?.querySelectorAll('.metablob');
    if (!blobs) return;
    const anims: gsap.core.Tween[] = [];
    blobs.forEach((blob, i) => {
      const dur = 8 + i * 2.3;
      const anim = gsap.to(blob, {
        x: `random(-35, 35, 1)vw`,
        y: `random(-30, 30, 1)vh`,
        scale: `random(0.6, 1.5)`,
        rotation: `random(-45, 45)`,
        duration: dur,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.7,
      });
      anims.push(anim);
    });
    return () => anims.forEach(a => a.kill());
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro Hero Animations
      gsap.from(".hero-char", {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "power4.out",
        delay: 0.2
      });

      // Brutalist borders drawing in
      gsap.from(".border-line", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.5,
        ease: "power3.inOut"
      });

      // Large text parallax
      gsap.to(".big-text", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Step cards scrolling in with ScrollTrigger
      const cards = gsap.utils.toArray(".step-card");
      cards.forEach((card: any, i) => {
        gsap.from(card, {
          y: 100,
          opacity: 0,
          rotation: 5,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Reveal text lines
      const revealTexts = gsap.utils.toArray(".reveal-text");
      revealTexts.forEach((text: any) => {
        gsap.from(text, {
          clipPath: "inset(0 100% 0 0)",
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: text,
            start: "top 80%",
          }
        });
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-[#f4f4f4] text-[#111111] min-h-screen relative font-mono">
      {/* Liquid Glass Metaball Background */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
        style={{ filter: 'blur(48px) contrast(18)', opacity: 0.13 }}
        ref={blobContainerRef}
      >
        {/* Blob 1 – large orange */}
        <div className="metablob absolute" style={{ width: 520, height: 520, borderRadius: '60% 40% 70% 30% / 50% 60% 40% 70%', background: '#ff6a00', top: '10%', left: '10%' }} />
        {/* Blob 2 – dark */}
        <div className="metablob absolute" style={{ width: 380, height: 380, borderRadius: '40% 60% 30% 70% / 60% 40% 70% 50%', background: '#111111', top: '50%', left: '55%' }} />
        {/* Blob 3 – orange small */}
        <div className="metablob absolute" style={{ width: 260, height: 260, borderRadius: '70% 30% 50% 50% / 30% 70% 50% 50%', background: '#ff6a00', top: '70%', left: '15%' }} />
        {/* Blob 4 – dark medium */}
        <div className="metablob absolute" style={{ width: 320, height: 320, borderRadius: '30% 70% 60% 40% / 50% 40% 60% 50%', background: '#111111', top: '5%', left: '65%' }} />
        {/* Blob 5 – orange tiny */}
        <div className="metablob absolute" style={{ width: 180, height: 180, borderRadius: '50% 50% 30% 70% / 60% 40% 70% 40%', background: '#ff6a00', top: '35%', left: '40%' }} />
        {/* Blob 6 – dark large */}
        <div className="metablob absolute" style={{ width: 440, height: 300, borderRadius: '50% 50% 60% 40% / 40% 50% 60% 50%', background: '#111111', top: '75%', left: '60%' }} />
      </div>

      {/* Brutalist Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#f4f4f4] brutalist-border">
        <div className="flex items-stretch h-20">
          {/* Logo Area */}
          <div className="flex items-center justify-center px-8 border-r border-[#d1d1d1] w-[250px] shrink-0 bg-white hover:bg-[#f1f1f1] transition-colors">
            <div className="text-2xl font-sans font-bold tracking-tighter flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-sm relative">
                <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-[#f4f4f4] rounded-full"></div>
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#f4f4f4] rounded-full"></div>
                <div className="absolute bottom-2 left-2 right-2 h-1 bg-[#ff6a00]"></div>
              </div>
              Mentor<span className="text-[#ff6a00]">Bridge</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-10 text-xs uppercase tracking-widest font-bold">
            <Link href="/mentorships" className="hover:text-[#ff6a00] transition-colors relative group">
              Mentorships
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#ff6a00] transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/booking" className="hover:text-[#ff6a00] transition-colors relative group">
              Booking
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#ff6a00] transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/chat" className="hover:text-[#ff6a00] transition-colors relative group">
              Group Chat
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#ff6a00] transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/mentee/assessment" className="hover:text-[#ff6a00] transition-colors relative group">
              Assessment
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#ff6a00] transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/profile" className="hover:text-[#ff6a00] transition-colors relative group">
              Profile
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#ff6a00] transition-all group-hover:w-full"></span>
            </Link>
          </div>

          {/* Right Area */}
          <div className="flex items-stretch border-l border-[#d1d1d1] shrink-0">
            <div className="hidden md:flex items-center gap-2 px-6 border-r border-[#d1d1d1] text-xs font-bold font-sans uppercase bg-white">
              <span className="text-[#ff6a00]">: :</span> Our Ecosystem
            </div>
            <Link href="/onboarding" className="flex items-center justify-center px-10 bg-[#ff6a00] text-black font-sans font-bold uppercase tracking-wider hover:bg-[#e55a00] transition-colors h-full">
              Apply Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section pt-20 relative border-b border-[#d1d1d1] overflow-hidden min-h-[90vh] flex flex-col justify-center">

        <div className="max-w-[1400px] mx-auto w-full px-6 relative z-10 flex flex-col pt-12">
          {/* Subtitle */}
          <div className="flex gap-4 mb-2">
            <div className="w-2 h-2 bg-[#ff6a00] mt-1.5"></div>
            <div className="font-mono text-xs uppercase tracking-widest text-[#555] font-bold">
              BACKING TOMORROW
            </div>
          </div>

          {/* BIG TEXT */}
          <h1 className="big-text font-sans font-black text-[#111] text-[15vw] md:text-[12vw] leading-[0.85] tracking-tighter uppercase break-words w-full text-center py-6">
            <span className="hero-char inline-block">B</span>
            <span className="hero-char inline-block">U</span>
            <span className="hero-char inline-block">I</span>
            <span className="hero-char inline-block">L</span>
            <span className="hero-char inline-block">D</span>
            <span className="hero-char inline-block text-transparent" style={{ WebkitTextStroke: "2px #111" }}>I</span>
            <span className="hero-char inline-block text-transparent" style={{ WebkitTextStroke: "2px #111" }}>N</span>
            <span className="hero-char inline-block text-transparent" style={{ WebkitTextStroke: "2px #111" }}>G</span>
            <br />
            <span className="hero-char inline-block text-[#ff6a00]">T</span>
            <span className="hero-char inline-block text-[#ff6a00]">O</span>
            <span className="hero-char inline-block text-[#ff6a00]">M</span>
            <span className="hero-char inline-block text-[#ff6a00]">O</span>
            <span className="hero-char inline-block text-[#ff6a00]">R</span>
            <span className="hero-char inline-block text-[#ff6a00]">R</span>
            <span className="hero-char inline-block text-[#ff6a00]">O</span>
            <span className="hero-char inline-block text-[#ff6a00]">W</span>
          </h1>

          {/* Subtitle bottom */}
          <div className="flex gap-4 justify-end mt-2">
            <div className="font-mono text-xs uppercase tracking-widest text-[#555] font-bold">
              SMART CAPITAL / MENTORSHIP
            </div>
            <div className="w-2 h-2 bg-[#ff6a00] mt-1.5"></div>
          </div>
        </div>

        <div className="mt-auto border-t border-[#d1d1d1] bg-[#f4f4f4] flex flex-col md:flex-row min-h-[200px]">
          <div className="p-10 w-full md:w-[25%] border-r border-[#d1d1d1] flex flex-col justify-between  bg-[#f4f4f4]">
            <p className="text-sm tracking-wide leading-relaxed font-mono font-medium text-[#555]">
              Backing the very best builders — transforming visionary ideas into real-world career growth.
            </p>
            <Link href="/onboarding" className="mt-8 inline-block w-full py-4 bg-[#ff6a00] text-black font-bold font-sans uppercase text-center hover:bg-[#111] hover:text-[#ff6a00] transition-colors shadow-none text-sm tracking-wider">
              APPLY FOR MENTORSHIP
            </Link>
          </div>

          <div className="p-10 w-full md:w-[50%] border-r border-[#d1d1d1] flex flex-col justify-center bg-[#f4f4f4]">
            {/* Empty center block like ChainGPT */}
          </div>

          <div className="w-full md:w-[25%] flex flex-col">
            <div className="h-full bg-[#111] text-[#f4f4f4] relative overflow-hidden flex items-center justify-center p-8">
              <div className="absolute inset-0 brutalist-grid opacity-20"></div>
              {/* Spinning 3D like object proxy */}
              <div className="w-32 h-32 relative text-[#f4f4f4] flex items-center justify-center group pointer-events-none">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#555]" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#555]" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#555]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#555]" />
                {/* Rotating abstract shape */}
                <div className="w-24 h-24 border-[8px] border-white flex items-center justify-center animate-[spin_10s_linear_infinite] rounded-sm">
                  <div className="w-8 h-8 bg-white rotate-45" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* The Mentorship Gap */}
      <section className="py-32 border-b border-[#d1d1d1] relative overflow-hidden">
        <div className="border-line absolute top-0 left-1/4 w-[1px] h-full bg-[#d1d1d1] -z-10"></div>
        <div className="border-line absolute top-0 left-2/4 w-[1px] h-full bg-[#d1d1d1] -z-10"></div>
        <div className="border-line absolute top-0 left-3/4 w-[1px] h-full bg-[#d1d1d1] -z-10"></div>

        <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-0 border-4 border-[#111] bg-white relative z-10 shadow-[16px_16px_0px_#111]">
          <div className="border-b md:border-b-0 md:border-r border-[#111] p-16 flex flex-col justify-center">
            <h2 className="reveal-text text-5xl md:text-7xl font-black font-sans uppercase leading-[0.9] text-[#111]">
              THE <br />
              <span className="text-[#ff6a00]">MENTORSHIP<br /></span>
              GAP.
            </h2>
          </div>
          <div className="p-16 flex flex-col justify-center bg-[#f4f4f4]">
            <p className="text-xl text-[#333] leading-relaxed mb-10 font-mono font-medium">
              Millions seek guidance, while thousands of experts want to give back.
              The current ecosystem is fragmented. Virtual Mentor Bridge unifies them, using intelligent algorithms to link ambition with wisdom.
            </p>
            <div className="flex flex-col gap-4">
              <Link href="/onboarding" className="p-6 border-2 border-[#111] flex justify-between items-center bg-white hover:bg-[#ff6a00] hover:text-[#111] transition-colors cursor-pointer group shadow-[4px_4px_0px_#111]">
                <strong className="font-sans font-black uppercase tracking-wider text-xl">For Mentees</strong>
                <div className="w-10 h-10 border-2 border-[#111] bg-white group-hover:bg-[#111] group-hover:text-[#ff6a00] flex items-center justify-center transition-colors">
                  <ArrowUpRight strokeWidth={3} />
                </div>
              </Link>
              <Link href="/onboarding" className="p-6 border-2 border-[#111] flex justify-between items-center bg-[#111] text-white hover:bg-[#ff6a00] hover:text-[#111] transition-colors cursor-pointer group shadow-[4px_4px_0px_#d1d1d1]">
                <strong className="font-sans font-black uppercase tracking-wider text-xl">For Mentors</strong>
                <div className="w-10 h-10 border-2 border-white bg-[#111] group-hover:bg-[#111] group-hover:border-[#111] group-hover:text-[#ff6a00] flex items-center justify-center transition-colors">
                  <ArrowUpRight strokeWidth={3} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / Steps */}
      <section className="py-32 relative overflow-hidden bg-[#111] text-white border-b-8 border-[#ff6a00]">
        <div className="absolute inset-0 brutalist-grid opacity-10"></div>
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="flex justify-between items-end mb-16 border-b border-[#333] pb-8">
            <h2 className="text-4xl md:text-6xl font-black font-sans uppercase text-[#f4f4f4]">
              How It Works
            </h2>
            <div className="font-mono text-[#ff6a00] tracking-widest">[ 3 STEPS ]</div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "THE ASSESSMENT", desc: "Complete an interactive 13-question profile to map out your goals, industry, and exact guidance needs." },
              { step: "02", title: "THE MATCH", desc: "Our engine analyzes your profile and pairs you with handpicked mentors ready to guide your specific trajectory." },
              { step: "03", title: "THE GROWTH", desc: "Access exclusive dashboards, track your milestones, and schedule sessions directly within your portal." }
            ].map((item, i) => (
              <div key={i} className="step-card bg-[#1a1a1a] border border-[#333] p-10 relative group hover:border-[#ff6a00] transition-colors">
                <div className="text-6xl font-black font-sans text-[#333] group-hover:text-[#ff6a00] transition-colors mb-8">
                  {item.step}
                </div>
                <h3 className="text-2xl font-black font-sans uppercase mb-6 text-white">{item.title}</h3>
                <p className="text-[#aaa] leading-relaxed font-mono text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer-section bg-[#f4f4f4] py-32 px-6">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="reveal-text text-5xl md:text-9xl font-black font-sans uppercase mb-16 tracking-tighter text-[#111]">
            BRIDGE THE <span className="text-[#ff6a00]">GAP.</span>
          </h2>
          <Link href="/sign-up" className="inline-block px-16 py-8 bg-[#111] text-white font-black font-sans text-2xl uppercase hover:bg-[#ff6a00] hover:text-[#111] transition-all shadow-[12px_12px_0px_transparent] hover:shadow-[12px_12px_0px_transparent] shadow-[8px_8px_0px_#ff6a00] hover:shadow-[8px_8px_0px_#111]">
            START YOUR JOURNEY
          </Link>
        </div>
      </footer>
    </div>
  );
}
