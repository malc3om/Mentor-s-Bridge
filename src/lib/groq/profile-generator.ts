import { groq, GROQ_CONFIG } from "./client";
import { PROFILE_GENERATION_PROMPT, MATCHING_CRITERIA_PROMPT } from "./prompts";

export interface ProfileInsights {
    professional_summary: string;
    career_stage: string;
    industry: string;
    primary_goals: string[];
    key_strengths: string[];
    areas_for_development: string[];
    learning_style: string;
    mentorship_preferences: string;
    success_vision: string;
    recommended_focus_areas: string[];
    personality_insights: string;
    confidence_level: number;
    engagement_score: number;
}

export interface MatchingCriteria {
    required_expertise: string[];
    preferred_industries: string[];
    mentorship_style: string;
    experience_level_needed: string;
    key_focus_areas: string[];
    communication_frequency: string;
    time_commitment: string;
    priority_topics: string[];
}

export async function generateProfileInsights(
    assessmentAnswers: any
): Promise<ProfileInsights> {
    try {
        const response = await groq.chat.completions.create({
            model: GROQ_CONFIG.model,
            temperature: GROQ_CONFIG.temperature,
            max_tokens: GROQ_CONFIG.max_tokens,
            messages: [
                {
                    role: "system",
                    content: "You are an expert career counselor and personality analyst with 20+ years of experience. You provide accurate, insightful, and actionable profile summaries. You always return valid JSON without markdown wrapping."
                },
                {
                    role: "user",
                    content: PROFILE_GENERATION_PROMPT(assessmentAnswers)
                }
            ],
            response_format: { type: "json_object" }, // Force JSON response
        });

        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error("No content in Groq response");
        }

        const profile = JSON.parse(content);

        // Validate minimal required fields
        const requiredFields = [
            'professional_summary',
            'career_stage',
            'industry',
            'primary_goals',
            'key_strengths'
        ];

        for (const field of requiredFields) {
            if (!profile[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        return profile as ProfileInsights;

    } catch (error) {
        console.error("Error generating profile insights:", error);
        throw new Error(`Failed to generate profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function generateMatchingCriteria(
    assessmentAnswers: any
): Promise<MatchingCriteria> {
    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile", // Changed model as per instruction
            temperature: 0.7, // Changed temperature as per instruction
            max_tokens: 2000, // Changed max_tokens as per instruction
            messages: [
                {
                    role: "system",
                    content: "You are a mentor-matching algorithm expert. You generate precise matching criteria based on mentee needs. You always return valid JSON without markdown formatting."
                },
                {
                    role: "user",
                    content: MATCHING_CRITERIA_PROMPT(assessmentAnswers)
                }
            ],
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error("No content in Groq response");
        }

        const criteria = JSON.parse(content);
        return criteria as MatchingCriteria;

    } catch (error) {
        console.error("Error generating matching criteria:", error);
        throw new Error(`Failed to generate matching criteria: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
