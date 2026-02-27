<div align="center">
  <br />
  <h1> Virtual Mentor Bridge</h1>
  <p><strong>Backing the very best builders — transforming visionary ideas into real-world career growth.</strong></p>
  
  <p>
    <a href="#features"><img alt="Features" src="https://img.shields.io/badge/Features-Extensive-success?style=for-the-badge&logo=vercel&color=0055ff"></a>
    <a href="#tech-stack"><img alt="Tech Stack" src="https://img.shields.io/badge/Stack-Next.js_14-success?style=for-the-badge&logo=next.js&color=111111"></a>
    <a href="#getting-started"><img alt="Getting Started" src="https://img.shields.io/badge/Getting_Started-Quick-success?style=for-the-badge&logo=rocket&color=e55a00"></a>
  </p>
</div>

<br />

> **The Mentorship Gap:** Millions seek guidance, while thousands of experts want to give back. The current ecosystem is fragmented. Virtual Mentor Bridge unifies them, using intelligent AI algorithms to link ambition with wisdom.

---

##  Features : 

-  **AI-Powered Matching Engine:** An advanced algorithmic system powered by Groq & OpenAI designed to map mentee goals with a mentor's exact expertise.
-  **Machine Learning Career Prediction:** Built-in Python models deployed on Railway to forecast career trajectories based on user assessments.
-  **Real-time Group Chat:** Instant messaging channels implemented for cohorts and direct mentor-mentee interaction using Supabase Realtime.
-  **Calendly Integration:** Frictionless scheduling and booking directly within the platform.
-  **Brutalist UI & Fluid Animations:** A premium, modern web experience leveraging GSAP with liquid metaball effects, brutalist borders, and ScrollTrigger parallax features.
-  **Robust Authentication:** Secure ecosystem powered by Clerk, ensuring mentee and mentor portals remain isolated and secure.
  ## # Soon to be added :
-  **Resume Analyser**
-   **Ai Driven Mentor**
-  **90 Day Roadmap Challenge**

---

## System Architecture

The architecture seamlessly blends serverless endpoints with AI integration:

```mermaid
graph TD
    %% Define Styles
    classDef frontend fill:#0055ff,stroke:#000,stroke-width:2px,color:#fff
    classDef auth fill:#111,stroke:#a3a3a3,stroke-width:2px,color:#fff
    classDef ai fill:#e55a00,stroke:#000,stroke-width:2px,color:#fff
    classDef db fill:#23c55e,stroke:#000,stroke-width:2px,color:#fff
    classDef thirdparty fill:#a855f7,stroke:#000,stroke-width:2px,color:#fff

    Client[Next.js Client GUI / GSAP Animations]:::frontend
    
    subgraph Services ["Application Layers"]
        Auth[Clerk Auth & Middleware]:::auth
        API[Next.js App API Routes]:::frontend
    end
    
    subgraph "AI & ML Processing"
        Groq[Groq NLP Matching]:::ai
        OpenAI[OpenAI Assistant]:::ai
        RailwayModel[Career Prediction Model]:::ai
    end

    subgraph "Data & Realtime"
        SupabaseDB[(Supabase PostgreSQL)]:::db
        SupabaseRT[Supabase Realtime Channels]:::db
    end
    
    Calendly[Calendly API / Webhooks]:::thirdparty

    %% Flows
    Client <-->|User Interaction| Auth
    Client <-->|Data Fetching| API
    
    API --->|LLM Inference| Groq
    API --->|Generative Text| OpenAI
    API --->|Career Forecasting| RailwayModel
    
    Client <-->|Live Group Chats| SupabaseRT
    API --->|Mutations & Queries| SupabaseDB
    
    Client --->|Book Mentorship| Calendly
```

Some Screen-Shots:

<img width="1918" height="972" alt="image" src="https://github.com/user-attachments/assets/9a1511c7-ea4a-42d2-98e6-e2535c0c547c" />
<img width="1919" height="972" alt="image" src="https://github.com/user-attachments/assets/7864aafc-4606-453c-9693-64e2378a0d79" />
<img width="1919" height="973" alt="image" src="https://github.com/user-attachments/assets/cc4dc758-3bca-4430-953d-e6dff6b9fafe" />
<img width="542" height="965" alt="image" src="https://github.com/user-attachments/assets/cfc5005a-7bbf-4fc6-a119-62fb57f0f577" />



