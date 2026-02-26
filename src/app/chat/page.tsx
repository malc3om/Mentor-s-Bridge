"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { createClient } from '@/lib/supabase/client';
import gsap from 'gsap';
import { Send, Hash, Users, Terminal, Activity, Loader2, WifiOff, Wifi } from 'lucide-react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChatMessage {
    id: string;
    channel: string;
    user_id: string;
    user_name: string;
    user_role: string;
    content: string;
    created_at: string;
}

interface Channel {
    id: string;
    name: string;
    label: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const CHANNELS: Channel[] = [
    { id: "general", name: "General-Chat", label: "general" },
    { id: "engineering", name: "Engineering-Hub", label: "engineering" },
    { id: "career", name: "Career-Advice", label: "career" },
    { id: "startup", name: "Startup-Founders", label: "startup" },
];

const MESSAGES_LIMIT = 60;

// ─── Component ────────────────────────────────────────────────────────────────
export default function GroupChatPage() {
    const { user, isLoaded } = useUser();
    const supabase = createClient();

    const [activeChannel, setActiveChannel] = useState<Channel>(CHANNELS[0]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);
    const channelRef = useRef<string>(activeChannel.label);

    // ── Initial entrance animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(headerRef.current, { y: -50, opacity: 0, duration: 0.6, ease: "power3.out" });
            gsap.from(sidebarRef.current, { x: -50, opacity: 0, duration: 0.6, ease: "power3.out", delay: 0.2 });
            gsap.from(chatRef.current, { y: 50, opacity: 0, duration: 0.6, ease: "power3.out", delay: 0.4 });
        });
        return () => ctx.revert();
    }, []);

    // ── Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ── Load history from localStorage on channel switch
    const fetchHistory = useCallback((channelLabel: string) => {
        setLoadingHistory(true);
        try {
            const saved = localStorage.getItem(`chat_history_${channelLabel}`);
            if (saved) {
                setMessages(JSON.parse(saved));
            } else {
                setMessages([]);
            }
        } catch (e) {
            console.error("Failed to load chat history", e);
            setMessages([]);
        }
        setLoadingHistory(false);
        setIsConnected(true); // Mock connected state
    }, []);

    // ── Effect: Load messages on mount & channel switch
    useEffect(() => {
        channelRef.current = activeChannel.label;
        fetchHistory(activeChannel.label);
    }, [activeChannel, fetchHistory]);

    // ── Send a message
    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !user || isSending) return;

        setIsSending(true);
        const content = inputValue.trim();
        setInputValue("");

        const newMsg: ChatMessage = {
            id: Date.now().toString(),
            channel: activeChannel.label,
            user_id: user.id,
            user_name: user.fullName || user.username || user.emailAddresses[0].emailAddress,
            user_role: 'Mentee', // Mocked role
            content,
            created_at: new Date().toISOString()
        };

        const updatedMessages = [...messages, newMsg];
        setMessages(updatedMessages);

        // Save to localStorage
        try {
            localStorage.setItem(`chat_history_${activeChannel.label}`, JSON.stringify(updatedMessages));
        } catch (e) {
            console.error("Failed to save message", e);
        }

        setIsSending(false);

        // Bounce animation for new outgoing message
        requestAnimationFrame(() => {
            const last = document.querySelector('.msg-bubble:last-of-type');
            if (last) {
                gsap.fromTo(last,
                    { x: 30, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
                );
            }
        });
    };

    // ── Switch channel
    const switchChannel = (channel: Channel) => {
        setActiveChannel(channel);
    };

    // ── Format timestamp
    const formatTime = (iso: string) =>
        new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // ──────────────────────────────────────────────────────────────────────────
    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-[#111] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#ff6a00] animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#111] flex items-center justify-center font-mono text-white">
                <div className="text-center space-y-4">
                    <p className="text-2xl font-black uppercase">ACCESS DENIED</p>
                    <Link href="/sign-in" className="underline text-[#ff6a00]">Sign in to join the chat</Link>
                </div>
            </div>
        );
    }

    // ──────────────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#f4f4f4] text-[#111] font-mono flex flex-col pt-10 px-6 sm:px-10 pb-10">

            {/* ── Top Bar ── */}
            <div ref={headerRef} className="flex justify-between items-end mb-8 border-b-8 border-[#111] pb-4">
                <div className="flex flex-col">
                    <div className="text-sm font-black uppercase tracking-widest text-[#ff6a00] mb-2 px-2 bg-[#111] inline-block w-fit border-2 border-[#111]">
                        SYSTEM_COMMS_LINK
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
                        GLOBAL <span className="text-[#ff6a00]">CHAT.</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    {/* Connection status */}
                    <div className={`flex items-center gap-2 px-3 py-1 border-2 text-xs font-black uppercase ${isConnected ? 'border-green-500 text-green-600' : 'border-red-400 text-red-500'}`}>
                        {isConnected
                            ? <><Wifi className="w-3 h-3" /> LIVE</>
                            : <><WifiOff className="w-3 h-3" /> CONNECTING</>
                        }
                    </div>
                    <Link href="/" className="px-6 py-3 border-4 border-[#111] bg-white text-[#111] font-bold uppercase tracking-wider hover:bg-[#111] hover:text-[#ff6a00] transition-colors shadow-[6px_6px_0px_#111] hover:shadow-[2px_2px_0px_#111] hover:translate-x-1 hover:translate-y-1">
                        EXIT TERMINAL
                    </Link>
                </div>
            </div>

            {/* ── Main Layout ── */}
            <div className="flex-1 flex flex-col md:flex-row gap-8 min-h-0" style={{ height: 'calc(100vh - 200px)' }}>

                {/* ── Sidebar ── */}
                <div ref={sidebarRef} className="w-full md:w-80 flex flex-col gap-6 flex-shrink-0">
                    <div className="bg-[#111] border-4 border-[#111] shadow-[12px_12px_0px_#ff6a00] p-6 text-white flex-1 overflow-y-auto flex flex-col">

                        {/* Channels */}
                        <div className="flex items-center gap-3 mb-8 text-[#ff6a00]">
                            <Terminal className="w-8 h-8" />
                            <h2 className="text-2xl font-black uppercase">&gt;_ Channels</h2>
                        </div>

                        <div className="space-y-3">
                            {CHANNELS.map(ch => (
                                <button
                                    key={ch.id}
                                    onClick={() => switchChannel(ch)}
                                    className={`w-full text-left p-3 font-bold border-2 transition-all flex items-center gap-3 ${activeChannel.id === ch.id
                                        ? "bg-[#ff6a00] border-[#ff6a00] text-[#111]"
                                        : "bg-transparent border-[#333] text-[#aaa] hover:border-white hover:text-white"
                                        }`}
                                >
                                    <Hash className="w-5 h-5 shrink-0" />
                                    <span className="truncate">{ch.name}</span>
                                    {activeChannel.id === ch.id && <Activity className="w-4 h-4 ml-auto animate-pulse" />}
                                </button>
                            ))}
                        </div>

                        {/* Online indicator for current user */}
                        <div className="mt-auto pt-8 border-t-2 border-[#333]">
                            <div className="flex items-center gap-3 mb-6 text-white">
                                <Users className="w-6 h-6" />
                                <h2 className="text-xl font-black uppercase">Active Net</h2>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                <span className="font-bold text-sm text-[#ff6a00]">
                                    {user.fullName || user.username || "YOU"} (You)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Chat Area ── */}
                <div ref={chatRef} className="flex-1 border-4 border-[#111] bg-white shadow-[12px_12px_0px_#111] flex flex-col min-h-0 overflow-hidden">

                    {/* Chat Header */}
                    <div className="bg-[#f4f4f4] border-b-4 border-[#111] p-6 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-black text-[#ff6a00]">#</span>
                            <h2 className="text-2xl font-black uppercase tracking-wide">{activeChannel.name}</h2>
                        </div>
                        <div className="bg-[#111] text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                            {isConnected ? 'REALTIME ACTIVE' : 'CONNECTING...'}
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white min-h-0">
                        {loadingHistory ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="w-8 h-8 text-[#ff6a00] animate-spin" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                                <Hash className="w-16 h-16 mb-4" />
                                <p className="font-black text-xl uppercase">No messages yet.</p>
                                <p className="font-bold text-sm mt-2">Be the first to transmit.</p>
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isOwn = msg.user_id === user.id;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`msg-bubble flex flex-col ${isOwn ? 'items-end' : 'items-start'} w-full`}
                                    >
                                        <div className={`flex items-baseline gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
                                            <span className="font-black text-sm uppercase">{msg.user_name}</span>
                                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 ${msg.user_role === 'Mentor' ? 'bg-[#ff6a00] text-[#111]' : 'bg-[#111] text-white'}`}>
                                                {msg.user_role}
                                            </span>
                                            <span className="text-xs text-gray-400 font-bold">{formatTime(msg.created_at)}</span>
                                        </div>
                                        <div className={`max-w-[85%] sm:max-w-[75%] p-4 border-4 border-[#111] font-medium text-base leading-relaxed ${isOwn
                                            ? 'bg-[#111] text-white shadow-[-6px_6px_0px_#ff6a00]'
                                            : 'bg-white text-[#111] shadow-[6px_6px_0px_#d1d1d1]'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-6 bg-[#f4f4f4] border-t-4 border-[#111] flex-shrink-0">
                        <form onSubmit={handleSend} className="flex gap-4">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                placeholder={`TRANSMIT TO #${activeChannel.name.toUpperCase()}...`}
                                disabled={isSending}
                                className="flex-1 bg-white border-4 border-[#111] p-4 font-bold text-lg focus:outline-none focus:border-[#ff6a00] transition-colors shadow-[6px_6px_0px_#111] focus:shadow-[6px_6px_0px_#ff6a00] disabled:opacity-60"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isSending}
                                className="bg-[#ff6a00] border-4 border-[#111] text-[#111] px-6 py-4 flex items-center justify-center hover:bg-[#111] hover:text-[#ff6a00] transition-colors disabled:opacity-50 shadow-[6px_6px_0px_#111] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                            >
                                {isSending
                                    ? <Loader2 className="w-6 h-6 animate-spin" />
                                    : <Send className="w-6 h-6" strokeWidth={3} />
                                }
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
