import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const channel = searchParams.get("channel") || "general";
        const limit = parseInt(searchParams.get("limit") || "60");

        const supabase = await createClient();

        const { data, error } = await supabase
            .from("chat_messages")
            .select("*")
            .eq("channel", channel)
            .order("created_at", { ascending: true })
            .limit(limit);

        if (error) throw error;

        return NextResponse.json({ success: true, messages: data });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { channel, content, user_name, user_role } = body;

        if (!content?.trim() || !channel) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabase = await createClient();

        const { data, error } = await supabase
            .from("chat_messages")
            .insert({
                channel: channel,
                user_id: userId,
                user_name: user_name || "Anonymous",
                user_role: user_role || "Mentee",
                content: content.trim(),
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, message: data });
    } catch (err: any) {
        console.error("Chat POST error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
