// Simple heuristic matching algorithm
// Compares mentee assessment answers with mentor properties

export interface MenteeAnswers {
    current_status?: string;
    academic_background?: string;
    current_year?: string;
    primary_goal?: string;
    domain_interest?: string;
    mentorship_type?: string;
    skill_level?: string;
    biggest_challenge?: string;
    timeline?: string;
    connection_frequency?: string;
    weekly_time?: string;
    mentorship_mode?: string;
    expected_outcome?: string;
    main_blocker?: string;
}

export interface MentorAlgorithmProfile {
    id: string | number;
    name: string;
    industry: string; // Corresponds roughly to domain_interest
    expertise: string[]; // Corresponds to mentorship_type, primary_goal, etc.
    modes: string[]; // Online, Hybrid, Offline
}

export function calculateMatchScore(answers: MenteeAnswers, mentor: MentorAlgorithmProfile): number {
    let score = 50; // Base score

    // 1. Industry / Domain Match (+20)
    if (answers.domain_interest && mentor.industry.toLowerCase().includes(answers.domain_interest.toLowerCase())) {
        score += 20;
    } else if (answers.domain_interest) {
        // Check if expertise loosely matches domain
        const match = mentor.expertise.some(e => e.toLowerCase().includes(answers.domain_interest!.toLowerCase()));
        if (match) score += 10;
    }

    // 2. Mentorship Type & Goal Match (+15)
    if (answers.mentorship_type || answers.primary_goal) {
        const types = [answers.mentorship_type?.toLowerCase(), answers.primary_goal?.toLowerCase()].filter(Boolean);
        const expertiseMatch = mentor.expertise.some(e => types.some(t => t && e.toLowerCase().includes(t)));
        if (expertiseMatch) score += 15;
    }

    // 3. Mentorship Mode (+10)
    if (answers.mentorship_mode) {
        if (mentor.modes.includes(answers.mentorship_mode) || answers.mentorship_mode === "Online") {
            score += 10;
        }
    }

    // 4. Random noise for the mock feel to prevent everyone having identical scores (+1 to +5)
    score += Math.floor(Math.random() * 5);

    return Math.min(score, 99); // Max 99% match
}
