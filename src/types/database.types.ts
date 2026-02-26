export type MentorProfile = {
    id: string;
    user_id: string;
    clerk_id: string;
    name: string;
    title: string;
    bio: string;
    expertise: string[];
    industry: string;
    years_experience: number;
    calendly_url: string | null;
    calendly_connected: boolean;
    created_at: string;
    updated_at: string;
};

export type Session = {
    id: string;
    mentor_id: string;
    mentee_id: string;
    calendly_event_uri: string;
    calendly_invitee_uri: string | null;
    scheduled_at: string;
    duration: number;
    status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
    meeting_link: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
};

export interface Database {
    public: {
        Tables: {
            mentor_profiles: {
                Row: MentorProfile;
                Insert: Partial<MentorProfile>;
                Update: Partial<MentorProfile>;
            };
            sessions: {
                Row: Session;
                Insert: Partial<Session>;
                Update: Partial<Session>;
            };
        };
    };
}
