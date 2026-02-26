import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { calendlyUrl } = await req.json();

        if (!calendlyUrl) {
            return new NextResponse("Calendly URL is required", { status: 400 });
        }

        const supabase = await createClient();

        // Update the mentor's calendly URL in Supabase
        // Using clerk_id to match the user since that's what we have available here
        const { error } = await supabase
            .from('mentor_profiles')
            .update({
                calendly_url: calendlyUrl,
                calendly_connected: true,
                updated_at: new Date().toISOString()
            } as any)
            .eq('clerk_id', userId);

        if (error) {
            console.error("Supabase Error updating Calendly URL:", error);
            return new NextResponse("Failed to save to database", { status: 500 });
        }

        return NextResponse.json({ success: true, calendlyUrl });

    } catch (error) {
        console.error("[CALENDLY_SETUP_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
