require('dotenv').config({ path: '.env.local' });
const { Groq } = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MOCK_ANSWERS = {
    current_status: "College Student",
    academic_background: "Engineering / Technical",
    current_year: "3rd/Final Year",
    primary_goal: "Get a Job",
    domain_interest: "Software Development",
    career_timeline: "1-2 Years",
    biggest_challenge: "Lack of Practical Experience",
    learning_preference: "Hands-on Projects",
    mentorship_style: "Structured & Direct",
    communication_style: "Video Calls",
    time_commitment: "2-4 Hours",
    current_skill_level: "Intermediate",
    goal_freeform: "I am an engineering student learning React and Node.js. I want to build a scalable SaaS application for my final year project but I am struggling with understanding system design and deploying to AWS."
};

const PROFILE_PROMPT = `
You are an expert career counselor and personality analyst with 20+ years of experience.
A mentee has completed a career assessment. Analyze their responses and generate a comprehensive profile.
ASSESSMENT RESPONSES:
${JSON.stringify(MOCK_ANSWERS, null, 2)}
RETURN ONLY VALID JSON in this exact structure:
{
  "professional_summary": "string",
  "career_stage": "string",
  "industry": "string",
  "primary_goals": ["goal1"],
  "key_strengths": ["strength1"],
  "areas_for_development": ["area1"],
  "learning_style": "string",
  "mentorship_preferences": "string",
  "success_vision": "string",
  "recommended_focus_areas": ["area1"],
  "personality_insights": "string",
  "confidence_level": 4,
  "engagement_score": 8
}
`;

async function testGroqAssessment() {
    console.log("SENDING THE 13/14 QUESTIONS DIRECTLY TO GROQ API...\n");

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 2000,
            messages: [
                { role: "system", content: "You are an expert career counselor. Return JSON only." },
                { role: "user", content: PROFILE_PROMPT }
            ],
            response_format: { type: "json_object" },
        });

        console.log("✅ SUCCESS! GROQ GENERATED THIS PROFILE BASED ON THE ANSWERS:\n");
        console.log(response.choices[0].message.content);

    } catch (error) {
        console.error("GROQ ERROR:", error);
    }
}

testGroqAssessment();
