import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabase = await createClient();

        const { data, error } = await supabase
            .from('mentee_profiles')
            .select('*')
            .eq('clerk_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is no rows
            throw error;
        }

        if (!data) {
            return NextResponse.json(
                { error: "Profile not found", hasProfile: false },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            hasProfile: !!data.profile_insights,
            profile: data,
            generated_at: data.profile_generated_at
        });

    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}
