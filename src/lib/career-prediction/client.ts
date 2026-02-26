/**
 * Career Prediction Client
 * Integrates with the Railway-hosted ML career prediction backend.
 * URL: https://career-prediction-model-production.up.railway.app
 *
 * This module maps the mentee's 13-question assessment answers to the
 * format expected by the ML model, calls the API, and returns a structured
 * career prediction result. All errors are caught and handled gracefully
 * so that a backend outage never breaks the main assessment flow.
 */

const BASE_URL =
    process.env.CAREER_PREDICTION_API_URL ||
    "https://career-prediction-model-production.up.railway.app";

/** Shape returned by our Railway ML backend */
export interface CareerPrediction {
    /** Primary predicted career/domain (e.g. "Software Engineer") */
    predicted_career: string;
    /** Confidence score 0–1 from the model */
    confidence: number;
    /** Top-N alternative careers the model considered */
    top_careers?: string[];
    /** Any additional explanation text from the model */
    explanation?: string;
    /** Raw response in case the shape varies */
    raw?: any;
}

/**
 * Maps the internal assessment answer keys (as stored in the DB / sessionStorage)
 * to whatever payload the Railway backend expects.
 *
 * The backend appears to be a scikit-learn / similar model that was trained on
 * the same 13-question form. We send all fields and let the backend pick what
 * it needs. If the API shape changes, update the mapping here.
 */
function buildPredictionPayload(answers: Record<string, any>): Record<string, any> {
    return {
        // Question 1 – current_status
        current_status: answers.current_status ?? answers["1"] ?? "",
        // Question 2 – academic_background
        academic_background: answers.academic_background ?? answers["2"] ?? "",
        // Question 3 – current_year
        current_year: answers.current_year ?? answers["3"] ?? "",
        // Question 4 – primary_goal
        primary_goal: answers.primary_goal ?? answers["4"] ?? "",
        // Question 5 – domain_interest
        domain_interest: answers.domain_interest ?? answers["5"] ?? "",
        // Question 6 – mentorship_type
        mentorship_type: answers.mentorship_type ?? answers["6"] ?? "",
        // Question 7 – skill_level
        skill_level: answers.skill_level ?? answers["7"] ?? "",
        // Question 8 – biggest_challenge
        biggest_challenge: answers.biggest_challenge ?? answers["8"] ?? "",
        // Question 9 – timeline
        timeline: answers.timeline ?? answers["9"] ?? "",
        // Question 10 – connection_frequency
        connection_frequency: answers.connection_frequency ?? answers["10"] ?? "",
        // Question 11 – weekly_time
        weekly_time: answers.weekly_time ?? answers["11"] ?? "",
        // Question 12 – mentorship_mode
        mentorship_mode: answers.mentorship_mode ?? answers["12"] ?? "",
        // Question 13 – expected_outcome
        expected_outcome: answers.expected_outcome ?? answers["13"] ?? "",
        // Question 14 – open-ended main_blocker
        main_blocker: answers.main_blocker ?? answers["14"] ?? "",
    };
}

/**
 * Normalises whatever the backend returns into a consistent CareerPrediction shape.
 * The Railway model may return various response shapes depending on the version.
 */
function normaliseResponse(data: any): CareerPrediction {
    // Handle common FastAPI / Flask response shapes
    if (typeof data === "string") {
        return { predicted_career: data, confidence: 1, raw: data };
    }

    // Shape A: { prediction: string, confidence: number, alternatives: string[] }
    if (data?.prediction) {
        return {
            predicted_career: data.prediction,
            confidence: data.confidence ?? 1,
            top_careers: data.alternatives ?? data.top_careers ?? [],
            explanation: data.explanation ?? data.message ?? undefined,
            raw: data,
        };
    }

    // Shape B: { predicted_career: string, confidence: number, top_careers: [] }
    if (data?.predicted_career) {
        return {
            predicted_career: data.predicted_career,
            confidence: data.confidence ?? 1,
            top_careers: data.top_careers ?? [],
            explanation: data.explanation ?? undefined,
            raw: data,
        };
    }

    // Shape C: { result: string, ... }
    if (data?.result) {
        return {
            predicted_career: data.result,
            confidence: data.confidence ?? 1,
            top_careers: data.alternatives ?? [],
            explanation: data.explanation ?? undefined,
            raw: data,
        };
    }

    // Shape D: { career: string, ... }
    if (data?.career) {
        return {
            predicted_career: data.career,
            confidence: data.confidence ?? 1,
            top_careers: data.alternatives ?? data.top_careers ?? [],
            explanation: data.explanation ?? undefined,
            raw: data,
        };
    }

    // Fallback – return the whole thing and let the caller handle it
    return {
        predicted_career: data?.label ?? data?.class ?? "Unknown",
        confidence: data?.score ?? data?.confidence ?? 0,
        raw: data,
    };
}

/**
 * Calls the Railway ML backend to predict a career path from assessment answers.
 *
 * @param answers - The raw mentee assessment answers object
 * @returns Resolved CareerPrediction or null if the backend is unavailable
 */
export async function predictCareer(
    answers: Record<string, any>
): Promise<CareerPrediction | null> {
    try {
        const payload = buildPredictionPayload(answers);

        console.log("[CareerPrediction] Calling Railway backend:", BASE_URL);

        // Try /predict first (most common FastAPI pattern), fall back to root POST
        const endpointsToTry = ["/predict", "/", "/api/predict"];

        for (const endpoint of endpointsToTry) {
            try {
                const res = await fetch(`${BASE_URL}${endpoint}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify(payload),
                    // 10-second timeout to avoid hanging the assessment submission
                    signal: AbortSignal.timeout(10_000),
                });

                if (!res.ok) {
                    console.warn(
                        `[CareerPrediction] ${endpoint} returned HTTP ${res.status} – trying next endpoint`
                    );
                    continue;
                }

                const data = await res.json();
                const prediction = normaliseResponse(data);
                console.log("[CareerPrediction] Success:", prediction.predicted_career);
                return prediction;
            } catch (endpointError: any) {
                if (endpointError?.name === "TimeoutError") {
                    console.warn(`[CareerPrediction] ${endpoint} timed out`);
                } else {
                    console.warn(`[CareerPrediction] ${endpoint} failed:`, endpointError?.message);
                }
                // Continue to next endpoint
            }
        }

        console.warn("[CareerPrediction] All endpoints failed – returning null");
        return null;
    } catch (error: any) {
        console.error("[CareerPrediction] Unexpected error:", error?.message ?? error);
        return null;
    }
}

/**
 * Health-checks the Railway backend.
 * Returns true if the backend responds on /health or /.
 */
export async function checkCareerPredictionHealth(): Promise<boolean> {
    try {
        const res = await fetch(`${BASE_URL}/health`, {
            method: "GET",
            signal: AbortSignal.timeout(5_000),
        });
        return res.ok;
    } catch {
        return false;
    }
}
