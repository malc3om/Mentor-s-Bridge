import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { generateProfileInsights, generateMatchingCriteria } from "@/lib/groq/profile-generator";
import { predictCareer } from "@/lib/career-prediction/client";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            console.error("API ROUTE ERROR: Unauthorized - no clerk user ID");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const assessmentAnswers = await req.json();

        console.log("------------- ASSESSMENT SUBMISSION TRACE -------------");
        console.log("User ID:", userId);
        console.log("GROQ API KEY Present:", !!process.env.GROQ_API_KEY);
        console.log("Career Prediction API URL:", process.env.CAREER_PREDICTION_API_URL || "(default)");
        console.log("Starting parallel generation: Groq + Railway ML Backend...");

        // Run all three in parallel:
        // 1. Groq profile insights (AI-generated summary)
        // 2. Groq matching criteria
        // 3. Railway ML career prediction model
        const [profileInsights, matchingCriteria, careerPrediction] = await Promise.all([
            generateProfileInsights(assessmentAnswers).catch(err => {
                console.error("Groq Profile Insight Gen Error:", err.message || err);
                throw err; // Profile generation is critical – propagate
            }),
            generateMatchingCriteria(assessmentAnswers).catch(err => {
                console.error("Groq Matching Criteria Gen Error:", err.message || err);
                throw err; // Matching criteria is critical – propagate
            }),
            // Career prediction is best-effort – never blocks or breaks the flow
            predictCareer(assessmentAnswers).catch(err => {
                console.error("Career Prediction Error (non-fatal):", err.message || err);
                return null;
            }),
        ]);

        if (careerPrediction) {
            console.log(
                `Railway ML Prediction: "${careerPrediction.predicted_career}" (confidence: ${(careerPrediction.confidence * 100).toFixed(1)}%)`
            );
        } else {
            console.warn("Railway ML backend did not return a prediction (non-fatal).");
        }

        console.log("All generation complete. Bypassing Supabase Upsert for testing...");

        /*  BYPASS DATABASE SAVE DUE TO NETWORK TIMEOUTS ON LOCALHOST
        // Save everything to Supabase
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('mentee_profiles')
            .upsert({
                user_id: userId,
                clerk_id: userId,
                assessment_answers: assessmentAnswers,
                profile_insights: profileInsights,
                matching_criteria: matchingCriteria,
                career_prediction: careerPrediction,   // ← NEW: store ML prediction
                profile_generated_at: new Date().toISOString(),
                career_stage: profileInsights.career_stage,
                industry: profileInsights.industry,
                goals: profileInsights.primary_goals,
                preferences: {
                    learning_style: profileInsights.learning_style,
                    mentorship_preferences: profileInsights.mentorship_preferences,
                    confidence_level: profileInsights.confidence_level
                },
                updated_at: new Date().toISOString()
            }, { onConflict: 'clerk_id' })
            .select()
            .single();

        if (error) {
            console.error("Database error saving mentee profile:", error);
            throw error;
        }
        */

        return NextResponse.json({
            success: true,
            redirect: '/profile',
            message: 'Mentee profile generated successfully',
            data: {
                id: 'mock-id-1234',
                has_insights: !!profileInsights,
                has_prediction: !!careerPrediction,
                tempProfile: {
                    ...profileInsights,
                    // Attach career prediction alongside the Groq profile
                    career_prediction: careerPrediction,
                },
            }
        });
    } catch (error) {
        console.error("Error submitting assessment:", error);
        return NextResponse.json(
            { error: "Failed to submit assessment and generate profile" },
            { status: 500 }
        );
    }
}
